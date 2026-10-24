<div align="center">
  <img src="squirrel-icon.webp" alt="Squirrel Studio icon" width="112">
  <h1>Squirrel Studio</h1>
  <p><strong>A browser-based groovebox, synthesizer, sampler and tracker-style step sequencer.</strong></p>
  <p><strong>Current version: 0.2.46</strong> · <a href="index.html">Launch the application</a> · <a href="https://github.com/Johan-de-Clerck/Squirrel-Web/archive/refs/heads/main.zip">Download the repository</a></p>
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
| **Files and export** | Save/load songs as JSON, render synth notes to WAV/library, **bounce the selected pattern to a WAV or any of 15 library slots** (muted tracks excluded), export 16/24-bit stereo song WAVs, and export track stems to ZIP. |

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

Open **FILE → Render / Export** to choose **44.1 or 48 kHz**, **16-bit or 24-bit stereo PCM**, and an **FX tail of 3, 6 or 10 seconds**. Choose a full stereo mix, the selected audio track, or all internal audio tracks as a ZIP of sample-aligned WAV stems. Stem ZIPs include `STEMS_INFO.txt` and can include a full-mix reference. MIDI-only tracks cannot be rendered.

**Single synth sample:** select an internal VA/FM track, then choose **FILE → RENDER VA/FM SYNTH TO WAV**. Enter a root note (such as `C-3`) and a hold duration (0.05–15 seconds). This uses the **same FM2/FM4, VA, PWM, filter envelopes, LFO, track mix, sends and master FX** as a selected-track song render, without playing the current pattern or changing the song. The WAV inherits the sample rate, bit depth, FX-tail, normalization and dither settings shown in the File menu. Any active effects are baked into the sample, so avoid applying them twice if you load it back into a SAMPLE track.

**Save directly to the 15-sample library (0.2.44):** in **FILE → RENDER / EXPORT**, choose **SYNTH SAMPLE DESTINATION** before rendering: **DOWNLOAD WAV**, **SAVE TO 15-SAMPLE LIBRARY (FIRST FREE)**, or **DOWNLOAD WAV + SAVE TO LIBRARY**. Saving to the library picks the first empty slot and never overwrites an existing sample. Open **DRUM SAMPLES** to assign the new library sound to one of a drum track's five slots. The stored WAV is also included in complete song JSON and sample-bank exports. When all 15 slots are occupied, clear one before saving. Your destination preference is remembered by the browser. WAV effects are baked in, and the cached sample preserves the export sample rate.

**Bounce Pattern to Sample (0.2.45):** in the FILE menu choose **BOUNCE SELECTED PATTERN TO SAMPLE**. Set **BOUNCE DESTINATION** to **DOWNLOAD WAV FILE** or one of the fifteen numbered library slots. The currently selected pattern is rendered once, even if Song Mode is enabled. **Muted tracks and MIDI-only tracks are excluded**; active Solo buttons further restrict the bounced mix. Choose **EXACT PATTERN · LOOP** for the exact step duration, or add a 3/6/10-second effect tail. With exact loops, the optional **LOOP CROSSFADE** selector offers **Off, 2 ms, 5 ms or 10 ms**. It blends the final and first stereo samples at the wrap boundary to reduce playback clicks without adding or deleting any frames. Off preserves the original audio. Crossfade automatically disables when an FX tail is selected and has no effect on normal song WAV or stem exports; the tail and crossfade preferences are remembered. The bounce uses the same stereo engine, track FX, master effects, sample rate, bit depth, normalization and dither as song export. For a populated slot, confirm replacement before rendering; this changes its sound everywhere that library slot is assigned, so make a project backup first. A bounced sample is not automatically assigned to a track. Each slot has a **16 MB maximum**; choose 16-bit / 44.1 kHz or remove the tail for longer bounces.

**Peak Normalize** is optional and off by default. When enabled, it adjusts each exported WAV to a peak of **−1 dBFS** without changing live playback. **TPDF Dither** is available for 16/24-bit PCM. Exports warn when an unnormalized WAV exceeds 0 dBFS. Disable normalization for stems if preserving relative track levels matters.

The offline synth renderer follows VA/FM transposition, VA sub-oscillator fine tuning, LFO-routed PWM, FM2 modulation envelopes, and **four-operator FM carrier/modulator envelopes**. Synth cutoff/resonance and patch filter envelopes are also scheduled in the song WAV render, including accurate release on short notes. Stems and the optional full-mix reference share chance and generated-noise decisions, but nonlinear compression and shared effects can prevent an exact sum.

**Note:** MIDI-only tracks send events to external instruments and are not captured as audio by the browser's offline WAV renderer.

## Major milestones

This is intentionally a **high-level release history**. Small bug fixes, internal refactors and individual patch versions are recorded in [GitHub commits](https://github.com/Johan-de-Clerck/Squirrel-Web/commits/main), not duplicated here.

| Release | Major changes |
| --- | --- |
| **0.2.x — Song production & export** | Compact Synth and Drum editors; expanded stereo mixer; enhanced waveform editor; Song Mode and cross-pattern continuation; stereo WAV/stem export; **VA/FM synth rendering and muted-aware pattern bounce directly to the 15-sample library**. |
| **0.1.7x–0.1.8x — Advanced synthesis & sampling** | VA and FM engines, four-operator FM algorithms, PWM/LFO routing, shared drum sample library, per-slot filters and envelopes, sample looping and Step FX. |
| **0.1.x — Foundation** | Eight-track web groovebox, tracker-style sequencer, instrument tracks, MIDI integration, basic FX and pattern workflow. |

## Project

Squirrel Studio is under active development. Existing songs may use features that evolve in later builds; save a backup of your JSON projects before testing substantial updates.

This repository contains the web application. A separate Windows desktop version may be developed later.