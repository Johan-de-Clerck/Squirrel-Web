# Squirrel Studio 0.1.5

Web synthesizer en 16-step groovebox, met ProTracker-geïnspireerde tracker-effecten.

```
SQUIRREL STUDIO 0.1.5 — WEB SYNTH + STEP SEQUENCER
===================================================

STARTEN
1. Pak de ZIP uit in een eigen map.
2. Start START_STUDIO.cmd (Python 3 nodig) op Windows.
3. Open http://localhost:8765 in Microsoft Edge of Google Chrome.
4. Klik AUDIO STARTEN en PLAY om het demo-patroon te horen.
5. De losse index.html kan ook zonder lokale server geopend worden.

TRACKER FX (NIEUW IN 0.1.5)
- Kies een track en een FX-pad. Kies in Step FX een commando en typ twee
  hexadecimale tekens (00-FF) in het parameter-veld.
- De FX-code verschijnt als drie tekens: commando + twee cijfers (bv. 202).
- De pitch-slide gebruikt ProTracker-achtige period-eenheden per tick.
- Iedere sequencerstep heeft 6 tracker-ticks: tick 0 is de nootstart,
  ticks 1-5 voeren de pitch- of volumeschuif uit.

  0xx  GEEN EFFECT             000
  1xx  PORTAMENTO UP           103 = 3 period-eenheden per tick omhoog
  2xx  PORTAMENTO DOWN         202 = 2 period-eenheden per tick omlaag
  3xx  OCTAVE UP              302 = een octaaf omhoog
  4xy  VIBRATO                447 = snelheid 4, diepte 7
  5xx  OCTAVE DOWN            502 = een octaaf omlaag
  Axx  VOLUME SLIDE DOWN      A02 = 2 volumeeenheden per tick omlaag
  Bxx  VOLUME SLIDE UP        B02 = 2 volumeeenheden per tick omhoog

- FX op steps zonder nieuwe noot werkt ook. Start je op step 01 met
  een basnoot + 202, dan blijft de noot klinken en verder zakken tijdens
  volgende lege steps, tot een nieuwe noot/FX het onderbreekt.
- Een nieuwe noot start weer op de ingevoerde toonhoogte.
- Kies een nieuw FX-commando om de doorlopende slide te veranderen.
- Parameter 00 hergebruikt bij slide-commando's de laatste waarde van
  hetzelfde commando (zoals effect-memory in trackers).
- A en B zijn specifiek voor Squirrel Studio: originele ProTracker
  gebruikt andere betekenissen voor deze twee FX-codes.

SEQUENCER
- 6 onafhankelijke instrumenttracks: Kick, Snare, Hi-hat, Bass, Lead, Chord.
- 16 notepads + 16 FX-pads per track. 4 patroonbanken (A, B, C, D).
- Klik op de notepad om hem aan/uit te zetten, of klik op een FX-pad
  om alleen die FX-step te selecteren.
- FX WISSEN wist het effect op de geselecteerde step.
- ALLE FX TRACK WISSEN wist alle FX-codes op die track in het patroon.

TOETSENBORD
- Pijltjes links/rechts: vorige/volgende step.
- Pijltjes boven/onder: vorige/volgende track.
- Enter: geselecteerde notepad aan/uit.
- Spatie: spelen/pauzeren. Cijfertoetsen 1–6: track kiezen.
- A W S E D F T G Y H U J: noten live bespelen.
- Na het wijzigen van een slider of bevestigen van een hex-waarde gaat
  de focus terug naar de notepads; pijltjes werken direct weer.

AUDIO / MIDI
- Web Audio met 6-track mixer, synthoscillatoren en drumklanken.
- USB MIDI via Web MIDI in Chrome of Edge; MIDI CC7 en CC74.
- Focusrite als Windows-uitvoerapparaat kan gebruikt worden.
- Native ASIO werkt NIET rechtstreeks in een webbrowser. Daarvoor
  is een aparte native Windows audioengine nodig.

OPSLAG EN COMPATIBILITEIT
- Automatisch opslaan in localStorage; JSON export/import via MIDI/AUDIO.
- Oude projecten van 0.1.4 en eerder (schema v1) worden ingelezen.
- Het oude effect 04 (Octave Down) wordt geconverteerd naar effect 05,
  omdat effect 04 nu Vibrato betekent. De oude pitch-up/down-waarden
  worden naar tracker-period-snelheden omgerekend.
- Het interne projectformaat is nu schema-versie 2.

0.1.5 GETEST
- Chromium desktopvensters van 1920x960 en 1920x1080 zonder verticale
  scrollbar. Op 1366x768 is verticale scroll mogelijk.
- Nieuwe FX dropdown, hex-parameter, 6-ticks slide, doordraaien over
  lege steps, toetsenbordnavigatie en het laden van oude projecten.```
