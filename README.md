# Squirrel Studio 0.1.9

Websynthesizer met zes tracks, 32-stepsequencer, onafhankelijke LFO's en ADSR-filterenvelopes.

## Wijzigingen in 0.1.9

- Twee onafhankelijke ADSR-envelopes met routing naar Bass/Lead Filter Cutoff of Resonance.
- Steps 01, 05, 09, 13, 17, 21, 25 en 29 lichten subtiel op als telmarkering, ook op de FX-rijen.
- De bestaande 16–32-stepweergave, ratchets, send FX en MIDI blijven behouden.

## Instructies

```
SQUIRREL STUDIO 0.1.9 — WEB SYNTH + GROOVEBOX
==============================================

STARTEN (WINDOWS)
1. Pak de ZIP uit.
2. Start START_STUDIO.cmd (vereist Python 3) en open
   http://localhost:8765 in Microsoft Edge of Google Chrome.
3. Klik AUDIO STARTEN en druk PLAY voor het demopatroon.
4. Een losse index.html is ook direct in de browser te openen.

NIEUW IN 0.1.9
- Nieuwe ENVELOPES-tab met twee onafhankelijke filtermodulatie-envelopes.
- Iedere envelope: ACTIEF, bestemming, Attack, Decay, Sustain, Release,
  Amount van -100% tot +100% en grafische ADSR-curve.
- Bestemmingen per envelope: Bass Filter Cutoff, Bass Resonance,
  Lead/Synth Filter Cutoff en Lead/Synth Resonance.
- De envelopes triggeren per noot, dus ook via het sequencergrid en MIDI.
- Envelope en LFO kunnen tegelijkertijd dezelfde filterparameter moduleren.
- Alle envelope-instellingen worden opgeslagen in JSON-projecten.
- De noot- en FX-pads op steps 1, 5, 9, 13, 17, 21, 25 en 29
  zijn iets lichter, zodat de 4/4-telindeling in een 32-stepgrid zichtbaar is.
- Inactieve steps blijven donker, ook op een geaccentueerde positie.
- Bestaande projecten uit eerdere versies blijven compatibel.

UIT VERSIE 0.1.8
- Het onnodige hardwareoverzicht links is volledig verwijderd.
- Het sequencergrid vult nu de beschikbare browserbreedte.
- 32 notepad- en 32 FX-padkolommen zijn altijd zichtbaar, per track.
- OPTIONS: stel de patroonlengte voor A/B/C/D apart in op 1–32 steps.
- Inactieve steps krijgen een donkerdere kleur en zijn niet bewerkbaar.
  Ze worden niet afgespeeld, maar hun data blijft bewaard bij inkorten.
- De transport/playhead en toetsenbordnavigatie respecteren de ingestelde
  patroonlengte; na de laatste step begint de sequencer opnieuw bij 1.
- STEP EDITOR: nieuwe RATCHET-slider direct onder Gate (1x t/m 6x).
  Ratchet triggert de noot/drum meerdere keren verdeeld over dezelfde step.
- De gatewaarde begrenst de duur van de losse ratchet-noten.
- Patroon kopieren/plakken neemt nu ook de patroonlengte mee.
- Opslaan/laden bewaart de patroonlengte en ratchets per step.
- Oude JSON-projecten (versies 1–3) worden automatisch uitgebreid naar
  32 opgeslagen steps, met 16 actieve steps en ratchet 1x als standaard.

UIT VERSIE 0.1.7
- Vier routeerbare LFO's (Lead/Bass volume en filter cutoff).
- Per-track Delay en Reverb sends, plus globale effectenparameters.
- Snelle FX-invoer op de FX-padrij via drie hex-tekens (bijv. 202 / A02).
- Individuele instrumenten en live MIDI via Web MIDI.

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

VERSIE 0.1.9 — 21 oktober 2026

PATROONLENGTE
Open OPTIONS en kies voor ieder patroon afzonderlijk het gewenste aantal
steps. De gridweergave blijft altijd 32 kolommen tonen. Bij patroon A=16
spelen steps 1–16; steps 17–32 zijn donker en uitgeschakeld. Als je later
naar 32 terugschakelt, komen de bewaarde steps weer beschikbaar.

RATCHET
Klik op een actieve notestep, pas bij STEP EDITOR Ratchet aan van 1x
naar 2x, 3x, 4x, 5x of 6x. De triggers vallen gelijkmatig binnen een step
(inclusief swing). Ratchet 1x is het bestaande afspeelgedrag.

ENVELOPES EN MAATACCENTEN (0.1.9)
Open de ENVELOPES-tab, schakel een envelope in en kies de bestemming.
Bass en Lead hebben elk hun eigen cutoff- en resonantieparameters.
ATTACK/DECAY/RELEASE zijn in seconden, SUSTAIN en AMOUNT in procenten.
AMOUNT negatief laat het filter/de resonantie in de andere richting bewegen.
De envelope start opnieuw bij een nieuwe bass- of leadnoot en gaat
bij Note Off of Gate einde naar de release-fase.
LFO en envelopes kunnen samen dezelfde parameter aansturen.
Steps 01/05/09/13/17/21/25/29 zijn licht geaccentueerd. Inactieve
steps worden niet afgespeeld en blijven donkerder.
```
