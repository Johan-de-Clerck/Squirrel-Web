# Squirrel Studio Web 0.2.44 — User Manual

This manual covers the current **browser** edition of Squirrel Studio. Menu labels and control names match the English interface.

### New in 0.2.07 — Live CARRY indicators

On the **SEQUENCER** or **MIXER** page, sample and drum tracks can display a small green **CARRY N** indicator, where N is the number of currently playing sample voices that have **CONTINUE** enabled. It is a live status indicator: it does **not** change any checkbox, D00 command, note or audio. An audio voice begins counting when its playback start time has arrived, not merely when the sequencer scheduler queues it ahead of time. Multiple continuing voices on the same track show **CARRY 2**, **CARRY 3** and so on.

Use the per-step **CONTINUE** checkbox (or legacy **D00**) to let the sample pass a pattern boundary, and use **C00 NOTE OFF** in a later step to start the release of all still-carried voices on that track. Once C00 releases the voices, the badge disappears. Stopping transport clears it as well. The indicator only appears when a track actually has carried voices; normal sample playback without CONTINUE does not show it. These badges are not saved to projects.

### New in 0.1.81 — Fine tune per FM operator

Select **SYNTH → FM → OPERATORS: 4 OP**. Each OP1–OP4 panel now includes a **FINE TUNE** slider (−100 to +100 cents) alongside WAVEFORM, RATIO and LEVEL. **0 ct** is in tune; positive settings sharpen the operator and negative settings flatten it. This is independent for each operator, so the two audible carriers in PAIRS can be slightly detuned to create beating, while modulator fine tuning shifts the sideband structure of STACK and FAN.

Fine tuning can be changed during playback. It also works with the sequencer's pitch slides and vibrato without replacing the operator's tuning. Saved project files and instrument patches retain the values. Older songs default to **0 ct** on every operator.

### New in 0.1.80 — Operator waveforms and routing

In **SYNTH → FM**, select **OPERATORS: 4 OP** to expose four operator panels. Each operator's **WAVEFORM** can be set independently to **SINE**, **TRIANGLE**, **SAWTOOTH** or **SQUARE**. SINE is the original smooth FM sound; TRIANGLE, SAWTOOTH and SQUARE provide richer harmonic content. For example, experiment with a sine carrier and a sawtooth modulator for a more aggressive lead, or use triangle carriers in ADDITIVE mode.

The **OPERATOR ROUTING** diagram shows all signal paths for the currently selected algorithm. Green operators are audible **CARRIER** outputs, and brown operators are **MODULATORS** feeding other operators. Operators with direct output flow into the blue **OUT** node. Switching an algorithm updates the diagram and affects new notes; changing an operator waveform updates active FM4 notes. The waveform display also reflects these changes.

Waveform selections are saved with projects and instrument patches. Existing FM4 presets with no WAVEFORM settings load all operators as SINE, and original 2 OP FM patches are unchanged.

### New: Four-operator FM — algorithms and operator controls

Select a **BASS**, **LEAD**, or **CHORD** synthesizer track, open **SYNTH** and choose **FM · FREQUENCY MODULATION** in SYNTHESIS ENGINE. Within the FM controls choose **OPERATORS → 4 OP · MULTI-ALGORITHM** to unlock four operators and their dedicated controls. Choose **OPERATORS → 2 OP · ORIGINAL FM** to return to the existing 2-operator engine. This second selector retains the original patch settings.

**FM ALGORITHM** controls how the oscillators connect:

- **STACK — 4 → 3 → 2 → 1:** three layers of frequency modulation. OP1 is the audible carrier.
- **PAIRS — (2 → 1) + (4 → 3):** two independently modulated audible carriers (OP1 and OP3).
- **FAN — 2/3/4 → 1:** three modulation operators influence one audible carrier (OP1).
- **ADDITIVE — 1 + 2 + 3 + 4:** four audible sine oscillators with no frequency modulation connections.

Each **OPERATOR 1–4** has its own **RATIO** (0.25–16×) and **LEVEL** (0–100%). Ratio controls its frequency relative to the played note. Level controls output amplitude if the operator is a carrier, or modulation intensity if it is a modulator. **FM INDEX** controls the shared overall modulation strength (0–12); **FM ATTACK / DECAY / SUSTAIN** control the shape of each modulation envelope. The main **FILTER / AMP ENVELOPE** section still controls the final sound's cutoff, resonance and amplitude ADSR, including RELEASE after C00 or key-up.

Changing RATIO, LEVEL, INDEX or SUSTAIN updates already playing four-operator notes smoothly. Choosing a new algorithm takes effect when the next note triggers; notes already playing keep their previous routing. The waveform preview illustrates the combined FM signal; it is an approximation, not an oscilloscope recording. FM4 settings are saved per synth track and in instrument patches. Legacy FM patches default to 2 OP, and older VA projects still sound as before.

### SYNTH — VA and FM engines

Select a **BASS**, **LEAD**, or **CHORD** track, then open **SYNTH**. The **SYNTHESIS ENGINE** dropdown offers:

- **VA · VIRTUAL ANALOG** — two independent main oscillators plus a suboscillator, with saw, square, triangle, sine and adjustable **PULSE** waves, detune, levels, low-pass filter and amplitude ADSR. All existing songs open in VA unless you choose otherwise.
- **FM · FREQUENCY MODULATION** — OP1 is the audible sine carrier; OP2 is the modulating sine oscillator. **OP2 RATIO** determines the modulator frequency relative to OP1 (0.25–16×); **FM INDEX** sets modulation strength (0–12). The independent **FM ATTACK**, **FM DECAY**, and **FM SUSTAIN** controls change the index over the note duration. Higher ratios / index amounts can create metallic or bell-like tones. Both engines share the track's existing low-pass filter and amplitude ADSR. Live changes to FM RATIO, INDEX and SUSTAIN update notes that are already playing. NOTE OFF follows the normal amplitude RELEASE and reduces FM modulation. The engine selection and sound parameters are saved in the project and preserved with track-kind patches.

### LFO — Pulse Width modulation for VA

Choose a VA track with **WAVE = PULSE** on oscillator 1, oscillator 2, or the suboscillator. Open **LFO / ENVELOPES** and enable one of the four LFOs. Under **ROUTING**, select **TRACK N · PULSEWIDTH**, where N is the chosen synth track. Set **WAVEFORM**, **RATE / SYNC**, and **DEPTH** as usual.

The LFO continuously changes the actual pulse width through Web Audio delay-time modulation. The main oscillator **PULSE WIDTH** control sets the center of modulation, and the LFO depth controls how far the waveform changes from that center. The range is automatically limited to avoid widths beyond 5–95%. More than one LFO may address the same pulsewidth target. LFO PWM is available in browser-based VA synthesis; selecting PWM on an FM or non-pulse oscillator has no audible effect. Existing LFO routing and project data remain compatible.

### Sample Editor — adjustable NOTE OFF release

Select any **SAMPLE** track under **SAMPLE EDITOR**. The **SAMPLE RELEASE · C00** slider and numeric field set that track's note-off fade from **1 to 3000 milliseconds** (default **65 ms**). This applies after **C00** stops a sample that was carried into the next song pattern with **D00**, and also to manual keyboard/MIDI note releases. The setting affects newly triggered sample voices and does not forcibly shorten a currently playing one-shot. Sample loops can continue across patterns with D00 and fade out at C00 using the selected release. Each SAMPLE track has its own value; DRUM slots use their separate envelope RELEASE setting. Saved projects and sample banks retain this control, while older songs default to the previous 65 ms behavior.

**D00 playback correction (0.1.76):** D00 now correctly works for **ordinary SAMPLE tracks**, not just DRUM samples. A sample started in A1 with D00 will continue into B1 until its natural sample ending or C00 triggers the track's RELEASE. If the sample has LOOP ON, it can continue until C00. A new note may overlap with an already-carried voice. No changes to your saved songs are needed.

### CONTINUE retrigger behaviour

CONTINUE carries a drum/sample voice only while the following pattern positions on that track do not trigger a new sample. As soon as a new drum/sample note is reached on the same track, Squirrel Studio releases the old carried voice and starts the new sample from its own start point or Step FX 9 offset. The new step may itself have CONTINUE enabled; that applies to the newly started voice, not the previous one.

### Per-step CONTINUE checkbox — no D00 required

Open **SEQUENCER** and use a DRUM or SAMPLE track. Each step has a small checkbox at the upper-right corner of its note pad. **Tick it** for a long sample that should keep playing when the pattern changes. A green check means **CONTINUE** is enabled. You can also select a step and tick **STEP EDITOR → SAMPLE PLAYBACK → CONTINUE INTO NEXT PATTERN**, which changes the same per-step setting. The box works separately for every step in every pattern.

**You no longer need D00.** Because CONTINUE is not an FX command, you can also use **9 · SAMPLE OFFSET (%)** or another Step FX at the same time. The checkbox works for normal one-shot SAMPLE tracks and loaded drum-sample slots. For a looping drum sound, tick the note's own step to prevent the ordinary step gate from cutting it.

Put **C · NOTE OFF** (C00) on a later step on the same track, possibly in the next Song Mode pattern. The carried sample then fades according to its configured RELEASE. When there is no C00, a one-shot reaches its natural sample end, while a sample with LOOP ON can keep playing. **STOP** still fades everything. The checkbox is copied with the step and saved in project files.

For compatibility, existing **D00** steps show a checked CONTINUE box; unchecking it removes D00. MIDI-only and synth tracks do not need this checkbox.

### Step FX D00 — SAMPLE CONTINUE (long drum and sampler audio)

Choose **D · SAMPLE CONTINUE** in **Step FX** on a DRUM or SAMPLE note. The sample may play through the end of the current pattern into the next one, including a different Song Mode pattern. This is especially useful when a waveform is longer than a 4-, 16- or 32-step pattern. A looping drum sample with D00 on its note is not ended by the usual step gate. A D00 on a later empty FX row also marks a still-playing sample for continuation, although for a drum loop the best place is the original note step to bypass its gate.

On a later step in the same track, select **C · NOTE OFF** (C00), with the note step turned OFF. C00 ends *all* continued sample voices on that track, even if they began in a previous pattern, using their RELEASE rather than a hard cut. Drum slots use their own RELEASE control; regular sampler tracks use the new adjustable **SAMPLE RELEASE · C00** value in the Sample Editor (1–3000 ms, default 65 ms). Other tracks are unaffected. One-shots can still finish naturally before C00, and **STOP** always fades all sample voices. D00 needs no numerical FX parameter and is saved inside the pattern along with the other step effects.

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


**Held note preview while EDIT ON (0.1.59):** Changing to another track, pattern or workspace also releases any held sample, drum, synth or MIDI note preview immediately. This prevents old notes from continuing to sound after navigation.

**Held note preview while EDIT ON (0.1.59):** When entering a note with a ProTracker keyboard key, the note is auditioned while the key is held, even if the sample is longer than the current pattern. Releasing the key stops the voice. Note entry still advances the cursor automatically. The selected Drum sample and FX 9 sample offset are used, and MIDI OUT ONLY receives a corresponding note-on and note-off. The EDIT ON button remains red to indicate editing. STOP, EDIT OFF or leaving browser focus ends the audition so samples cannot keep playing unexpectedly.

**EDIT mode indicator (0.1.59):** The **EDIT ON** button in the top toolbar turns **red** while step editing via the computer keyboard is enabled. Clicking it again changes the label to **EDIT OFF** and restores the normal neutral color. The underlying note-entry shortcuts are unchanged.

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

The effective pattern length is the **longest** enabled track length. For example, if the kick runs for 32 steps and the hi-hat for 6, the hi-hat repeats its six steps until the global position reaches 32. **Song Mode advances only then**. The song arrangement can contain a pattern several times and can be reordered by dragging tiles. Song Mode can be enabled or disabled. **Click** a tile in the song arrangement to cue that tile; a **dim green** highlight shows the starting position while stopped. Press the main **PLAY** button to start at that position, or **double-click** the tile to play there immediately (Song Mode must be enabled). The **bright green** highlight follows the sound currently playing, not the next scheduled pattern. Press **STOP** to keep the currently heard tile as the next start position. Song tiles can also be selected from the keyboard (Tab then Enter/Space). Inserting, moving or removing song tiles during playback safely stops playback first.

## 5. Drum samples — any track configured as DRUM

Open **DRUM SAMPLES** and choose any track whose instrument type is **DRUM**. The upper section is the shared **15-SAMPLE DRUM LIBRARY**. Use LOAD beside a library position to import a WAV, AIFF, MP3 or OGG sample; it can then be assigned to any of the five slots of a Drum track. You can assign the same library sample to several slots or tracks without duplicating the audio file. Use the per-slot assignment dropdown to select a library number; clear it to unassign. Each Drum track still has five slots (up to 40 assignments if all eight tracks are DRUM). Direct LOAD remains available for older individually loaded samples. Press **LOAD**, **USE**, **PREVIEW** or **CLEAR** for a slot. File decoding depends on the browser; WAV is recommended. Each sample may be at most 16 MB.

When creating or switching a track to **DRUM** under **OPTIONS**, that track immediately gains five sample dropdowns. Each dropdown can reference any of the 15 loaded sounds in the shared drum library. The choices are independent for each drum track; reusing a library sample does not create another audio copy. Use **OPEN DRUM LIBRARY / SAMPLE EDITOR** to load sounds into the 15 slots. The per-slot EDIT button in **DRUM SAMPLES** controls individual trim and loop points.

Every DRUM slot also has its own **VOL** (0–200%), **PITCH** (-24 to +24 semitones), **FINE** (-100 to +100 cents), and **PAN** (-100 left to +100 right) controls in the DRUM SAMPLES page. Each control offers a slider and direct numerical entry. Use **RESET MIX** on a slot to restore VOL 100%, PITCH 0, FINE 0 and PAN 0 without changing its audio assignment, choke group, trim markers or loops.

Between the slot mixer and the amplitude envelope, each slot has a **MULTIMODE FILTER** section. The **TYPE** selector offers **LOW-PASS**, **HIGH-PASS** and **BAND-PASS**. Low-pass darkens the sample by reducing high frequencies, high-pass removes bass/rumble, and band-pass isolates a frequency range around the selected cutoff. **FILTER ON** enables the chosen mode for that slot; filters are OFF by default so the original audio is unchanged. **CUTOFF (Hz)** ranges from 80 to 20,000 Hz and uses a logarithmic slider with a precise numeric field. **RESONANCE (Q)** ranges from 0.1 to 18. Cutoff, resonance and the selected filter type update already-playing *filtered* voices in real time, while the ON/OFF switch applies to newly triggered voices. **RESET FILTER** turns off the filter, sets the type back to LOW-PASS and restores 12,000 Hz cutoff / 0.7 resonance, without changing the sample or envelope. Filters are specific to each of the five slots, even if the slots share a sample from the central library.

**GRAPHICAL CUTOFF SWEEP:** Below the DEPTH and TIME controls, the filter envelope has an interactive graph. Drag the amber point in the left region **vertically** for DEPTH and the green point in the right region **horizontally** for TIME. The curve shows the actual frequency sweep, including frequency clipping at the audio device's Nyquist limit. Sliders/numeric inputs update together with the graph. Dragging saves when released, and the graphic becomes inactive with FILTER OFF. Mouse, touch and pen are supported.

**CUTOFF SWEEP:** Under the filter's main settings, use **DEPTH** (-48 to +48 semitones) and **TIME** (0–3000 ms) to automatically move the filter cutoff every time a drum sample triggers. Positive depth starts the cutoff above your main CUTOFF setting and sweeps down; negative depth starts below it and sweeps up. TIME controls how long the logarithmic sweep takes to return to the original cutoff. DEPTH 0 or TIME 0 turns the sweep OFF. The sweep also works with HIGH-PASS and BAND-PASS. Edit the settings while a filtered drum plays to update its remaining sweep. You can use the sliders or type exact values; changing one drum slot does not alter the other four. Filters remain OFF by default. **RESET FILTER** also clears both sweep settings. Projects and sample banks preserve the values, and older files load with sweep disabled.

Every drum slot also has an **AMPLITUDE ENVELOPE** section with **ATTACK** (0–500 ms), **DECAY** (0–3000 ms) and **RELEASE** (0–2000 ms), controlled by sliders or exact millisecond values. Directly below those controls is a three-part **graphical envelope editor**. Drag the amber point horizontally (or click in a phase section) to edit that phase. The three phase previews are separated because RELEASE is triggered by note-off, while DECAY begins after ATTACK. The displayed millisecond values, sliders and numeric fields stay synchronized. Short values remain practical because each phase uses a logarithmic horizontal scale. The DECAY section reads OFF when its value is zero. The graph supports mouse, touch and pen, while the numeric fields remain available for exact entry. ATTACK controls the fade-in; DECAY begins when ATTACK finishes and fades the sound to silence. DECAY **0 means OFF**: your audio plays naturally, including a loop that remains active until released or gated. When a nonzero decay reaches silence, the audio source stops automatically, even for loops. RELEASE controls the fade after keyboard/MIDI note-off or a looping drum step's GATE ends. One-shot drum steps still play the sample tail by default, independent of gate, while manually releasing a note fades that voice. Use **RESET ENV** to restore ATTACK 2 ms, DECAY 0 and RELEASE 18 ms without affecting mixer settings, samples, trims or choke groups. These two values are saved per slot in projects and sample banks, and older files restore the original default behavior. These settings belong to the slot, not the shared library sample, and are saved in project and sample bank files.

Each track remembers its most recently selected drum slot. A drum note uses the slot specified by that sequencer step. The Step Editor shows green **S1–S5 quick-select buttons** for DRUM tracks. Choose a step, then click its intended sample slot; this is stored on that step even before the step is switched ON. You can also **Shift+click a drum step in the main grid** to cycle S1–S5 without changing whether its note is on. Hover any drum step to see the full sample name. Each of these five slots can be assigned any of the 15 shared library samples. The sample dropdown remains available.

If no usable sample is present, the track plays its built-in Drum sound (Kick, Snare or Hi-hat), selectable using **DRUM SOUND (IF NO SAMPLES)**.

### Editing a drum sample in the Sample Editor (0.1.59)

Once a drum slot has a loaded or assigned audio sample, click **EDIT** beside that slot in DRUM SAMPLES. The waveform opens in **SAMPLE EDITOR**. You can change START, END, LOOP START and LOOP END by dragging the waveform handles or editing the sliders. These marker settings belong to the **drum slot**, not to the shared library sample, so two slots using the same WAV may play different sections of it.

**PING-PONG LOOP** is available whenever LOOP ON is enabled. Ordinary looping plays forwards; Ping-Pong plays the selected section forwards, then backwards, then forwards again. It works with both mono and stereo samples. Ping-Pong does not reverse or overwrite the stored audio file; the browser creates a cached reversed playback section.

The **DRUM LIBRARY** button in Sample Editor returns to the DRUM SAMPLES page. The drum slot preview auditions its selected trim and loop. The old drum tracks and directly loaded drum samples from earlier project formats remain supported.

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

### STOP fade for long samples

When you press **STOP**, active voices fade to silence over **85 milliseconds** and their audio sources stop. You do not have to wait for a long sample to finish its 32-step pattern. This works for long Sample tracks, looping samples and loaded Drum samples, as well as the synthesizers. Shared delay and reverb may leave a brief effects tail.

### Tracker FX 9 — SAMPLE OFFSET (%)

Choose **9 · SAMPLE OFFSET (%)** on a step with a sample note, then set a decimal percentage from 00 to 99. The sample starts at that point when the step plays.

| Command | Start position |
| --- | --- |
| `900` | 0%, normal start |
| `925` | 25%, one quarter |
| `950` | 50%, halfway through the sample |
| `975` | 75%, three quarters |
| `999` | 99%, near the end |

The offset is relative to the sample's **START–END region** on Sample tracks and to the **full sample** on a Drum slot. When LOOP is enabled, FX 9 keeps the original LOOP START and LOOP END handles intact. A note starting **before LOOP END** follows the normal loop. A note starting **at or after LOOP END** plays the remaining sample region as a one-shot, so the percentage remains accurate and the loop range stays valid (0.1.59). You can hear the correct offset using the **AUDITION** button in the Step Editor, or by holding Enter on the selected note. The normal Synth/Sample instrument preview still starts from its usual position. This effect does not change synthesizer oscillator sound or synthesized fallback drum sounds. The new percentage parameter uses **decimal notation**; the existing tracker effects keep hexadecimal parameters. FX 9 is saved in projects and copied with steps and selections.

Tracker FX in **Step FX** include:

| Code | Effect |
| --- | --- |
| `1xx` | Portamento up |
| `2xx` | Portamento down |
| `3xx` | Octave up |
| `4xy` | Vibrato |
| `5xx` | Octave down |
| `9xx` | Sample start offset (00–99%, decimal) |
| `Axx` | Volume slide down |
| `Bxx` | Volume slide up |
| `C00` | Note off |

The FX row is separate from the note row. In FX-edit mode, **Backspace** clears the selected FX; **Delete** clears the note while preserving its FX.

## 8. Project saving and loading

Use the **FILE** menu for **NEW SONG**, **OPEN SONG (.JSON)** and **SAVE SONG (.JSON)**. The MIDI / AUDIO tab contains device settings.

- **PROJECT NAME** is optional. With a name, **SAVE PROJECT (.JSON)** downloads `Your Name.json`; without one it uses a filename containing the app version, date and time.
- **SAVE PROJECT** stores patterns, song arrangement, track lengths, patch parameters, loaded sample data, sample slots and preferred drum slots.
- **LOAD PROJECT** restores a previously exported song; saving your current work first is recommended because loading replaces it.
- The app also maintains a locally stored working state in the browser; do not use browser storage as your only backup.

Large sample-filled songs produce larger JSON files, because audio is embedded in the file.

### Render a VA/FM synthesizer to a WAV sample

Select a **LEAD, BASS or CHORD** track with an internal synthesizer (not MIDI OUT ONLY). Open **FILE → RENDER VA/FM SYNTH TO WAV** and enter a root note, for example **C-3** or **D#-3**, and the length of time to hold it (0.05–15 seconds). Cancel either input dialog to leave everything unchanged. The resulting WAV is named like `Squirrel_Synth_C-3_STEREO.wav` (with `_24BIT` for 24-bit output).

Since version **0.2.43**, this action renders a single note using the **same offline voice and mixer as song export**, including FM2/FM4 operator algorithms, VA oscillators, sub/noise, pulse-width modulation, assigned LFOs, synth/track filter envelopes, stereo pan, distortion, delay, reverb, chorus and master processing. It does not play the pattern, change the selected track, or add notes to your project. For CHORD tracks it samples a **single root-note voice**, not the entire chord.

The synth sample follows the File menu's WAV rate (44.1/48 kHz), PCM bit depth (16/24-bit), effect tail (3/6/10 seconds), normalize and dither selections; the **EXPORT SOURCE** selector does not affect this command. FX are printed into the audio, so loading this WAV back into a sample instrument with additional effects may double the effects.

### Save a rendered synth directly into the 15-sample pool (0.2.44)

The **FILE → RENDER / EXPORT** menu now has a **SYNTH SAMPLE DESTINATION** selector with three choices:

- **DOWNLOAD WAV** — the previous behavior, without changing samples or assignments.
- **SAVE TO 15-SAMPLE LIBRARY (FIRST FREE)** — renders the same WAV and stores it in the first empty entry of the shared drum/sample library, without requiring manual import.
- **DOWNLOAD WAV + SAVE TO LIBRARY** — downloads and stores the same rendered file.

Once saved, go to **DRUM SAMPLES** and choose the library entry for one of a drum track's five slots. The new sample does not automatically replace a drum track's existing assignment. Existing library entries are protected from overwriting; if all 15 entries are used, clear an unused one first. The library is retained in complete song JSON and sample-bank exports; when local browser storage fails, save a full song JSON to keep your work. Sample playback uses the exact WAV's sampling rate and PCM audio, including any export normalization/dither. Built-in FX and their effect tails are already included in the sample. The chosen destination is remembered locally.

### Stereo song WAV and stem export

Use **FILE → Render / Export** to select 44.1 or 48 kHz, 16/24-bit stereo PCM, and an FX tail of 3, 6 or 10 seconds. Choose **FULL MIX**, **SELECTED TRACK**, or **ALL AUDIO TRACKS · ZIP**. A ZIP contains timeline-aligned WAV stems, `STEMS_INFO.txt` and optionally a full-mix reference; MIDI-only tracks are not rendered. Peak Normalize targets −1 dBFS, and optional TPDF Dither is applied when saving PCM. Keep normalization off when relative stem levels should remain intact.

The offline VA/FM renderer includes synth transposition, sub fine tuning, LFO-controlled pulse width, the FM2 modulation envelope, and all FM4 operator carriers/modulators with their own ADSR. It renders per-track cutoff/resonance envelopes and per-patch synth filter envelopes. Short notes release from their current envelope value, rather than jumping to sustain. Disabling a synth's filter envelope prevents new live and offline notes from receiving its modulation. WAVs from the same stem ZIP use matching chance and generated-noise choices. Summed stems can still differ from the full reference because compression and shared effects are nonlinear.

## 9. Portable Sample Bank

You can back up and transfer audio separately from a song using **EXPORT SAMPLE BANK** in Options or Drum Samples. Sample Bank version 2 includes **all eight drum banks** (five slots per track) and **eight sampler slots** (one per track). Included sampler settings cover the root note, start/end markers, loop markers, filter and resonance.

**IMPORT SAMPLE BANK** replaces the current audio bank after confirmation but keeps the song arrangement, notes and patterns. Older version-1 and version-2 sample banks with existing drum banks and two sampler slots can still be imported. A Sample Bank is **not** a complete project backup; use **SAVE PROJECT** to preserve instrument configurations, synth patches and patterns as well.

### Live Mixer / Sequencer synchronization (0.1.59)

Mute and Solo buttons stay synchronized between the **Step Sequencer** and the **Mixer**. You can press **S** or **M** beside a sequencer track, then open the Mixer and immediately see the correct green SOLO / red MUTE states; you do not need to change the Mixer tab to trigger an update. Using the large buttons in the Mixer likewise updates the sequencer controls. Tracks not selected by SOLO appear temporarily muted, without replacing their manually stored MUTE settings.

Mixer strips are updated only when a meaningful track setting changes. This avoids resetting the VU indicators or faders during ordinary sequencer editing.

### Mixer MUTE / SOLO buttons (0.1.59)

**SOLO overrides MUTE on the same track:** if a channel is manually muted (red MUTE) and you click its SOLO button, that channel's MUTE is cleared and SOLO becomes green. The selected track is audible immediately. If you move SOLO to another manually muted channel, the new track's MUTE is also cleared. Switching SOLO off does not turn that channel's MUTE back on. Other tracks keep their saved manual MUTE settings.


**MUTE turns red** when a track is muted manually. **SOLO turns green** when active. Choosing SOLO on one track also mutes all other tracks automatically: their MUTE buttons turn red in both the Mixer and sequencer lane controls. Click the green SOLO button again to switch SOLO off and restore previously audible tracks, or click SOLO on another track to move the selection there.

SOLO is exclusive, so only one track is soloed at a time. The red MUTE buttons of other tracks are temporarily locked while SOLO is on to avoid changing saved mute settings. Any manually muted tracks retain their mute setting after SOLO is disabled. Track-specific MIDI output respects these mute/solo changes, with note-off sent to excluded tracks.

### Mixer signal meters (0.1.59)

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

**Documentation version: Squirrel Studio Web 0.1.59.**
