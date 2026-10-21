# Squirrel Studio 0.1

Web synthesizer en grafische 16-step groovebox in Squirrel-stijl.

```text
SQUIRREL STUDIO 0.1.0 — WEB SYNTH + GROOVEBOX
==============================================

SNEL STARTEN (WINDOWS)
1. Pak de ZIP uit in een eigen map.
2. Dubbelklik START_STUDIO.cmd (Python 3 is nodig voor de lokale server).
3. Open http://localhost:8765 in Microsoft Edge of Google Chrome.
4. Klik AUDIO STARTEN en daarna PLAY. Je hoort het demo-patroon.
   Je kunt index.html ook direct openen voor een snelle test; voor MIDI
   adviseren we http://localhost.

FUNCTIES
- Grafische 16-step sequencer, 6 onafhankelijke lanes
- Pattern banks A, B, C, D; kopiëren en plakken
- Drumklanken: kick / snare / hi-hat
- Bass, lead en chord: dubbele oscillator, filter, ADSR, pulse width
- Per step: noot (C-1 t/m B-6), velocity, gate en chance
- 6-part mixer met volume, pan, mute en solo
- Swing, BPM (50-240), mastervolume
- USB MIDI via Web MIDI (Edge of Chrome)
- MIDI CC74 filter, CC7 trackvolume
- MIDI opname naar de actieve step tijdens afspelen (REC)
- Optie voor audioapparaatkeuze waar browser dit toestaat
- Project exporteren/importeren als JSON en automatische lokale opslag
- Geen cloud, libraries of internet nodig

BEDIENING
- Klik op een pad: aan / uit + geselecteerde step
- ALT + klik: selecteer step zonder aan/uit te wijzigen
- 1-6: selecteer instrumenttrack
- Spatie: start/pauze
- A W S E D F T G Y H U J: noten spelen op de geselecteerde track
- KLIK op een instrument links om de juiste track te kiezen
- EDIT SOUND / SYNTH: oscillator, filter en ADSR
- Mixer: volume, pan, mute en solo

MIDI-CONTROLLER
1. Sluit je USB-MIDI-controller aan.
2. Klik de tab MIDI / AUDIO.
3. Klik MIDI VERBINDEN en geef toestemming.
4. Kies de MIDI-input. Kies 'geselecteerde track' of 'per MIDI-kanaal'.
5. Speel noten. Bij kanaalrouting zijn kanalen 1-6 gekoppeld
   aan track 1-6. Andere kanalen worden genegeerd.
6. REC + PLAY: nieuwe noten worden op de lopende sequencer opgenomen.

FOCUSRITE EN ASIO
- Om geluid via de Focusrite te horen, stel hem eerst in als standaard
  Windows-afspeelapparaat. Edge/Chrome kunnen je Focusrite soms ook
  rechtstreeks als uitvoerapparaat kiezen in MIDI / AUDIO.
- BROWSERS HEBBEN GEEN NATIVE ASIO API. Daarom is versie 0.1 Web Audio,
  niet Focusrite ASIO. Voor echte ASIO is een Windows-host nodig.
- Voorkom dubbel monitoren via Windows en audio-interface indien relevant.

OPMERKINGEN OVER V0.1
- Dit is een zelfstandige desktop-browser groovebox, GEEN FM1-firmware.
- Deze versie heeft 16 steps per pattern (vier afzonderlijke patterns).
- Er worden geen WAV-samples geladen: drumgeluiden worden gegenereerd.
- Chord part speelt een drieklank. Klanken zijn bewust basic v0.1.
- MIDI is invoer; MIDI export of MIDI clock sync komt later.
- Een apart native Windows ASIO programma komt in een volgende fase.```
