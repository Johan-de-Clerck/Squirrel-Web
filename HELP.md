# Squirrel Studio Web 0.1.50 — User Manual

This manual covers the current **browser** edition of Squirrel Studio. Menu labels and control names match the English interface.

## 1. Getting started

**Online:** upload `index.html` and `demo.json` to the same directory on your website. Open the site using HTTPS and a current version of Chrome or Microsoft Edge. Click **AUDIO ON** to activate sound.

**Windows local server:** install Python 3; place `START_STUDIO.cmd`, `index.html`, and `demo.json` in one directory; launch the CMD file and open `http://localhost:8765`.

Avoid opening `index.html` directly as a `file://` URL if you rely on automatic `demo.json` loading or Web MIDI. Start at a low listening volume.

## 2. Tracks and workspaces

**Every one of the eight tracks independently supports DRUM, BASS, LEAD and SAMPLE.** CHORD is also available for existing songs.

| Track | Default | Available instrument types |
| --- | --- | --- |
| 1 | Drum (Kick) | Drum / Bass / Lead / Sample / Chord |
| 2 | Drum (Snare) | Drum / Bass / Lead / Sample / Chord |
| 3 | Drum (Hi-hat) | Drum / Bass / Lead / Sample / Chord |
| 4 | Bass | Drum / Bass / Lead / Sample / Chord |
| 5 | Lead | Drum / Bass / Lead / Sample / Chord |
| 6 | Chord | Drum / Bass / Lead / Sample / Chord |
| 7 | Sample | Drum / Bass / Lead / Sample / Chord |
| 8 | Sample | Drum / Bass / Lead / Sample / Chord |

Choose an instrument in **SEQUENCER → Step Editor → Instrument Type** or **OPTIONS → Track Instrument Types**. Examples include four Sample tracks with four Drum tracks, or eight independent Bass synths. Track numbers do not dictate the sound engine. Previous samples and synthesizer patches remain available when you switch a track back.

For a DRUM track, **DRUM SOUND (IF NO SAMPLES)** offers Kick, Snare and Hi-hat as built-in fallbacks. This control is not shown on Bass, Lead or Sample tracks.

Use **SEQUENCER**, **SONG MODE**, **SYNTH**, **MIXER**, **LFO / ENVELOPES**, **DRUM SAMPLES**, **SAMPLE EDITOR**, **SEND FX**, **OPTIONS** and **MIDI / AUDIO** to open the corresponding workspace.

## 3. Sequencer and entering notes

When you press **Enter** on a focused sequencer step, the note toggles. If the step becomes active, its instrument is auditioned immediately. **Keep Enter pressed to continue the preview**, and **release Enter to send a note-off**. For example, a five-second sample stops when Enter is released, even if the sound file has not finished. This applies to drum samples, Sample instruments, synth notes and MIDI-only tracks. The AUDIO ON button has a green state while the Web Audio engine is active.

### Larger step text without larger cells

Starting with 0.1.47, active notes and FX text are slightly larger, centered and clipped within the existing step dimensions. The step layout and sequencer height do not change.

### Stable sequencer height

Switching between Drums 1, Drums 2, Drums 3, Bass, Lead, Chord, Sampler or MIDI-only tracks no longer changes the **height of the Step Sequencer**. The **Step Editor** and **Step FX** panels below it keep a fixed, responsive height. If selecting a track reveals more settings than fit inside either editor, **scroll with the mouse wheel or touchpad inside that panel (the scrollbar is hidden)**; the sequencer remains at the same height. This applies to the compact desktop layout and smaller screens as well.


Clicking any note cell **only selects** that cell: it does not insert or erase a note. **Hold the left mouse button and drag** from one step to another to select a highlighted, rectangular range; this also works across multiple tracks. Release the button to finish. Drag-selecting does not change the music. **Ctrl+C** copies the entire rectangular selection, including inactive (off) notes and their step FX; click the first destination step on another track and press **Ctrl+V** to paste every copied step at matching offsets. Copying multiple tracks pastes on consecutive destination tracks. Steps outside the target track length or beyond track 8 are skipped. The clipboard is a snapshot and can be pasted multiple times or into another pattern. If no range is selected, Ctrl+C/V continues to copy/paste one step. Press **Delete** to clear the notes in the range (FX remain). Clicking once elsewhere clears the range and selects a single step. An active step displays its note or the relevant drum sample slot. Select a cell and use **Enter** to toggle it on/off, **Delete** to clear its note, or enter a pitch with the computer keyboard while **EDIT ON**.

The **ProTracker keyboard layout** uses two rows. The **lower octave** starts at **Z = C**, with **S = C#**, **X = D**, **D = D#**, **C = E**, **V = F**, **G = F#**, **B = G**, **H = G#**, **N = A**, **J = A#**, **M = B**. The **upper octave** starts at **Q = C**, then **2 = C#**, **W = D**, **3 = D#**, **E = E**, **R = F**, **5 = F#**, **T = G**, **6 = G#**, **Y = A**, **7 = A#**, **U = B**. The top row continues at **I = the next C**, **9 = C#**, **O = D**, **0 = D#**, **P = E**. Use the octave selector to choose the base octave. **Alt+1 through Alt+8** selects tracks without conflicting with the upper-row sharp-note keys. When editing notes, the cursor advances unless already at the end of the selected track.

| Key / control | Action |
| --- | --- |
| Enter (sequencer cell focused) | Turn the selected step on/off; hold Enter to audition its note and release to stop the sound |
| Delete | Remove the selected note, retaining FX |
| Home / End | Jump to step 1 / final step in the selected track |
| Left / Right | Previous / next step |
| Up / Down | Previous / next track |
| Ctrl+C / Ctrl+V (sequencer) | Copy / paste the entire selected range, or one step if none |
| Ctrl+Z / Ctrl+Y | Undo / redo an edit; Ctrl+Shift+Z also redoes |
| Drag the mouse from one step to another | Select a rectangular range across steps/tracks |
| Delete with a range selected | Delete notes in that range, keeping FX |
| COPY STEP / PASTE STEP | Copy/paste the note, drum slot, velocity, gate, ratchet, chance and FX |
| Space | Start/stop playback |
| Z / S / X / D / C / V / G / B / H / N / J / M | Lower-octave note keys |
| Q / 2 / W / 3 / E / R / 5 / T / 6 / Y / 7 / U | Upper-octave note keys |
| Alt+1 through Alt+8 | Select a track directly |
| Mouse click on grid | Move selection only |

**COPY RANGE / PASTE RANGE** buttons appear automatically when range copying is in use. The Step Editor includes **UNDO / REDO** buttons. They reverse changes to notes, step parameters, pattern lengths, pattern names and other editable project parameters. They do not undo loading a different project or importing/replacing the audio files. A copied step may be pasted onto a different track, step or pattern. **COPY PATTERN** and **PASTE PATTERN** copy the entire pattern and its per-track lengths. In the Step Editor you can also edit velocity, gate, ratchet, chance and the selected drum sample.

### BPM precision (0.1 BPM)

The BPM field accepts fractional tempos in **0.1 BPM steps**, from **50.0** to **240.0**. For example, select **120.3** (the browser may display a comma instead of a decimal point according to your locale). Use the keyboard arrow keys on the BPM input to adjust the tempo by one tenth.

The chosen tempo controls sequencer playback and tempo-synchronized LFO rates. It is saved in your project JSON, restored when you reopen the project, and preserved when migrating compatible older songs.

## 4. Patterns, lengths and Song Mode

**Backwards compatibility:** On import, the app upgrades old 16-pattern A1–D4 projects to 32-pattern A1–D8 projects. Existing A1–D4 patterns retain their names, notes, effects, lengths and song arrangement order. The additional A5–A8, B5–B8, C5–C8 and D5–D8 slots start empty.

There are **32 patterns** (A1–D8), grouped as A1–A8, B1–B8, C1–C8 and D1–D8. Choose a **bank letter (A–D)**, then choose a **pattern from 1–8** using the two compact dropdowns in the sequencer. The Options panel also provides a grouped pattern picker. Use the **NAME** input to rename it, such as `Intro`, `Verse`, or `Chorus`. Names are saved in the project JSON and displayed in Song Mode.

Each track has an independent **step length from 1 to 32**, initially **32**. You can change it next to the track or in **OPTIONS**.

The effective pattern length is the **longest** enabled track length. For example, if the kick runs for 32 steps and the hi-hat for 6, the hi-hat repeats its six steps until the global position reaches 32. **Song Mode advances only then**. The song arrangement can contain a pattern several times and can be reordered by dragging tiles. Song Mode can be enabled or disabled.

## 5. Drum samples — any track configured as DRUM

Open **DRUM SAMPLES** and choose any track whose instrument type is **DRUM**. Each Drum track has five independently loadable sample slots (up to 40 across all eight tracks). Press **LOAD**, **USE**, **PREVIEW** or **CLEAR** for a slot. File decoding depends on the browser; WAV is recommended. Each sample may be at most 16 MB.

Each track remembers its most recently selected drum slot. A drum note uses the slot specified by that sequencer step. The Step Editor lets you change an existing step's sample slot independently.

If no usable sample is present, the track plays its built-in Drum sound (Kick, Snare or Hi-hat), selectable using **DRUM SOUND (IF NO SAMPLES)**.

### Choke groups

Every drum sample slot has a **CHOKE** selector: OFF, 1, 2, 3 or 4. A sample in a choke group cuts previous samples in the **same group on the same drum track**. Each track has independent groups; one Drum track does not choke another. OFF disables choking. Group settings are included in complete projects and sample banks.

## 6. Sample instruments on any track

Configure any track as **SAMPLE** in the Step Editor or Options. Open **SAMPLE EDITOR** and select it from the track dropdown; all Sample tracks are listed, not just tracks 7 and 8.

Each Sample track owns its own waveform, audio file, root note, start/end markers, loop points, filter cutoff and resonance. **LOOP ON** determines whether the two loop handles appear. With LOOP OFF, only the START and END markers remain visible. Non-looping playback begins at the sample START marker.

You can audition a Sample instrument from the SYNTH tab at its root note. Switching a track to another instrument does not delete its uploaded audio; when you switch back to SAMPLE the audio is available again. Export a full Project JSON for a portable backup.

## 7. Synth, Chord, FX and modulation

Tracks configured as **BASS, LEAD or CHORD**, at any track number, use two oscillators and a sub oscillator. Available adjustments include waveform, oscillator level and enable switches, detune, pulse width, filter cutoff/resonance and envelope parameters. The sub has its own waveform, detune, level and octave (-12 / -24 semitones).

The **Chord** instrument provides chord modes per step: Major, Minor, sus2, sus4, diminished, augmented, seventh, major/minor seventh, ninth types and power chords.

**SEND FX** provides Delay, Reverb, Chorus and Distortion for Drum, Sample, Bass and Lead instruments. Available effects vary by track. **LFO / ENVELOPES** contains four LFOs (free or tempo-synced divisions) and two filter envelopes with target routing.

Tracker FX in **Step FX** include:

| Code | Effect |
| --- | --- |
| `1xx` | Portamento up |
| `2xx` | Portamento down |
| `3xx` | Octave up |
| `4xy` | Vibrato |
| `5xx` | Octave down |
| `Axx` | Volume slide down |
| `Bxx` | Volume slide up |
| `C00` | Note off |

The FX row is separate from the note row. In FX-edit mode, **Backspace** clears the selected FX; **Delete** clears the note while preserving its FX.

## 8. Project saving and loading

Open **MIDI / AUDIO → Save & load project**.

- **PROJECT NAME** is optional. With a name, **SAVE PROJECT (.JSON)** downloads `Your Name.json`; without one it uses a filename containing the app version, date and time.
- **SAVE PROJECT** stores patterns, song arrangement, track lengths, patch parameters, loaded sample data, sample slots and preferred drum slots.
- **LOAD PROJECT** restores a previously exported song; saving your current work first is recommended because loading replaces it.
- The app also maintains a locally stored working state in the browser; do not use browser storage as your only backup.

Large sample-filled songs produce larger JSON files, because audio is embedded in the file.

## 9. Portable Sample Bank

You can back up and transfer audio separately from a song using **EXPORT SAMPLE BANK** in Options or Drum Samples. Sample Bank version 2 includes **all eight drum banks** (five slots per track) and **eight sampler slots** (one per track). Included sampler settings cover the root note, start/end markers, loop markers, filter and resonance.

**IMPORT SAMPLE BANK** replaces the current audio bank after confirmation but keeps the song arrangement, notes and patterns. Older version-1 sample banks with three drum banks and two sampler slots can still be imported. A Sample Bank is **not** a complete project backup; use **SAVE PROJECT** to preserve instrument configurations, synth patches and patterns as well.

### Mixer signal meters (0.1.50)

Every Mixer track has its own VU meter, connected after that track's volume and panning controls. The meter shows the actual output of **that track only**, before the shared compressor and effect returns. A note on another track cannot cause this meter to move. When a track is silent, its meter falls to zero; Mute and Solo affect which tracks can be heard and measured. Tracks configured as MIDI OUT ONLY have no browser audio to meter.

The VU meter is a visual indicator, not a recording or gain-adjustment control. It does not alter audio playback. Because it is measured before the shared Delay/Reverb/Chorus returns, an effect tail may remain audible even after a particular track's dry VU meter has fallen to zero.

## 10. Demo song (`demo.json`)

`demo.json` must be placed beside `index.html` on your web server.

- On first visit, if there is no saved local project, the app attempts to load this file automatically.
- **OPTIONS → LOAD DEMO.JSON** loads it manually after a replacement warning.
- **OPTIONS → AUTO-LOAD ON START** intentionally makes the demo override the local song at every startup; this is opt-in.
- To replace the hosted demo, export a **complete project JSON** (including embedded samples), rename it `demo.json`, and upload it alongside `index.html`.

If `demo.json` is missing or cannot be fetched, the app still opens. The included `demo.json` is the **Johan_01** song with embedded kick, clap, snare, and closed hi-hat audio, plus named patterns **Main**, **Odd Track** and **Odd Snare**. Replace it with a different complete project JSON whenever you choose.

## 11. Per-track MIDI OUT ONLY and external MIDI devices

All eight tracks can play **internal audio** or operate in **MIDI OUT ONLY** mode. To use an external synthesizer, drum machine or MIDI instrument:

1. Open **MIDI / AUDIO**. Connect or refresh MIDI access, select the desired **MIDI output port**, and switch **MIDI OUT ON**.
2. Go to **OPTIONS → TRACK AUDIO / MIDI OUTPUT**.
3. For the desired track, change **INTERNAL AUDIO** to **MIDI OUT ONLY**, and choose **CH 1–16** for the receiving instrument.
4. Set your external MIDI instrument to listen on the corresponding channel, then start playback.

When a track is **MIDI OUT ONLY**, its internal synth/drum sample or sampler will **not** play through Web Audio. The original sound settings and any loaded samples remain stored, so you can switch back to **INTERNAL AUDIO** later. Notes, velocities, ratchets, gate durations, the track's step length and Note Off commands still sequence MIDI. The note value shown in a MIDI-only drum step is the **MIDI pitch**, not the drum sample-slot name. Track mute and solo continue to apply.

MIDI OUT ONLY is independent of the older **TRACK TO MIDI OUT** mirroring control: it always routes that particular track to the configured channel. Standard internal tracks keep their existing optional MIDI mirror settings. The MIDI output port and MIDI OUT enable switch must still be activated in the current browser session; if no output is connected, a MIDI-only track is silent by design.

Open **MIDI / AUDIO** to select compatible USB MIDI input and output ports and routing. **ALL NOTES OFF** can stop stuck external notes. Actual Web MIDI availability depends on browser permissions and support.

## 12. Browser audio and troubleshooting

The browser version uses **Web Audio** via the browser and Windows audio stack. **It cannot open the Focusrite ASIO driver directly**. Choose Focusrite as an available output or Windows default output. The separate `windows/` JUCE project is an experimental native desktop build and does not yet fully match every web feature.

## 13. Troubleshooting

| Symptom | Check |
| --- | --- |
| No sound | Click AUDIO ON, check Windows output and track mute/solo, press PLAY |
| Drum step is silent | Check the step's sample slot and whether that slot has a loaded sample |
| Demo does not load | Use HTTP/HTTPS; ensure `demo.json` is in the same folder as `index.html` |
| Wrong sample when editing | Open DRUM SAMPLES, click USE on the intended slot; existing steps keep their assigned slots |
| MIDI-only track makes no sound | Verify MIDI OUT ON, select the right MIDI output device and matching CH 1–16; the browser sound is deliberately disabled |
| Cannot see loop markers | LOOP START / END handles are shown only when LOOP ON is checked |
| Song moves too early/late | Check the longest step length among all eight tracks for that pattern |
| Loaded samples disappeared | Import your project JSON or Sample Bank backup; browser storage can be cleared |
| External MIDI is silent | Connect/authorize your MIDI device; select the correct port/channel, enable MIDI OUT |
| Keyboard shortcut has no effect | Focus a sequencer cell rather than a text entry, dropdown, or other UI control |
| Drag selection does not appear | Drag from one enabled note or FX cell to another while holding the left mouse button |
| Large project JSON | Embedded WAV/audio is saved inside project and sample bank files |

### Known limitations

- Audio and user interface should be tested in real browsers; syntax checks alone are not full playback verification.
- The browser cannot use native ASIO directly.
- Drum samples require supported, decodable audio and are subject to browser storage limitations.
- The separate Windows desktop source may lag behind the latest web features.

**Documentation version: Squirrel Studio Web 0.1.50.**
