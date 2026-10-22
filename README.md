<img src="squirrel-icon.webp" alt="Squirrel Studio mascot" width="128" height="128">

# Squirrel Studio — Web Synth & Step Sequencer

**Current web version: 0.1.72**  
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

## What is new in 0.1.72

- **Multi-mode drum-slot filter:** choose **LOW-PASS**, **HIGH-PASS** or **BAND-PASS** independently for each of the five sample slots of any DRUM track. Existing cutoff (80–20,000 Hz) and resonance (Q 0.1–18) controls remain.
- **LOW-PASS** removes high frequencies, **HIGH-PASS** removes low frequencies, and **BAND-PASS** emphasizes frequencies around cutoff while reducing frequencies above and below it.
- Changing the filter type updates active, already-filtered drum voices on the same slot. The **ON/OFF** switch still applies to newly triggered voices; disabled filters allocate no BiquadFilterNode.
- **RESET FILTER** now also sets filter type to LOW-PASS, alongside the previous OFF / 12,000 Hz / 0.7 Q defaults.
- Projects and sample banks retain each slot's filter type without format changes (project v23, sample bank v3). Old files default to LOW-PASS, with filtering OFF; invalid types are safely normalized.
- Added `tests/drum-filter-modes.test.js` with 27 checks for the three modes, live changes, independent slots, project/bank compatibility and reset.

## What is new in 0.1.71

- **Independent drum-slot low-pass filters:** each drum track's five slots can separately enable a low-pass filter with CUTOFF (80–20,000 Hz) and RESONANCE (Q 0.1–18).
- **Zero-overhead bypass:** filters default to **OFF**, and the audio engine only allocates a BiquadFilterNode when the triggered slot actually has filtering enabled. The original sample remains unmodified and can be reused in other slots.
- **Live adjustment:** cutoff and resonance controls use sliders plus exact numeric input; both values update active filtered drum voices smoothly. Enabling or disabling the filter takes effect on new triggers.
- **Logarithmic cutoff slider:** makes lower frequencies easier to choose while covering the full range. Frequency is limited to the audio device's Nyquist frequency as needed.
- **RESET FILTER** disables filtering and restores 12,000 Hz cutoff / 0.7 Q for the selected slot without touching its sample, slot mix, envelope, trim or loop.
- Filters are stored independently with the slot in project JSON and sample bank exports (project v23 and bank v3 retained); older projects remain unfiltered.
- Added `tests/drum-slot-filter.test.js` covering bypass, routing, live filter updates, sample-rate limits, project/bank save/load and reset.

## What is new in 0.1.70

- **Draggable graphical drum envelopes:** each sample slot now has a visual **Attack / Decay / Release** editor on the **DRUM SAMPLES** page. Click or drag horizontally in any of its three labeled sections to change that slot's timing.
- Each section has its own logarithmic millisecond scale, making short times (such as 2 ms attack and 18 ms release) easier to adjust while retaining the full 500 / 3000 / 2000 ms ranges. **DECAY OFF** appears as a sustained line.
- The graph and the existing envelope sliders and exact numeric inputs stay synchronized. Graph dragging updates the controls immediately but saves once on pointer release/cancel, rather than writing every mousemove.
- Mouse, touch and pen are supported via Pointer Events. Separate numeric/sliders remain available for accessibility and exact entry.
- Graphs are individual per drum slot; each of the five slots can refer to the same shared library buffer but have separate settings. No project format migration is needed.
- Added `tests/drum-envelope-graph.test.js` for logarithmic mapping, pointer dragging/cancellation, saving and project data integrity.

## What is new in 0.1.69

- Each DRUM slot has an independent **RELEASE** time (0–2000 ms, default 18 ms). The AMPLITUDE ENVELOPE section now offers Attack, Decay and Release with slider and precise numeric entry.
- **Keyboard/MIDI note-off** now fades the selected drum voice using its slot-specific RELEASE setting instead of always fading over a fixed 18 ms.
- **Gated, looping drum samples** fade smoothly at the end of their step gate rather than cutting hard. One-shot drums keep their natural sample duration regardless of step gate, maintaining the previous drum-machine workflow.
- The DECAY control still takes priority when it reaches silence before the note-off; ungated loops with DECAY OFF can sustain until release.
- **RESET ENV** restores Attack 2 ms, Decay 0 (OFF) and Release 18 ms; sound, trim, choke, per-slot mixer and library assignments are unchanged.
- Existing project version 23 and sample bank v3 carry the new RELEASE field. Old files default to 18 ms without changing their other settings.
- Added `tests/drum-slot-release.test.js` with 15 checks, covering note-off, gated loops, one-shot playback, decay interaction, save/load and legacy defaults.

## What is new in 0.1.68

- **Per-slot drum amplitude envelope:** every one of the five sample slots of each DRUM track has its own ATTACK (0–500 ms) and DECAY (0–3000 ms) controls in **DRUM SAMPLES**.
- **DECAY = 0 means OFF** and preserves the original natural sample tail and the existing sustain behavior of looping samples. With a nonzero decay, gain ramps down to zero after the attack. Once silent, the voice is stopped to avoid wasted audio processing.
- **RESET ENV** restores ATTACK 2 ms and DECAY OFF for the chosen slot without changing audio files, sample assignments, waveform trims, loop markers, choke group, volume, tuning or pan.
- Envelopes are independent for each slot even when several slots share a buffer from the central 15-sample drum library.
- Choke groups now fade from the volume envelope's actual current level instead of jumping to the original peak before the choke.
- Project format 23 and sample bank v3 remain unchanged. The new envelope settings are preserved through save/import, and older projects default to ATTACK 2 ms and DECAY OFF.
- Added `tests/drum-slot-envelope.test.js`, including attack/decay scheduling, loops, choke fades, legacy migration and reset checks.

## What is new in 0.1.67

- **Fine tune per DRUM slot:** add -100 to +100 cents to the existing coarse PITCH (-24 to +24 semitones), VOL (0-200%) and PAN (-100 to +100).
- **Numerical entry:** each DRUM SAMPLES mix control now has a slider and an editable exact integer value, including negative pitch and pan.
- **RESET MIX:** resets VOL 100%, PITCH 0, FINE 0 and PAN 0 for one slot without deleting its shared-library assignment, loop/trim markers, direct sample or choke setting.
- The five drum slot mixers use full-width responsive rows, rather than squeezing multiple slot configurations into two columns.
- **Pitch-correct sample tails:** pitched-down one-shot drum audio now runs for the correct extended duration instead of being cut at the original buffer-time duration; tracker step FX preserve the slot's base pitch and fine tuning.
- Reloading a direct drum sample now preserves that slot's volume, pitch, fine tune, pan and choke group. Waveform trim/loop markers reset for the new audio file.
- Existing project format 23 and sample bank v3 remain compatible; older files default to zero fine tune.
- Regression coverage: `tests/drum-slot-tuning.test.js` checks voice tuning/gain/pan, FX pitch, playback duration, project/bank round-trips, migration and reset.

## What is new in 0.1.66

- Every drum sample slot has an independent **PAN** control, from -100 (left) to +100 (right), default 0 (center).
- The audio graph uses a separate StereoPannerNode per triggered drum voice, before the track's own volume/pan processing. Five slots can reuse the same decoded library sample but have different stereo positions.
- Pan values are preserved in project saves and sample bank imports/exports. Legacy projects default to center.

## What is new in 0.1.65

- Each of the five DRUM track slots has its own **VOL** (0–200%, default 100%) and **PITCH** (-24 to +24 semitones, default 0) sliders on the DRUM SAMPLES page.
- Gain and tuning are applied per voice when the audio plays; multiple slots can reference one shared library sample yet sound different. Gain also carries through choke fades.
- Settings are saved in project JSON and sample bank exports, and older files default to 100% and 0 semitones.

## What is new in 0.1.64

- **Shift+click on a drum step** to cycle its assigned sample S1 → S2 → S3 → S4 → S5 → S1, without turning the step on/off or changing its FX, velocity or gate.
- Hover a drum step to see its full assigned sample name from the shared 15-sample library. Screen readers also announce the sample assignment.
- Active drum step labels still show S1–S5. The existing Step Editor quick-select buttons and five selectors per track in OPTIONS remain available.

## What is new in 0.1.63

- Drum steps now have **S1–S5 quick-select buttons** in the Step Editor, in addition to the existing dropdown. The selected slot turns green.
- Choosing S1–S5 stores the slot on the selected step, including an inactive step. When that step is turned ON later, it uses the chosen slot; the 15 library sounds remain shared and are not duplicated.
- The selected drum track's last-used slot follows the quick selection, so subsequent note entry uses that sound.

## What is new in 0.1.62

- Every track configured as **DRUM** now shows five sample-slot selectors immediately in **OPTIONS → INSTRUMENT TYPE**. Choose any of the 15 shared library sounds for each of the five slots, independently per drum track.
- Slot dropdowns store only a **library index**. The audio data and decoded Web Audio buffer remain in the central library, so sharing one sample among several slots or drum tracks does not duplicate its audio payload.
- **OPEN DRUM LIBRARY / SAMPLE EDITOR** jumps to the DRUM SAMPLES page for the selected track to load library sounds and edit slot-specific start, end and loop markers. Existing assignments and saved projects remain compatible.
- Selecting a slot's existing assignment again is a no-op, preserving that slot's settings.

## What is new in 0.1.61

- **Green Song Mode follow, timed to actual audio:** the green playing tile is updated by the audio playhead queue, rather than the scheduler's lookahead position.
- **Cue any arrangement tile:** click a song tile, or focus it and press Enter/Space, to select where playback starts. The stopped cue appears in muted green; the playing tile becomes bright green.
- **Start from any position:** double-click the tile while Song Mode is enabled, or select it once and press the main PLAY button.
- **STOP remembers the last audible song position**, ready for another PLAY. Insert, remove, duplicate and reorder controls preserve the logical cue position. Editing the arrangement during playback now stops transport first to avoid racing the scheduler.
- No project format changes; existing saved projects remain compatible.

## What is new in 0.1.59

- **15-sample DRUM LIBRARY:** load up to 15 distinct audio files in a shared library at the top of the **DRUM SAMPLES** page. Each slot on every track configured as DRUM can be assigned one of these samples from its dropdown. Multiple slots may reference the same library sample without duplicating the stored sound.
- Each Drum track retains its **five editable sample slots**, selected step sample slot, choke groups and fallback synthesized drum sound. A direct LOAD option remains available for backwards compatibility with existing projects.
- **EDIT in the Sample Editor:** the EDIT button beside an assigned or directly loaded drum slot opens the waveform editor. Drum slots have their own START, END, LOOP START and LOOP END settings, independent of other slots pointing to the same shared library sound.
- **PING-PONG LOOP:** turn on LOOP, then PING-PONG LOOP, in the Sample Editor for an ordinary Sample instrument or an assigned Drum slot. The audio actually alternates forward and backward through the selected loop region; original stereo channels are preserved.
- Waveform playback accounts for Ping-Pong direction, sample trims and FX 9 offsets. Offsets at or beyond LOOP END still play the remaining tail once rather than creating an invalid loop.
- **Project format 23 and Sample Bank v3** preserve the 15 sample assets, drum-slot assignments and per-slot sample editor settings. Older songs and version-1/2 sample banks continue to import.
- Added `tests/drum-library-pingpong.test.js` covering shared buffers, independent slot markers, reverse stereo audio and legacy project migration.

## Improvements from 0.1.58

- **FX 9 and sample loops:** sample offsets no longer push a LOOP START beyond LOOP END. Normal offsets within the loop retain the original saved loop handles and work correctly with the Sample waveform cursor.
- **Offset after LOOP END:** when FX 9 starts playback at or after the sample's loop end, that triggered voice plays the remaining trimmed tail once instead of trying to create an invalid loop. For example, `950` still starts at 50% of the trimmed sample even when LOOP END is 40%.
- **Safer held-note navigation:** holding Enter or a ProTracker note key while changing track, pattern bank, or workspace now releases the audition immediately instead of leaving the previous track sounding.
- Extended tests for loop start/end boundaries and one-shot tail playback, as well as held note-off during track, pattern and workspace changes.

## Improvements from 0.1.57

- **Hold-to-audition while EDIT ON:** after entering a note with a ProTracker keyboard key, its instrument sounds for as long as you hold that key. Releasing the key sends note-off, rather than letting a fixed 220 ms preview or a long sample finish.
- Applies to Sample, loaded Drum, synth and MIDI OUT ONLY tracks; the selected step's FX 9 sample offset and drum sample slot are included in the audition.
- The sequencer still automatically advances one step after note entry. A newly entered note replaces the previous edit preview, avoiding overlapping long samples.
- STOP, turning EDIT OFF and losing browser focus all release held edit previews. Asynchronous audio startup is guarded so a released key cannot create a late ghost note.
- Added `tests/edit-held-audition.test.js` for MIDI and audio key-up release, FX 950, overlapping edits and delayed-audio cancellation.

## What was new in 0.1.56

- The top toolbar **EDIT ON** button now turns **red** when edit mode is enabled, making it obvious that computer-keyboard note input is active.
- **EDIT OFF** uses the normal neutral button style. Hover and keyboard-focus styles have been adjusted for a clear active-state indication.
- No change to note input, step dimensions, mixer MUTE/SOLO colors, or transport behavior.

## Improvements from 0.1.55

- **SOLO now clears an existing MUTE on the selected track automatically.** Soloing a red MUTE channel makes it audible immediately and changes its SOLO button to green.
- All other tracks remain temporarily muted as before. Their manually saved MUTE flags are not changed.
- Moving SOLO onto another manually muted channel also clears that new solo channel's MUTE; turning SOLO off leaves that channel unmuted.
- The Mixer and Step Sequencer show the same updated MUTE/SOLO button colors without requiring a reload.
- Updated the solo/mute regression suite with these cases.

## Improvements from 0.1.54

- **Mixer and Step Sequencer are synchronized immediately:** MUTE/SOLO changes made in the sequencer now refresh the Mixer controls even while the Mixer tab is hidden.
- The Mixer displays **green SOLO** on the selected track and **red MUTE** on the other tracks; un-soloing restores the prior manual mute configuration.
- Changing settings in the Mixer also updates the sequencer's small **M/S** controls, because both views use the same track state.
- No needless mixer rebuilding: unchanged channel strips preserve VU meter animation and fader focus. MIDI-driven volume changes also refresh a hidden Mixer.
- Expanded `tests/solo-mute.test.js` to verify cross-view synchronization and preservation of channel strip elements.

## Improvements from 0.1.53

- **SOLO buttons are green** while active, both in the Mixer and on the sequencer's per-track **S** buttons.
- **MUTE buttons are red** when a track is silenced, including the tracks automatically muted by SOLO. The sequencer's per-track **M** controls use matching red styling.
- Soloing a track mutes every other track. SOLO is **exclusive**: pressing another SOLO transfers solo to that track, and pressing the active SOLO again restores the mix.
- Temporary SOLO muting does not overwrite any track's manual mute setting. Non-solo MUTE buttons are locked during SOLO, so manually muted tracks retain their settings for when SOLO turns off.
- MIDI note-off is sent to newly excluded tracks, and imported projects with multiple legacy SOLO flags are normalized to one SOLO channel.
- Added dependency-free `tests/solo-mute.test.js` for mixer appearance, audio-routing and mute-state regression coverage.

## Improvements from 0.1.52

- **Cleaner STOP / PLAY handling:** STOP now clears the waveform's playback cursor and any old Drum choke-group registrations, so a song can restart without stale playback state.
- **Step FX 9 audition works:** the Step Editor's **AUDITION** button respects the selected step's SAMPLE OFFSET value. `950` starts at 50% when auditioned as well as during playback; ordinary instrument preview is unaffected.
- Sample previews that start the Web Audio engine for the first time retain the requested step FX settings.
- The STOP / Sample Offset regression tests now cover repeated STOP/PLAY cleanup, fresh drum voices after a stop and step-specific audition.

## What was added in 0.1.51

- **STOP fades long samples to silence over 85 ms**, then ends the audio sources. Applies to Sample instruments, looping samples, loaded Drum samples, synthesized drums and synths—even if a release had already been scheduled.
- **Tracker FX 9xx: SAMPLE OFFSET**. A two-digit decimal percentage (00–99) chooses the initial playhead position: `925` = 25%; `950` = 50%, the middle of the sample. This is relative to the playable START/END region for Sample tracks and the full loaded Drum sample otherwise.
- The Step FX slider/text field switches to decimal percentage for FX 9; all existing FX retain their hexadecimal format.
- FX 9 works on active sample-trigger steps, and is saved with the project and compatible with step/range copy and paste. The built-in synthesized drums and oscillator synths are not affected.
- Added `tests/stop-fade-and-offset.test.js` for offline verification.

## Features introduced in 0.1.50

- **BPM precision to one decimal:** choose tempos such as **120.3 BPM**, using the native **0.1 BPM** increments.
- Pattern playback and tempo-synced LFO calculations use the actual fractional BPM, without rounding to whole numbers.
- Project JSON save/load and older project imports preserve fractional BPM (rounded only to one decimal).
- The tempo input has enough room to display values such as **120.3** without clipping.

## Improvements introduced in 0.1.49

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
- Fixes in 0.1.59: sampler root-note persistence, sample loading during project/track switching, default sampler volume when resetting the mixer, MIDI-independent audio device wording, and clearer empty-sampler behavior.
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

- `index.html` — **current Squirrel Studio Web 0.1.59** application
- `demo.json` — included song with sample data
- `squirrel-icon.webp` — mascot and favicon
- `README.md` — current version, downloads and overview
- `HELP.md` — English user manual
- `START_STUDIO.cmd` — local Windows development server
- `tests/track-routing.test.js`, `tests/pattern-bank-and-enter.test.js` and `tests/mixer-meters.test.js` and `tests/bpm-decimal.test.js` and `tests/stop-fade-and-offset.test.js` and `tests/solo-mute.test.js` — offline regression tests, run with `node tests/track-routing.test.js` (no npm installs or GitHub Actions required)
- `windows/` — experimental desktop port, which may lag behind web features

### Audio and limitations

The web edition uses **Web Audio**, not direct ASIO. MIDI device access depends on browser permissions and supported operating systems. The Windows JUCE desktop source is experimental. Audio playback and browser behavior require manual testing on the actual device in addition to code-level regression tests.

To check that the latest build loaded, look for **BUILD 0.1.59** in the app header. If an earlier build appears, replace locally extracted files or force refresh (**Ctrl+F5**).