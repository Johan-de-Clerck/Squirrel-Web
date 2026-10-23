<div align="center">
  <img src="squirrel-icon.webp" alt="Squirrel Studio icon" width="112">
  <h1>Squirrel Studio</h1>
  <p><strong>A browser-based groovebox, synthesizer, sampler and tracker-style step sequencer.</strong></p>
  <p><strong>Current version: 0.2.40</strong> · <a href="index.html">Launch the application</a> · <a href="https://github.com/Johan-de-Clerck/Squirrel-Web/archive/refs/heads/main.zip">Download the repository</a></p>
</div>

Squirrel Studio brings synthesis, sampling, sequencing, effects and song arrangement into a compact, eight-track music workstation. The web version runs in a modern desktop browser using the Web Audio API.

## Features

| Area | Highlights |
| --- | --- |
| **Sequencer** | Eight freely configurable tracks, tracker-style note input, up to 32 steps in view, per-track pattern lengths, chance, ratchets and Step FX. |
| **Instruments** | Virtual analog (VA) and FM synthesizers, sampled instruments, drum tracks and chord playback. Independent sounds for different tracks. |
| **VA / FM engines** | Multi-oscillator VA with sub oscillator, noise and PWM; two- and four-operator FM with selectable algorithms. |
| **Drum library** | A shared pool of 15 samples, with five assignable slots per drum track and independent slot controls. |
| **Sample editing** | Stereo waveforms, trim and loop points, normal and ping-pong loops, pitch, filters and envelopes. Mouse wheel zooms; middle-button drag pans the waveform. |
| **Song Mode** | Arrange named patterns into a sequence. Selected sample and drum steps can continue across pattern boundaries, and C00 triggers release. |
| **Mixer and FX** | Stereo volume and pan, mute/solo, per-track audition, distortion, delay, reverb and chorus sends. |
| **MIDI** | MIDI input and per-track MIDI output options, including MIDI-only tracks. Availability depends on browser and hardware support. |
| **Files and export** | Save/load songs as JSON, import audio and sample banks, render a synth to WAV, export a 16/24-bit stereo song WAV, or export individual track stems to ZIP (with optional full-mix reference and metadata). |

## Getting started

1. [Download the latest source ZIP](https://github.com/Johan-de-Clerck/Squirrel-Web/archive/refs/heads/main.zip) and extract it.
2. Keep `index.html`, `squirrel-icon.webp` and (if used) `demo.json` in the same folder.
3. Serve the folder via HTTP/HTTPS and open it in a current Chrome or Edge browser.
4. Press **START AUDIO**, add notes in the **SEQUENCER**, and press **PLAY**.

For Windows local testing, run `START_STUDIO.cmd` with Python 3 installed, then open <http://localhost:8765>. Opening `index.html` directly with `file://` may restrict loading the demo and Web MIDI features.

See [HELP.md](HELP.md) for the detailed guide.

## Workflow and shortcuts

- **FILE** (above the editor tabs): New Song, Open/Save Song, sample import, sample-bank import/export, render and WAV export.
- **SYNTH / DRUM SAMPLES / SAMPLE EDITOR**: edit the selected sound without losing other track and slot settings.
- **SONG MODE**: chain patterns and manage cross-pattern sample continuation with **Step FX → Continue into next pattern**. A small check appears on an affected step only when continuation is enabled.
- **Esc**: toggle Edit Mode when not entering text or using a menu.
- **Sample Editor**: mouse wheel = zoom at the pointer; hold the middle mouse button and drag = horizontal navigation.

### Song WAV export

Open **FILE → Render / Export** to choose **44.1 or 48 kHz** and an **FX tail of 3, 6 or 10 seconds**. Exports use **16-bit stereo PCM**.

**Peak Normalize** is optional and off by default. When enabled, it adjusts the exported file to a peak of **−1 dBFS**; it does not alter live playback or change the effect balance. The export message reports the original peak. If normalization is disabled and the peak exceeds 0 dBFS, the app warns that samples will clip when converted to PCM16.

**Note:** MIDI-only tracks send events to external instruments and are not captured as audio by the browser's offline WAV renderer.

## Major milestones

This is intentionally a **high-level release history**. Small bug fixes, internal refactors and individual patch versions are recorded in [GitHub commits](https://github.com/Johan-de-Clerck/Squirrel-Web/commits/main), not duplicated here.

| Release | Major changes |
| --- | --- |
| **0.2.x — Song production & export** | Compact Synth and Drum editors; expanded stereo mixer; enhanced waveform editor; cross-pattern sample continuation; Song Mode; more faithful stereo WAV rendering with export-quality controls. |
| **0.1.7x–0.1.8x — Advanced synthesis & sampling** | VA and FM engines, four-operator FM algorithms, PWM/LFO routing, shared drum sample library, per-slot filters and envelopes, sample looping and Step FX. |
| **0.1.x — Foundation** | Eight-track web groovebox, tracker-style sequencer, instrument tracks, MIDI integration, basic FX and pattern workflow. |

## Project

Squirrel Studio is under active development. Existing songs may use features that evolve in later builds; save a backup of your JSON projects before testing substantial updates.

This repository contains the web application. A separate Windows desktop version may be developed later.