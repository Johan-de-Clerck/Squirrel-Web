#pragma once
#include <JuceHeader.h>
#include <algorithm>
#include <array>
#include <atomic>
#include <cmath>
#include <cstdint>
#include <mutex>
#include <vector>

// First native VA audio path: browser schedules notes; JUCE renders Bass, Lead,
// and Chord directly to the selected Windows device (including Focusrite ASIO).
// Only short events are queued on the UI thread. No heap allocations in render.
class SquirrelNativeAudio final : public juce::AudioSource
{
public:
    struct Patch
    {
        int wave1 = 0, wave2 = 0, subWave = 2, subOctave = -12;
        float level1 = .46f, level2 = .27f, subLevel = .0875f;
        float detune2 = 0, subDetune = 0, pulseWidth = .5f;
        float cutoff = 4500, resonance = .7f;
        float attack = .01f, decay = .2f, sustain = .7f, release = .25f;
        float trackGain = .65f, master = .75f, pan = 0;
    };
    struct Command
    {
        enum Type { on, off, pitch, mix, panic } type = on;
        uint64_t id = 0;
        int track = 3, note = 60;
        float velocity = 1, cents = 0, level = 1;
        Patch patch;
        uint64_t at = 0;
    };

    void prepareToPlay (int, double newRate) override
    {
        rate.store (newRate > 0 ? newRate : 48000.0);
        sampleCounter.store (0);
        for (auto& v : voices) v.active = false;
    }
    void releaseResources() override {}
    void setTestTone (bool on) noexcept { testTone.store (on); }

    void submit (Command command, double delayMs)
    {
        const auto sr = rate.load();
        command.at = sampleCounter.load() + static_cast<uint64_t> (std::max (0.0, delayMs) * sr / 1000.0);
        const std::lock_guard<std::mutex> guard (queueMutex);
        // A STOP/panic must also discard notes pre-scheduled by the web sequencer.
        if (command.type == Command::panic) pending.clear();
        if (pending.size() < 4096) pending.push_back (command);
    }

    void getNextAudioBlock (const juce::AudioSourceChannelInfo& info) override
    {
        info.clearActiveBufferRegion();
        if (!info.buffer) return;
        // Move control events out of the short-lived queue without holding a
        // lock during synthesis. When contended, service them next callback.
        if (queueMutex.try_lock())
        {
            incoming.swap (pending);
            queueMutex.unlock();
            for (const auto& cmd : incoming)
            {
                if (cmd.type == Command::panic)
                {
                    eventCount = 0;
                    for (auto& v : voices) v.active = false;
                }
                else if (eventCount < static_cast<int> (events.size()))
                    events[eventCount++] = cmd;
            }
            incoming.clear();
        }
        const auto sr = rate.load();
        const auto begin = sampleCounter.load();
        auto* left = info.buffer->getWritePointer (0, info.startSample);
        auto* right = info.buffer->getNumChannels() > 1
                          ? info.buffer->getWritePointer (1, info.startSample) : nullptr;
        for (int i = 0; i < info.numSamples; ++i)
        {
            const auto now = begin + static_cast<uint64_t> (i);
            for (int e = 0; e < eventCount; )
            {
                if (events[e].at <= now)
                {
                    apply (events[e]);
                    events[e] = events[--eventCount];
                }
                else ++e;
            }
            float l = 0, r = 0;
            for (auto& v : voices)
            {
                if (!v.active) continue;
                const float sample = renderVoice (v, sr);
                l += sample * v.panLeft;
                r += sample * v.panRight;
            }
            if (testTone.load())
            {
                testPhase += 440.0 / sr;
                if (testPhase >= 1.0) testPhase -= 1.0;
                l += .08f * std::sin (static_cast<float> (2.0 * juce::MathConstants<double>::pi * testPhase));
                r += .08f * std::sin (static_cast<float> (2.0 * juce::MathConstants<double>::pi * testPhase));
            }
            left[i] = std::tanh (l);
            if (right) right[i] = std::tanh (r);
        }
        sampleCounter.store (begin + static_cast<uint64_t> (info.numSamples));
    }

private:
    struct Voice
    {
        uint64_t id = 0;
        bool active = false, releasing = false;
        int track = 3;
        Patch patch;
        double phases[3] {}, baseHz = 440;
        float cents = 0, fxLevel = 1, velocity = 1;
        float envelope = 0, age = 0, releaseStart = 0, releaseAge = 0;
        float low1 = 0, low2 = 0, panLeft = 1, panRight = 1;
    };
    static float waveform (int wave, double phase, float width)
    {
        const auto p = static_cast<float> (phase);
        switch (wave)
        {
            case 0: return 2.0f * p - 1.0f;                       // saw
            case 1: return p < width ? 1.0f : -1.0f;              // pulse
            case 2: return std::sin (2.0f * juce::MathConstants<float>::pi * p);
            case 3: return 1.0f - 4.0f * std::abs (p - .5f);       // triangle
            default: return p < .5f ? 1.0f : -1.0f;                // square
        }
    }
    void apply (const Command& c)
    {
        if (c.type == Command::panic)
        {
            for (auto& v : voices) v.active = false;
            return;
        }
        if (c.type == Command::on)
        {
            auto* free = &voices[0];
            for (auto& v : voices)
                if (!v.active) { free = &v; break; }
            free->active = true;
            free->releasing = false;
            free->id = c.id;
            free->track = c.track;
            free->baseHz = 440.0 * std::pow (2.0, (c.note - 69.0) / 12.0);
            free->patch = c.patch;
            free->velocity = juce::jlimit (0.0f, 1.0f, c.velocity);
            free->age = free->releaseAge = free->envelope = 0;
            free->releaseStart = 0;
            free->cents = 0; free->fxLevel = 1;
            free->low1 = free->low2 = 0;
            for (auto& phase : free->phases) phase = 0;
            updatePan (*free);
            return;
        }
        for (auto& v : voices)
        {
            if (!v.active || (c.id != 0 && c.id != v.id)) continue;
            if (c.type == Command::off)
            {
                v.releasing = true;
                v.releaseAge = 0;
                v.releaseStart = v.envelope;
            }
            else if (c.type == Command::pitch)
            {
                v.cents = c.cents;
                v.fxLevel = juce::jlimit (0.0f, 1.0f, c.level);
            }
            else if (c.type == Command::mix && v.track == c.track)
            {
                v.patch.level1 = c.patch.level1;
                v.patch.level2 = c.patch.level2;
                v.patch.subLevel = c.patch.subLevel;
                v.patch.trackGain = c.patch.trackGain;
                v.patch.master = c.patch.master;
                v.patch.pan = c.patch.pan;
                v.patch.cutoff = c.patch.cutoff;
                updatePan (v);
            }
        }
    }
    static void updatePan (Voice& v)
    {
        const auto pan = juce::jlimit (-1.0f, 1.0f, v.patch.pan);
        v.panLeft = std::sqrt ((1.0f - pan) * .5f);
        v.panRight = std::sqrt ((1.0f + pan) * .5f);
    }
    float renderVoice (Voice& v, double sr)
    {
        const auto& p = v.patch;
        const auto dt = static_cast<float> (1.0 / sr);
        if (!v.releasing)
        {
            v.age += dt;
            const float attack = std::max (.003f, p.attack), decay = std::max (.01f, p.decay);
            if (v.age < attack) v.envelope = v.age / attack;
            else if (v.age < attack + decay)
                v.envelope = 1.0f - (1.0f - p.sustain) * ((v.age - attack) / decay);
            else v.envelope = p.sustain;
        }
        else
        {
            v.releaseAge += dt;
            v.envelope = v.releaseStart * (1.0f - v.releaseAge / std::max (.02f, p.release));
            if (v.envelope <= .0001f) { v.active = false; return 0; }
        }
        const auto pitch = std::pow (2.0, v.cents / 1200.0);
        const double frequencies[] = {
            v.baseHz * pitch,
            v.baseHz * pitch * std::pow (2.0, p.detune2 / 1200.0),
            v.baseHz * pitch * std::pow (2.0, (p.subOctave * 100 + p.subDetune) / 1200.0)
        };
        const float gains[] = { p.level1, p.level2, p.subLevel };
        const int waves[] = { p.wave1, p.wave2, p.subWave };
        float raw = 0;
        for (int k = 0; k < 3; ++k)
        {
            if (gains[k] < .0001f) continue;
            raw += gains[k] * waveform (waves[k], v.phases[k], p.pulseWidth);
            v.phases[k] += frequencies[k] / sr;
            v.phases[k] -= std::floor (v.phases[k]);
        }
        // Lightweight, stable two-pole lowpass (resonance feedback).
        const auto cutoff = juce::jlimit (70.0f, static_cast<float> (sr * .45), p.cutoff);
        const auto g = juce::jlimit (0.001f, .95f, 1.0f - std::exp (-2.0f * juce::MathConstants<float>::pi * cutoff * dt));
        const float resonance = juce::jlimit (0.0f, .75f, (p.resonance / 18.0f) * .75f);
        const float x = raw - v.low2 * resonance;
        v.low1 += g * (x - v.low1);
        v.low2 += g * (v.low1 - v.low2);
        return v.low2 * v.envelope * v.velocity * v.fxLevel * p.trackGain * p.master;
    }
    std::array<Voice, 64> voices {};
    std::array<Command, 4096> events {};
    int eventCount = 0;
    std::vector<Command> pending, incoming;
    std::mutex queueMutex;
    std::atomic<double> rate {48000.0};
    std::atomic<uint64_t> sampleCounter {0};
    std::atomic<bool> testTone {false};
    double testPhase = 0;
};