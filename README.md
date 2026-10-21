# Squirrel Studio 0.1.13

Websynthesizer met acht sequencertracks, 32-step-grid en twee optionele sample-instrumenten.

## Sampler tracks 7 en 8

Selecteer in OPTIONS per track **SAMPLER**, laad een audiobestand (max. 16 MB) en kies de grondtoon. Samples zijn speelbaar via MIDI en het stepgrid. Exporteer je song naar JSON om de gebruikte samplebestanden in het project mee te nemen. **FM** en **VA** zijn nog gereserveerde instrumenttypes.

## Handleiding

```
SQUIRREL STUDIO 0.1.13 — WEB SYNTH / GROOVEBOX / SAMPLER
========================================================

STARTEN (WINDOWS)
1. Pak de ZIP uit.
2. Dubbelklik START_STUDIO.cmd (vereist Python 3).
3. Open http://localhost:8765 in Chrome of Edge.
4. Klik AUDIO STARTEN en daarna PLAY.

NIEUW IN 0.1.13
- Track 7 en 8 kunnen via OPTIONS als EMPTY, SAMPLER, FM of VA worden ingesteld.
- SAMPLER werkt nu echt: laad per slot een eigen WAV (of een ander door de browser ondersteund audioformaat).
- Eén sample per track, maximaal 16 MB per bestand.
- Stel per sampler de GRONDTOON in (standaard C3). Noten in de sequencer en MIDI transponeren de sample chromatisch.
- Samplertracks reageren op velocity, ratchets, mute/solo, volumefader, panning en step-FX.
- Verwijderen via OPTIONS > slot > VERWIJDER.
- De samplertracks zijn ook via het SYNTH-menu bereikbaar: selecteer track 7 of 8.
- Samplebestanden worden samen met het project in de geëxporteerde JSON opgeslagen.
- In een normale browser via localhost worden samples daarnaast lokaal bewaard via IndexedDB; de overige songinstellingen via localStorage. Gebruik project-export als back-up.
- FM en VA blijven gereserveerd voor een latere engineversie.
- Nootlabels gebruiken het compacte formaat C3, D#3, F#4 (zonder streepje voor het octaaf).

SAMPLE LADEN
1. Ga naar OPTIONS.
2. Kies voor INSTRUMENT SLOT 7 (of 8) de waarde SAMPLER.
3. Klik SAMPLE LADEN en kies een WAV-bestand van maximaal 16 MB.
4. Kies GRONDTOON op de toon waarop het oorspronkelijke bestand is opgenomen.
5. Ga naar SEQUENCER, programmeer noten op track 7 of 8, en klik PLAY.
6. Gebruik het MIXER-menu voor volume, panning en mute/solo.
7. Klik op de pagina MIDI / AUDIO op PROJECT OPSLAAN voor een zelfstandige JSON met samples.

BELANGRIJK BIJ OPSLAAN
Een project met samples is groter: sampledata wordt in de JSON zelf opgenomen, zodat bij het terugladen geen apart WAV-bestand nodig is.
Om te vermijden dat localStorage volloopt, staan de samplebytes bij lokale autosave in IndexedDB. Dat hangt af van browserinstellingen en de website-oorsprong. Bewaar daarom regelmatig een geëxporteerd projectbestand.
NEW SONG wist na bevestiging ook de lokaal opgeslagen samplerbestanden voor slot 7 en 8.

BESTAANDE FUNCTIES
- 8 lanes, 32 zichtbare steps, 4 patronen A-D met instelbare lengte.
- 6 ingebouwde instrumenttracks (kick, snare, hat, bass, lead, chord).
- 16-step patroon gebruikt 16 heldere + 16 uitgeschakelde pads.
- Step-FX ProTracker-achtig: 1xx/2xx pitch slides, 4xy vibrato, Axx/Bxx volume slides, C00 NOTE OFF.
- EDIT AAN: A W S E D F T G Y H U J plaatsen rechtstreeks noten in de geselecteerde track.
- EDIT UIT: dezelfde toetsen spelen live.
- Pijltjestoetsen verplaatsen de selectie; Enter togglet een step.
- Ratchet per step (1x-6x), velocity, gate, chance.
- Vier LFO's, twee ADSR-filterenvelopes, delay/reverb sends op de eerste zes tracks.
- USB-MIDI in Chrome/Edge (Web MIDI), audio via Windows/Focusrite standaard output.
- Native ASIO is niet beschikbaar in gewone browsers.

NIEUWE SONG
OPTIONS > NEW SONG, daarna bevestigen: 120 BPM, patroon A-D 16 steps,
alle patronen leeg, alle 8 tracks beschikbaar, samplerdata verwijderd.

GITHUB
https://github.com/Johan-de-Clerck/Squirrel-Web
```
