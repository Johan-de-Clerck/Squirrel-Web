# Squirrel Studio 0.1.7

Een speelbare, standalone web-synthesizer met een 16-step groovebox en MIDI-invoer.

## Nieuw: LFO en SEND FX

Vier onafhankelijke LFO's kunnen naar Lead/Bass Volume en Filter Cutoff worden gerouteerd. Iedere track heeft een eigen Delay- en Reverb-send. FX-pads ondersteunen rechtstreekse ProTracker-achtige hex-invoer.

## Handleiding

```
SQUIRREL STUDIO 0.1.7 — WEB SYNTH + GROOVEBOX
==============================================

STARTEN (WINDOWS)
1. Pak de ZIP uit.
2. Start START_STUDIO.cmd (vereist Python 3) en open
   http://localhost:8765 in Microsoft Edge of Google Chrome.
3. Klik AUDIO STARTEN en druk PLAY voor het demopatroon.
4. Een losse index.html is ook direct in de browser te openen.

NIEUW IN 0.1.7
- LFO-tab met vier onafhankelijke LFO's.
- Per LFO: aan/uit, golfvorm (sine/triangle/square/saw),
  snelheid (0,05–20 Hz), diepte (0–100%) en een route.
- Routeer elke LFO naar Lead Volume, Lead Filter Cutoff,
  Bass Volume of Bass Filter Cutoff (of UIT).
- LFO's gebruiken echte Web Audio oscillatornodes.
  Volumemodulatie werkt op de hele track; filtermodulatie
  werkt op de stemmen van Lead/Bass, ook via MIDI.
- SEND FX-tab: afzonderlijke DELAY SEND en REVERB SEND
  voor alle zes tracks (Kick, Snare, Hi-Hat, Bass, Lead, Chord).
- Instelbare globale delaytijd, delay-feedback en galmlengte.
- Realtime effectbussen met delay-feedback en convolutiereverb.
- Typ FX-commando's rechtstreeks in de FX-padrij: klik een FX-pad
  en typ bijvoorbeeld 202, 447, A02 of B03.
- De cursor springt na drie hex-tekens naar de volgende step.
- ESC verlaat FX-invoer; Delete/Backspace wist de FX-step.
- Bestaande projectbestanden van 0.1.0 t/m 0.1.6 blijven laden.

STANDAARD INDELING
Track 1: Kick (MIDI ch 1)
Track 2: Snare (MIDI ch 2)
Track 3: Hi-Hat (MIDI ch 3)
Track 4: Bass (MIDI ch 4)
Track 5: Lead (MIDI ch 5)
Track 6: Chord (MIDI ch 6)

EDITOR / FX-COMMANDO'S
Klik een notepad om die aan of uit te zetten.
Alt + klik selecteert zonder te toggelen.
Pijltjes selecteren steps of tracks.
Enter toggelt de geselecteerde notestep.
Klik een FX-pad voor snelle hexadecimale invoer.
1xx: ProTracker-achtige period-slide omhoog per tick.
2xx: ProTracker-achtige period-slide omlaag per tick.
4xy: vibrato (snelheid/diepte).
Axx: volume slide omlaag per tick (Squirrel-commando).
Bxx: volume slide omhoog per tick (Squirrel-commando).
Bij ontbrekend slidecommando stopt de verandering. De laatst
bereikte pitch/volume blijft vast; een nieuwe noot reset de pitch.

AUDIO / FOCUSRITE
De webversie gebruikt Web Audio, geen native ASIO.
Gebruik de Focusrite als Windows-standaardgeluidskaart, of selecteer
hem in MIDI / AUDIO als de browser audio-uitgangselectie ondersteunt.
MIDI via Web MIDI in Edge/Chrome op localhost.

BESTANDEN
index.html       Complete offline webapp (HTML/CSS/JavaScript/Web Audio)
START_STUDIO.cmd Start lokale Python HTTP-server op poort 8765
README.txt       Deze instructies

VERSIE 0.1.7 — 21 oktober 2026
```
