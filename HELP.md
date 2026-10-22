# Squirrel Studio Web 0.1.42 — User Manual

This manual covers the current **browser** edition of Squirrel Studio. Menu labels and control names match the English interface.

## 1. Getting started

**Online:** upload `index.html` and `demo.json` to the same directory on your website. Open the site using HTTPS and a current version of Chrome or Microsoft Edge. Click **AUDIO ON** to activate sound.

**Windows local server:** install Python 3; place `START_STUDIO.cmd`, `index.html`, and `demo.json` in one directory; launch the CMD file and open `http://localhost:8765`.

Avoid opening `index.html` directly as a `file://` URL if you rely on automatic `demo.json` loading or Web MIDI. Start at a low listening volume.

## 2. Tracks and workspaces

| Track | Default sound | What you can edit |
| --- | --- | --- |
| 1 | Drums 1 | Synthesized kick or one of five loaded drum samples |
| 2 | Drums 2 | Synthesized snare or one of five loaded drum samples |
| 3 | Drums 3 | Synthesized hat or one of five loaded drum samples |
| 4 | Bass | Synth settings, note steps, FX |
| 5 | Lead | Synth settings, note steps, FX |
| 6 | Chord | Synth settings, chord types, note steps, FX |
| 7 | Configurable | Empty or sampler instrument |
| 8 | Configurable | Empty or sampler instrument |

Use **SEQUENCER**, **SONG MODE**, **SYNTH**, **MIXER**, **LFO / ENVELOPES**, **DRUM SAMPLES**, **SAMPLE EDITOR**, **SEND FX**, **OPTIONS**, and **MIDI / AUDIO** to open each editor.

## 3. Sequencer and entering notes

### Stable sequencer height

Switching between Drums 1, Drums 2, Drums 3, Bass, Lead, Chord, Sampler or MIDI-only tracks no longer changes the **height of the Step Sequencer**. The **Step Editor** and **Step FX** panels below it keep a fixed, responsive height. If selecting a track reveals more settings than fit inside either editor, **scroll within that editor panel**; the sequencer remains at the same height. This applies to the compact desktop layout and smaller screens as well.


Clicking any note cell **only selects** that cell: it does not insert or erase a note. **Hold the left mouse button and drag** from one step to another to select a highlighted, rectangular range; this also works across multiple tracks. Release the button to finish. Drag-selecting does not change the music. Press **Delete** to clear the notes in the range (FX remain). Clicking once elsewhere clears the range and selects a single step. An active step displays its note or the relevant drum sample slot. Select a cell and use **Enter** to toggle it on/off, **Delete** to clear its note, or enter a pitch with the computer keyboard while **EDIT ON**.

The **ProTracker keyboard layout** uses two rows. The **lower octave** starts at **Z = C**, with **S = C#**, **X = D**, **D = D#**, **C = E**, **V = F**, **G = F#**, **B = G**, **H = G#**, **N = A**, **J = A#**, **M = B**. The **upper octave** starts at **Q = C**, then **2 = C#**, **W = D**, **3 = D#**, **E = E**, **R = F**, **5 = F#**, **T = G**, **6 = G#**, **Y = A**, **7 = A#**, **U = B**. The top row continues at **I = the next C**, **9 = C#**, **O = D**, **0 = D#**, **P = E**. Use the octave selector to choose the base octave. **Alt+1 through Alt+8** selects tracks without conflicting with the upper-row sharp-note keys. When editing notes, the cursor advances unless already at the end of the selected track.

| Key / control | Action |
| --- | --- |
| Enter (sequencer cell focused) | Turn the selected note on/off |
| Delete | Remove the selected note, retaining FX |
| Home / End | Jump to step 1 / final step in the selected track |
| Left / Right | Previous / next step |
| Up / Down | Previous / next track |
| Ctrl+C / Ctrl+V (focused grid cell) | Copy / paste the whole step |
| Ctrl+Z / Ctrl+Y | Undo / redo an edit; Ctrl+Shift+Z also redoes |
| Drag the mouse from one step to another | Select a rectangular range across steps/tracks |
| Delete with a range selected | Delete notes in that range, keeping FX |
| COPY STEP / PASTE STEP | Copy/paste the note, drum slot, velocity, gate, ratchet, chance and FX |
| Space | Start/stop playback |
| Z / S / X / D / C / V / G / B / H / N / J / M | Lower-octave note keys |
| Q / 2 / W / 3 / E / R / 5 / T / 6 / Y / 7 / U | Upper-octave note keys |
| Alt+1 through Alt+8 | Select a track directly |
| Mouse click on grid | Move selection only |

**UNDO / REDO** buttons are available in the Step Editor. They reverse changes to notes, step parameters, pattern lengths, pattern names and other editable project parameters. They do not undo loading a different project or importing/replacing the audio files. A copied step may be pasted onto a different track, step or pattern. **COPY PATTERN** and **PASTE PATTERN** copy the entire pattern and its per-track lengths. In the Step Editor you can also edit velocity, gate, ratchet, chance and the selected drum sample.

## 4. Patterns, lengths and Song Mode

There are **16 patterns** (A1–D4 initially). Choose one using the **PATTERN** drop-down. Use the **NAME** input to rename it, such as `Intro`, `Verse`, or `Chorus`. Names are saved in the project JSON and displayed in Song Mode.

Each track has an independent **step length from 1 to 32**, initially **32**. You can change it next to the track or in **OPTIONS**.

The effective pattern length is the **longest** enabled track length. For example, if the kick runs for 32 steps and the hi-hat for 6, the hi-hat repeats its six steps until the global position reaches 32. **Song Mode advances only then**. The song arrangement can contain a pattern several times and can be reordered by dragging tiles. Song Mode can be enabled or disabled.

## 5. Drum samples — Drums 1, Drums 2 and Drums 3

Open **DRUM SAMPLES**, select **Drums 1**, **Drums 2**, or **Drums 3**, and use **LOAD** to load audio into any of the five slots (up to **15 loaded samples** across these tracks). Supported formats depend on the browser's audio decoder; WAV is a good default. Each file is limited to **16 MB per slot**.

Each drum track remembers its **most recently selected sample slot** independently:

- Click **USE** to make a slot **ACTIVE**. Loading a sample also selects that slot.
- When you go to an *empty* note step, the Sample selector shows that remembered slot.
- Press Enter or enter a keyboard note while Edit is on: that slot is assigned to the new note.
- Notes already on the grid **keep their own slot assignments**.
- Select an existing note to see or change its sample in the Step Editor.
- Use the play button beside a loaded slot to preview it, or **×** to clear it.

If a drum track has **no samples loaded**, it uses the original synthesized drum sound. Once samples are loaded on that track, each step plays its assigned sample slot; selecting an empty slot produces no sample sound. The current sample selection is saved with each step, and the preferred slot per track is stored in project JSON.

### Choke groups

Every drum sample slot has a **CHOKE** selector: **OFF**, **1**, **2**, **3**, or **4**. When a sample in a choke group plays, it quickly fades out other samples currently playing in the *same* group, even if they are on different drum tracks. For example, assign an open hi-hat and a closed hi-hat to **group 1**: the closed hat will cut off the open hat. **OFF** means the slot does not participate in choking. Choke groups are saved in project JSON and portable Sample Banks. Existing projects default to **OFF**.

## 6. Sampler tracks 7 and 8

Open **OPTIONS** and choose **SAMPLER** for instrument slot 7 or 8, then load your audio. In **SAMPLE EDITOR**, you can select sampler 7 or 8, preview the waveform, set start/end and loop markers, enable or disable looping, set the root note, adjust low-pass cutoff and resonance, and audition the sample.

These tracks have their own note and step FX rows in the sequencer. When **LOOP ON** is disabled, the LOOP START and LOOP END handles are **hidden in both the waveform and parameter controls**. Only the sample START and END handles remain available. Enable **LOOP ON** to reveal and edit loop markers. Looping is only applied to sample playback when this switch is on; non-looped playback starts at the sample START marker.

## 7. Synth, Chord, FX and modulation

Tracks **4 Bass**, **5 Lead**, and **6 Chord** use two oscillators and a sub oscillator. Available adjustments include waveform, oscillator level and enable switches, detune, pulse width, filter cutoff/resonance and envelope parameters. The sub has its own waveform, detune, level and octave (-12 / -24 semitones).

The **Chord** instrument provides chord modes per step: Major, Minor, sus2, sus4, diminished, augmented, seventh, major/minor seventh, ninth types and power chords.

**SEND FX** provides Delay, Reverb, Chorus and supported-track Distortion controls. Available effects vary by track. **LFO / ENVELOPES** contains four LFOs (free or tempo-synced divisions) and two filter envelopes with target routing.

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

You can back up and transfer loaded audio separately from the song by opening **DRUM SAMPLES** or **OPTIONS** and clicking **EXPORT SAMPLE BANK**. The resulting JSON embeds the sound files from:

- Drum tracks 1–3: five slots each (15 total).
- Samplers 7 and 8: one sample each (two more).

The sampler's root, start/end, loop markers and filter settings are included. On another computer, choose **IMPORT SAMPLE BANK** and select that file. Importing **replaces the current sample bank after confirmation** but leaves patterns, step assignments and Song Mode intact. If a step points to a slot not present in the new bank, it will be silent until a suitable sample is loaded.

A sample bank is **not** a complete project backup. Use **SAVE PROJECT** as well when you need to preserve your patterns and song.

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

**Documentation version: Squirrel Studio Web 0.1.42.**
