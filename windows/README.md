# Squirrel Studio Desktop 0.1.7 — Native JUCE drums

De Windows-app gebruikt nu **6 native audiotracks** via dezelfde geselecteerde Windows-uitgang (inclusief Focusrite ASIO wanneer geïnstalleerd): Kick, Snare, Hi-Hat, Bass, Lead en Chord.

- **KICK:** sinus met snelle pitch-envelope en korte decay.
- **SNARE:** gefilterde ruis met korte tooncomponent.
- **HI-HAT:** korte hoogdoorlaat-ruis.
- **BASS / LEAD / CHORD:** dual oscillators plus sub, filter en amplitude-ADSR.

De sequencer verstuurt getimede Note On-, drum-, pitch/volume- en NOTE OFF-commando's naar JUCE. Ratchets, snelheid, mute/solo, trackvolume, panning en mastervolume worden aan de native engine doorgegeven. STOP annuleert ook geplande hits en noten.

**Nog niet native:** WAV-samplers 7/8, Delay/Reverb, volledige LFO/filtermodulatie. Deze functies lopen in de Windows-app voorlopig nog via Web Audio; stuur ze via Windows naar een passend audioapparaat. De native drums kunnen iets anders klinken dan hun Web Audio-versie.

Voor testen: selecteer onder **AUDIO / ASIO** de Focusrite, begin met laag volume, activeer AUDIO en speel een patroon met Kick, Snare, Hi-Hat en Bass. De 440 Hz-testtoon gebruikt dezelfde native uitgang.

## Bouwen

GitHub Actions bouwt automatisch een Windows x64-EXE via JUCE en WebView2. Voor lokaal bouwen: Visual Studio 2022 (C++), CMake, NuGet WebView2 SDK, en `BUILD_WINDOWS.cmd`.

Dit is een technische tussenversie. De volgende mijlpaal is WAV-samplers 7/8 native aansluiten en vervolgens de sends en modulatie naar dezelfde JUCE-mix verplaatsen.
