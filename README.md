# Squirrel Studio 0.1.14

Een complete standalone web-synthesizer met acht tracks, 16 patronen, gecombineerde LFO/Envelope-weergave en waveform sample-editor.

```
SQUIRREL STUDIO 0.1.14 — WEB SYNTH + GROOVEBOX
================================================

BELANGRIJKE REPARATIE
De vorige 0.1.13-versie op GitHub werd onvolledig gepubliceerd. Versie 0.1.14
bevat weer de volledige JavaScript-engine, zodat de sequencer en de menu's
kunnen starten. Gebruik deze nieuwe build en maak eerst een back-up van je song.

STARTEN ONDER WINDOWS
1. Pak de ZIP volledig uit.
2. Dubbelklik START_STUDIO.cmd (hiervoor is Python 3 nodig).
3. Open http://localhost:8765 in Edge of Chrome.
4. Klik AUDIO STARTEN en PLAY.
   Een los index.html-bestand kan ook direct met Edge/Chrome worden geopend.
   Voor betrouwbare MIDI en IndexedDB-sampleopslag is localhost aanbevolen.

NIEUW IN 0.1.14
- LFO / ENVELOPES op één pagina: vier LFO's links in een 2x2-grid,
  twee ADSR-filterenvelopes rechts verticaal.
- Patroonselectie met dropdown A1, A2, A3, A4, B1...D4: 16 losse patronen.
- In OPTIONS zijn de step-lengtes van alle 16 patronen afzonderlijk te kiezen.
- Bestaande A/B/C/D-projecten gaan naar A1/B1/C1/D1.
- SAMPLE EDITOR-tab voor sampler 7 en 8: WAV laden, waveform, startpunt,
  eindpunt, loopstart, loopend, loop aan/uit, grondtoon en beluisteren.
- Vier waveformmarkeringen zijn met de muis te verslepen of met sliders
  nauwkeurig in te stellen. Samples spelen vanaf het startpunt (standaard 0),
  en bij ingeschakelde loop wordt daarna het ingestelde loopgebied herhaald.
- De sampledata, grondtoon, start-, eind- en looppunten staan in het
  geëxporteerde JSON-project.

BEDIENING
- EDIT AAN: A W S E D F T G Y H U J typen noten rechtstreeks in de steps.
- EDIT UIT: dezelfde toetsen spelen live op de geselecteerde track.
- Pijltjes: selecteren van step/track; Enter: step aan/uit.
- Klik op FX-pad en typ direct bijvoorbeeld 202, 447, A02, B03 of C00.
- SAMPLE EDITOR: selecteer track 7 of 8, klik WAV LADEN, sleep markers.
- OPTIONS: patroonlengte 1 t/m 32 steps, NEW SONG met bevestiging.

FUNCTIONALITEIT DIE BLIJFT
- Acht tracks, 32 notepads + FX-pads per track.
- Bass, Lead, Chord met VA-synthese; drumtracks; sampler in track 7 of 8.
- ProTracker-geïnspireerde pitch/volume slides en vibrato; C00 NOTE OFF.
- Delay/reverb sends, vier LFO's, twee envelopes, mixer, USB-MIDI.
- Ratchet 1x–6x, swing, BPM, mute/solo, WAV-import en JSON-projecten.

AUDIO
De browser gebruikt Web Audio. Een Focusrite kan als Windows-uitvoer worden
gebruikt. Echte native ASIO is niet beschikbaar in Edge/Chrome.

OPMERKING
De waveform-editor ondersteunt één sample per samplertrack. Sample editing
is non-destructief; de WAV-bron blijft in JSON behouden.
```
