<img src="squirrel-icon.webp" alt="Squirrel Studio mascot" width="128" height="128">\n\n# Squirrel Studio — Web Synth & Step Sequencer

**Current web version: 0.1.38**

Squirrel Studio is a browser-based eight-track groovebox and step sequencer featuring synthesized instruments, sampled drums, MIDI, effects, and a draggable song arrangement.

## Start here

1. Place `index.html` and `demo.json` together on your web server (HTTPS recommended).
2. Open the site in **Chrome** or **Microsoft Edge**.
3. Click **AUDIO ON** to enable audio playback, then press **PLAY**.

For local Windows development, run `START_STUDIO.cmd` (Python 3 required) and open <http://localhost:8765>. Opening `index.html` directly with `file://` can prevent loading `demo.json`.

Read **[HELP.md](HELP.md)** for the complete English user guide.

## Features

- Eight tracks: Kick, Snare, Hi-Hat, Bass, Lead, Chord, and two configurable sampler slots.
- 16 patterns, custom pattern names, and independent 1–32 step lengths per track (default 32).
- Song Mode with draggable pattern tiles; shorter tracks repeat until the longest one finishes.
- Five loadable drum sample slots on each of tracks 1–3 (15 total), with per-step selection, remembered active slots, and four configurable choke groups.
- Samplers on tracks 7–8, including waveform preview, loop markers, root note, filter and resonance.
- Bass, Lead and Chord synthesizers: dual oscillators, sub oscillator, filter and envelopes.
- Step FX, delay, reverb, chorus, supported-track distortion, four LFOs, and two filter envelopes.
- Mouse-drag step range selection (including across tracks); Delete clears the range's notes without changing FX.
- UNDO / REDO with Ctrl+Z, Ctrl+Y or Ctrl+Shift+Z, plus editor buttons.
- MIDI input and output via supported Web MIDI browsers.
- Save/load complete project JSON, including embedded samples; import/export separate sample bank JSON.
- Optional project filename, online `demo.json`, and a locally saved project.

## Quick keyboard reference

| Input | Action |
| --- | --- |
| Click a note/FX step | Select only; do not modify it |
| Hold and drag over steps | Select a rectangular range across steps and tracks |
| Delete with a range selected | Remove selected notes, preserving their FX |
| Ctrl+Z / Ctrl+Y | Undo / redo an edit |
| Enter on a focused sequencer cell | Toggle the selected note |
| Delete | Remove the selected note; preserve FX |
| Home / End | Jump to first / last step for that track |
| Arrow keys | Move through steps and tracks |
| Ctrl+C / Ctrl+V with grid focus | Copy / paste the complete selected step |
| Space | Toggle playback |
| Edit On + `A W S E D F T G Y H U J` | Enter notes |

## Current files on `main`

- `index.html` — current web application\n- `squirrel-icon.webp` — squirrel mascot used as the web favicon and application logo
- `demo.json` — the **Johan_01** demo (120 BPM, Main / Odd Track / Odd Snare), including embedded kick, clap, hi-hat and snare samples
- `SquirrelStudio_Web_0.1.38.zip` — current web package
- `README.md` — overview
- `HELP.md` — detailed English manual
- `START_STUDIO.cmd` — local web server launcher
- `windows/` — separate experimental desktop source
- `.github/workflows/windows-desktop.yml` — manual Windows build

Older numbered HTML and ZIP copies were removed from the current branch to avoid confusion. Previous code revisions remain in normal Git history.

### Web Audio and ASIO

The browser version uses **Web Audio**, not direct ASIO. The `windows/` JUCE desktop project is experimental and may not yet reproduce every web feature, especially newer drum-sample features.

*User documentation for Squirrel Studio Web 0.1.38.*
