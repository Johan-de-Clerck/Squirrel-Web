<img src="squirrel-icon.webp" alt="Squirrel Studio mascot" width="128" height="128">

# Squirrel Studio — Web Synth & Step Sequencer

**Current web version: 0.1.49**  
**Current application:** [index.html](index.html)  
**Download latest repository ZIP:** [Squirrel Studio Web — latest](https://github.com/Johan-de-Clerck/Squirrel-Web/archive/refs/heads/main.zip)

> Download the ZIP linked above rather than an older file from a previous checkout. This branch archive always includes the current `index.html` and documentation. If you still see an older build, replace locally extracted files or hard-refresh the hosted page.

Squirrel Studio is a browser-based eight-track groovebox combining synthesized and sampled instruments, a tracker-style step sequencer, MIDI, effects and a draggable song arrangement.

## Start here

1. Download the **latest ZIP** linked above and extract it, or use the files from the `main` branch.
2. On a web server, place `index.html`, `demo.json` and `squirrel-icon.webp` in the same directory.
3. Open the app in a current Chrome or Microsoft Edge browser over HTTP/HTTPS.
4. Click **START AUDIO** and then **PLAY**.

For local Windows development, run `START_STUDIO.cmd` (Python 3 required) and open <http://localhost:8765>. Loading `index.html` using `file://` can prevent loading `demo.json` and may limit MIDI support.

Read [HELP.md](HELP.md) for the full English user guide.

## What is new in 0.1.49

- **Eight independent mixer VU meters:** each track now has its own audio analyser in the post-volume, post-pan dry signal path, before the master bus.
- A track meter responds to only that track's audio, not the overall mix or notes on another track.
- Quiet tracks display **0%** rather than a simulated signal; level falls naturally after playback stops.
- Mute, solo, volume and MIDI OUT ONLY routing continue to affect the associated track's meter.
- The analyzer is a passive pass-through: mixer controls and audio routing remain unchanged.

## Features added in 0.1.48

- **32 independent patterns:** A1–A8, B1–B8, C1–C8 and D1–D8.
- **Compact pattern picker:** select bank A/B/C/D and then choose one of its eight patterns. The Options pattern picker uses the same grouped design.
- Existing 4-pattern and 16-pattern project files are automatically migrated, including patterns, notes, names, per-track lengths, active pattern and Song Mode arrangement.
- The redundant track/step subtitle has been removed below the Step Editor and Step FX headings.
- **Audio ON** is green again while the browser audio engine is running, returning to its ordinary style when it stops.
- **Bass and Lead now support per-track distortion**, alongside Drum and Sample tracks.
- **Enter auditions a step while it is held:** release Enter to stop the preview, including long samples and drum samples, with MIDI note-off for MIDI-only tracks.

## Changes in 0.1.47

- Larger centered sequencer note glyphs (12 px) and FX labels (11 px) without changing step dimensions; text is clipped safely within each cell.
- **Ctrl+C / Ctrl+V** now copies an entire highlighted rectangular range of notes, FX and empty steps, even across multiple tracks. Paste from the selected destination track/step; incomplete edges are safely clipped to destination track lengths.
- **COPY RANGE / PASTE RANGE** labels appear on the Step Editor buttons when a range is selected/copied. Single-step copy/paste still works.
- Range clipboard can be pasted in another pattern and reused multiple times.

## Improvements since 0.1.42

- **Freely assignable instrument types on all eight tracks:** DRUM, BASS, LEAD and SAMPLE, plus legacy-compatible CHORD. For example, four independent samplers with four drum tracks, or eight bass synths, are possible.
- Each DRUM track has **five independent sample slots** and a choice of synthesized kick, snare or hi-hat when no suitable sample is available.
- Any SAMPLE track has its own root note, start/end markers, optional loop markers, cutoff and resonance.
- Each BASS/LEAD/CHORD track has its own oscillator, sub-oscillator, filter and envelope patch. Switching between synth types preserves their respective sound presets.
- Track-type selection is available both in **SEQUENCER → Step Editor** and **OPTIONS → Track Instrument Types**.
- The sample and drum editors show the tracks configured for their instrument type.
- Fixes in 0.1.49: sampler root-note persistence, sample loading during project/track switching, default sampler volume when resetting the mixer, MIDI-independent audio device wording, and clearer empty-sampler behavior.
- The Step Editor and Step FX retain a consistent height; their vertical scrollbars are hidden.
- Import/export sample banks supports **all eight tracks** (bank format v2); older v1 sample banks can still be imported.

## Core features

- Eight-track sequencer, 32 patterns (A1–D8), custom names, independent **1–32 steps** per track and draggable Song Mode.
- Click to select a step; drag to select a range; **Ctrl+C** copies every selected step and its FX, **Ctrl+V** pastes it at the newly selected position; Delete removes notes without deleting step FX.
- ProTracker note keyboard: **Z** starts lower C, **Q** starts the next octave C.
- Dual oscillators plus sub oscillator, selectable waveforms, detune, PWM, filters and envelopes.
- Delay, reverb, chorus and per-track distortion on Drum, Sample, Bass and Lead instruments; four LFOs and two filter envelopes with per-track routing.
- Track-specific **INTERNAL AUDIO / MIDI OUT ONLY** routing with selectable MIDI channel 1–16; MIDI-only tracks silence their internal instrument.
- Sample editing with conditional loop handles (visible only when **LOOP ON**).
- **UNDO / REDO**, 1–6× ratchets, chance, velocity, gate, step FX and song arrangement.
- Complete project JSON including samples; portable sample banks and optional `demo.json` auto-loading.

## Shortcuts

| Input | Action |
| --- | --- |
| Click a note/FX step | Select it, without changing its on/off state |
| Hold and drag across steps | Select a rectangular range across tracks |
| Delete | Clear selected notes, retaining FX |
| Hold Enter on a sequencer cell | Toggle the step and audition an enabled note; release Enter to stop the sound |
| Z/S/X/D/C/V/G/B/H/N/J/M | Lower ProTracker octave |
| Q/2/W/3/E/R/5/T/6/Y/7/U | Upper ProTracker octave |
| Alt+1–8 | Select track 1–8 |
| Ctrl+Z / Ctrl+Y | Undo / redo |
| Ctrl+C / Ctrl+V | Copy / paste a full highlighted range (or one step with no range) |
| Space | Start/stop playback |

## Repository files

- `index.html` — **current Squirrel Studio Web 0.1.49** application
- `demo.json` — included song with sample data
- `squirrel-icon.webp` — mascot and favicon
- `README.md` — current version, downloads and overview
- `HELP.md` — English user manual
- `START_STUDIO.cmd` — local Windows development server
- `tests/track-routing.test.js`, `tests/pattern-bank-and-enter.test.js` and `tests/mixer-meters.test.js` — offline regression tests, run with `node tests/track-routing.test.js` (no npm installs or GitHub Actions required)
- `windows/` — experimental desktop port, which may lag behind web features

### Audio and limitations

The web edition uses **Web Audio**, not direct ASIO. MIDI device access depends on browser permissions and supported operating systems. The Windows JUCE desktop source is experimental. Audio playback and browser behavior require manual testing on the actual device in addition to code-level regression tests.

To check that the latest build loaded, look for **BUILD 0.1.49** in the app header. If an earlier build appears, replace locally extracted files or force refresh (**Ctrl+F5**).