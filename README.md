# Squirrel Studio 0.1.15

Squirrel Studio is een standalone web-synthesizer en 32-step-groovebox met acht tracks, optionele sample-instrumenten, vier LFO's en twee envelopes.

## Nieuw in 0.1.15

- Sample-editor met realtime groene playback cursor, tijdweergave en looptracking.
- MIDI OUT via Web MIDI: poort, track, kanaal, in/uit, STOP en All Notes Off.
- Focusrite-audio via Windows; voor echte ASIO is een native Windows-backend nodig.

## Handleiding

```text
SQUIRREL STUDIO 0.1.15 — WEB SYNTH + MIDI OUT
=============================================

STARTEN (WINDOWS)
1. Pak de complete ZIP uit in een lege map.
2. Start START_STUDIO.cmd (Python 3 nodig) en open http://localhost:8765.
3. Gebruik Edge of Chrome, klik AUDIO STARTEN en PLAY.

NIEUW IN 0.1.15
- SAMPLE EDITOR: groen afspeelstreepje met driehoek en actuele positie
  tijdens live-afspelen, de sequencer en sample loops (track 7/8).
- MIDI / AUDIO: MIDI OUT-keuzelijst, AAN/UIT, gekozen track of alle tracks,
  kanalen CH1-CH16 of per-track CH1-CH8, plus ALL NOTES OFF.
- MIDI OUT gebruikt getimede MIDI Note On/Off; ratchets en C00 NOTE OFF
  worden gevolgd. Mute/solo werkt voor externe noten.
- MIDI OUT staat voor de veiligheid standaard UIT.
- MIDI IN blijft beschikbaar voor Focusrite en USB-MIDI-controllers.

MIDI OUT NAAR MINIFREAK
1. Sluit de MiniFreak via USB-MIDI aan, OF verbind de 5-polige MIDI OUT
   van je Focusrite met de MIDI IN van de MiniFreak.
2. Open MIDI / AUDIO, klik MIDI VERBINDEN en geef toegang.
3. Kies de juiste MIDI OUT-poort (MiniFreak of Focusrite MIDI Out).
4. Kies bij TRACK NAAR MIDI OUT de sequencertrack, bijvoorbeeld TRACK 4 BASS.
5. Kies het MIDI-kanaal van je MiniFreak (gewoonlijk CH1, tenzij je dit
   op de MiniFreak anders hebt ingesteld).
6. Zet MIDI OUT AAN en start PLAY.
7. Druk bij hangende noten op ALL NOTES OFF of STOP.

BELANGRIJK
- De MIDI OUT-sequencer verstuurt noot en velocity plus Note Off.
- ProTracker pitch/volume slides zijn op dit moment intern audio-FX;
  voor de MiniFreak worden nog geen pitch-bend of MIDI CC-effecten uitgezonden.
- MIDI OUT is geen MIDI THRU: binnenkomende live MIDI-noten worden nog
  niet automatisch doorgestuurd naar de MIDI-uitgang.
- Sommige apparaten hebben verschillende poorten voor IN en OUT;
  kies de poort die daadwerkelijk naar de MiniFreak leidt.

FOCUSRITE AUDIO / ASIO
- De webversie gebruikt Web Audio via Windows (WASAPI/WDM).
- Kies de Focusrite onder MIDI / AUDIO als audio-uitvoer (als beschikbaar),
  of stel de Focusrite in Windows in als standaard afspeelapparaat.
- Edge/Chrome bieden GEEN native ASIO-audio-API. De ASIO-driver van Focusrite
  kan daarom niet rechtstreeks door de webversie worden geopend.
- Voor echte ASIO met verstelbare buffer maken we later een Windows-app
  met dezelfde interface en een native JUCE- of PortAudio-audioengine.

OVERIGE FUNCTIES
- 16 patronen A1-D4, ieder 1-32 steps, acht tracks.
- LFO/envelopes, sample editor met start-, eind- en looppunten.
- Samples in track 7/8; songprojecten bewaren WAV-data in JSON.
- EDIT AAN: A W S E D F T G Y H U J typen noten rechtstreeks in de grid.

Opslaan: MIDI OUT-poortkeuze is een sessie-instelling; zet MIDI OUT
na heropenen opnieuw bewust AAN.
```
