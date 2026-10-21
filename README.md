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

## Windows desktop (JUCE / ASIO-test)

Het JUCE Windows-project staat in [`windows/`](windows/README.md). Het opent gemaximaliseerd en past de sequencer, mixer en modulatiedelen aan de volledige vensterhoogte aan. De GitHub Actions-workflow [Windows Desktop](../../actions/workflows/windows-desktop.yml) bouwt een Windows-x64 `.exe` zodra de C++-compile slaagt.

**Huidige beperking:** de native ASIO-uitgang ondersteunt een testtoon; de Squirrel synthese-engine speelt vooralsnog via Web Audio binnen WebView2. Een koppeling van de synth naar ASIO volgt in een latere desktopversie.


## Web UI 0.1.16

# Squirrel Studio Web 0.1.16

- Compacte, gelijkvormige Step editor voor alle tracks, inclusief Bass, Lead, Chord en samplers.
- Op korte Windows/WebView2-vensters worden de pads compacter zonder ongewenste verticale gridscrollbars.
- Vier LFO’s ondersteunen nu FREE en tempo-sync (1/1, 1/2, 1/4, 1/8, 1/16, 1/32).
- Bestaande projecten met LFO’s zonder sync-instelling blijven ongewijzigd in FREE-modus.
- De overige functies van 0.1.15 blijven behouden, inclusief MIDI OUT en waveform-playhead.

Start in Chrome/Edge met een lokale server, of gebruik de gedeelde `index.html` via JUCE/WebView2.

---

# Squirrel Studio Web 0.1.17

## Nieuw: effecten op track 7 en 8

- SEND FX toont alle 8 tracks. Iedere track heeft een eigen Delay Send en Reverb Send van 0–100%.
- Samplers 7 en 8 hebben nu een eigen lowpass-filter met Cutoff (80–12.000 Hz) en Resonance (Q 0,1–18). Te vinden onder SAMPLE EDITOR.
- LFO-routing uitgebreid met Sampler 7/8 Volume, Filter Cutoff en Panning.
- Beide filter-envelopes kunnen ook naar Sampler 7/8 Filter Cutoff of Resonance worden gerouteerd.
- Per-step tracker-FX blijven werken op de samplertracks: 1xx/2xx pitch slide, 4xy vibrato, Axx/Bxx volume slide en C00 NOTE OFF. Ook ratchets blijven ondersteund.
- Delay/Reverb Sends en sampler-filterinstellingen van tracks 7/8 worden bewaard in song-JSON en hersteld bij het openen van oudere songs (standaard send 0%).
- De SEND FX-pagina is compacter gemaakt voor kleinere Windows/WebView2-vensters.

## Web starten

Start `START_STUDIO.cmd` (Python 3 nodig) en open http://localhost:8765 in Microsoft Edge of Chrome. Klik AUDIO STARTEN en dan PLAY. Je kunt ook `index.html` rechtstreeks openen; voor Web MIDI is localhost aanbevolen.

## Windows-versie

De JUCE-desktopbuild wordt automatisch bijgewerkt via de gedeelde `index.html` in de GitHub-repository. De Windows-app gebruikt op dit moment Web Audio voor het synthesizergeluid; native ASIO wordt alleen gebruikt voor de testtoon. De volledige synthese-engine is nog niet op JUCE/ASIO aangesloten.

## Testen

- Stel track 7/8 in OPTIONS op SAMPLER, laad een WAV, en programmeer noten.
- Ga naar SEND FX, zet Delay Send en Reverb Send voor track 7 of 8 hoger dan nul en druk op PLAY.
- Ga naar SAMPLE EDITOR en verander FILTER CUTOFF / RESONANCE.
- Routeer een LFO naar SAMPLER 7 · PANNING en luister naar de stereobeweging.
- Exporteer en importeer een project om instellingen te behouden.

Voorbeeldinstelling: Sampler 7 Delay Send 45%, Reverb Send 25%, Filter Cutoff 2200 Hz, Resonance 2.0.

## Web 0.1.18 — CHORD per step

De CHORD-track gebruikt dezelfde dual-oscillatorparameters als BASS/LEAD (OSC 1/2, detune, pulse width, filter en ADSR). De akkoordkwaliteit wordt **per step** ingesteld in SEQUENCER → Step FX → **CHORD MODE** (rechts naast FX COMMANDO), onafhankelijk van het tracker-effect. Keuzes: MAJ, MIN, SUS2, SUS4, DIM, AUG, 7, MAJ7, MIN7, M7b5, DIM7, ADD9, MIN9, MAJ9 en POWER. MIDI OUT stuurt alle akkoordnoten inclusief Note Off. Oude songs behouden hun major/minor-voicing. De Windows-build neemt automatisch de nieuwste web-UI mee.


---

# Squirrel Studio 0.1.19 — 3 oscillatoren

Webversie van de Squirrel Studio groovebox. De Windows desktopvariant embedt dezelfde `index.html` uit de hoofdmap van Squirrel-Web.

## Nieuw in 0.1.19

- BASS (track 4), LEAD (track 5), CHORD (track 6): drie synthsecties naast elkaar: OSCILLATOR 1, OSCILLATOR 2, SUB OSCILLATOR.
- Sub waveform: SAW, PULSE, SINE.
- Sub octave: -12 / -24 semitones ten opzichte van de gespeelde noot.
- Sub detune: -50 tot +50 cent en eigen level: 0–100%.
- Pulse width blijft voor de pulse-golven instelbaar (gedeeld voor OSC 1, OSC 2 en SUB).
- Sub gaat door dezelfde filter, ADSR en mixer/effect-routing als OSC 1 en 2.
- Pitchslide, vibrato en NOTE OFF grijpen aan op alle drie oscillatoren; CHORD blijft meerstemmig.
- Subinstellingen worden per instrument en in song-JSON opgeslagen. Bestaande songs zonder subinstellingen krijgen veilige defaults: SINE, -12 ST, 0 cent, 35% level.
- Layout past op 1920×768 / 900 / 1080, zonder extra pagina-scrollbar.

## Windows/web starten

Open `index.html` in Chrome of Edge. Voor betrouwbare MIDI-toegang is de lokale server via `START_STUDIO.cmd` aanbevolen (Python 3 nodig), bereikbaar op http://localhost:8765.

Voor de native Windows-app gaat een nieuwe GitHub Actions-build lopen zodra de web-`index.html` op main is bijgewerkt. De desktopapp gebruikt momenteel Web Audio voor de synthese; de afzonderlijke JUCE-audio-uitgang kan een ASIO-testtoon genereren.

## Bediening

Kies BASS, LEAD of CHORD en open de tab SYNTH. Stel in het SUB OSCILLATOR-paneel waveform, octave, detune en level in. Voor een klassieke diepe bas: SINE, -12 semitones, 0 cent, level 30–50%. Voor een zwaardere sublaag: -24 semitones, bijvoorbeeld met SAW op lager level.

---

# Squirrel Studio Web 0.1.20

Nieuw: Bass, Lead en Chord hebben nu afzonderlijke AAN/UIT-schakelaars voor OSC 1, OSC 2 en SUB, plus LEVEL 0–100% per oscillator. De SUB behoudt zijn waveform, −12/−24 semitones en detune. Schakelen en volume wijzigen werkt op actieve noten met een korte gain-ramp.

Andere functies blijven behouden: acht tracks, 16 patronen, samples, per-step CHORD MODE, FX, LFO/envelopes, MIDI IN/OUT en project-export. Oude projectbestanden laden met hun bestaande oscillatormix.

## Starten
1. Start `START_STUDIO.cmd` met Python 3 op Windows.
2. Open `http://localhost:8765` in Edge of Chrome.
3. Klik AUDIO AAN en open SYNTH; selecteer Bass, Lead of Chord.

Windows desktop gebruikt de actuele `index.html` uit GitHub bij het bouwen. Focusrite ASIO is in de desktopbasis nog een aparte native testuitgang; de synth zelf draait via Web Audio.