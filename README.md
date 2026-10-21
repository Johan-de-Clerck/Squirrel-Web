# Squirrel Studio 0.1.4

Websynthesizer met een grafische 16-stepsequencer voor zes onafhankelijke tracks en vier patronen (A–D).

## Nieuw in 0.1.4

- Compactere notepads
- Onder elke track 16 FX-pads, uitgelijnd met de notepads
- `Track tools` is vervangen door `Step FX`, met een dropdown per geselecteerde step
- `00` geen effect; `01` pitch up; `02` pitch down; `03` octave up; `04` octave down
- Pitch up/down instelbaar van 1 tot 12 semitones
- Pitch-effecten worden tijdens het afspelen verwerkt, ook voor kick/snare/hi-hat
- FX-gegevens worden opgeslagen in projecten en meegenomen bij patroon kopiëren/plakken
- De oude 0.1.3-projecten blijven compatibel

## Starten

Start `START_STUDIO.cmd` onder Windows (Python 3 nodig), open `http://localhost:8765` in Edge of Chrome en klik **AUDIO STARTEN** en **PLAY**. De losse `index.html` kan ook worden geopend voor lokale audiotests.

In de sequencer selecteer je een FX-pad onder een notepad om de bijbehorende step in de FX-editor te bewerken. Met de pijltjestoetsen verplaats je de selectie. **Enter** schakelt de geselecteerde nootstep aan/uit.

## MIDI en Focusrite

Web MIDI ondersteunt compatibele USB-MIDI-controllers in Edge en Chrome. De audio-uitgang kan via je Focusrite lopen als Windows-afspeelapparaat. Browsers bieden **geen native ASIO**; dit vereist een aparte Windows-audioengine.
