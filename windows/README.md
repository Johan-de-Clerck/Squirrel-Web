# Squirrel Studio Desktop 0.1.6 — eerste native JUCE synthesizer

Bass (track 4), Lead (track 5) en Chord (track 6) genereren nu de oscillatoren, filter en ADSR in JUCE, op het gekozen Windows-audioapparaat (ook Focusrite ASIO indien beschikbaar). De WebView2-interface plant noten en stuurt Note On, Note Off, pitchslides, vibrato en volumewijzigingen door via een native bridge.

**Dit is een eerste technische versie.** De native synth bevat OSC 1, OSC 2, SUB, detune, niveau, stereo-panning, filter en amplitude-ADSR. De klank is nog niet identiek aan de browser-versie. Kick/Snare/Hi-Hat, sampletracks 7/8, send-FX en LFO/filter-modulatie blijven momenteel via Web Audio lopen. Daardoor kan audio tijdelijk via verschillende apparaten lopen: de ASIO-uitgang voor de synth en Windows-standaardaudio voor drums/samples.

MIDI IN/OUT blijft native via JUCE. De 440 Hz-testtoon gebruikt dezelfde native uitgang. Selecteer bij AUDIO / ASIO de gewenste Focusrite-driver, zet het volume laag en speel een Bass- of Lead-step. Als de backend geen verbinding kan maken, test de webversie apart.

## Bouwen

GitHub Actions compileert de Windows-EXE met JUCE en WebView2. In de Windows-projectmap kun je lokaal `BUILD_WINDOWS.cmd` gebruiken (CMake, NuGet en Visual Studio C++ nodig).

## Volgende mijlpalen

Breng drumtracks en WAV-samplers naar dezelfde JUCE-audiobus, gevolgd door Delay/Reverb en volledige LFO/envelope-mapping. Pas daarna is het een uniforme ASIO-groovebox.
