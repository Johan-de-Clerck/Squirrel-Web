# Squirrel Studio Desktop — Windows native, eerste basisversie 0.1.1

Dit is het **naast elkaar bestaande Windows-project** bij Squirrel Studio Web 0.1.15.
De webapp blijft intact. De Windows-versie gebruikt exact dezelfde ingebouwde `web/index.html`
in een **native JUCE 8 / Microsoft Edge WebView2 venster** en bevat een aparte native audioapparaatlaag.

## Vensters vullen de beschikbare schermhoogte

De Windows-app opent standaard gemaximaliseerd, rekening houdend met de Windows-taakbalk.
De actieve pagina vult nu de ruimte onder de Squirrel Studio-transportbalk en tabs.
De sequencer, mixer, LFO/envelopes en waveform-editor gebruiken de beschikbare hoogte;
bij kleinere vensters verschijnt alleen waar nodig een scrollbar binnen het actieve paneel.
Het venster blijft in grootte aanpasbaar en ondersteunt Windows Snap.

## Wat werkt in deze eerste desktopbasis?

- Echt Windows `.exe` project (C++17, JUCE 8, CMake, Visual Studio 2022).
- Bestaande Squirrel Studio 0.1.15-UI ingebed in het venster (met song-JSON-bestanden).
- Windows-audioapparaatkeuze inclusief beschikbare **ASIO**-drivers, indien de Focusrite-driver is geïnstalleerd.
- **TEST 440 Hz** om de native audio-uitgang te controleren, bij voorkeur op de Focusrite ASIO-driver.
- Webversie blijft onafhankelijk bruikbaar in Chrome en Edge.
- GitHub Actions bouwt de Windows-app automatisch; download daarna `SquirrelStudioDesktop-Windows-x64` bij Actions → laatste build → Artifacts.

## Belangrijke beperking

**De bestaande Squirrel-synthese, sampler en sequencer produceren in deze eerste desktopbasis nog audio via Web Audio in de ingebouwde WebView2.**
Het JUCE ASIO-geluidsapparaat is wel geopend en testbaar, maar de bestaande
Web Audio-engine wordt **nog niet** naar JUCE/ASIO gerouteerd. Je hoort de song
in deze fase via de standaard-Windows-audioroute (of de Focusrite als Windows-uitgang).

Dat is een bewust tussenstadium: om de volledige synth via ASIO te spelen, moet de
synthese/samplerengine worden overgezet naar JUCE C++ of met een goed ontworpen
audiobrug worden verbonden. Een ASIO-apparaatkeuzeknop alleen lost dat niet op.

## Build op je Windows 11-pc

1. Installeer Visual Studio 2022 met **Desktop development with C++**.
2. Installeer CMake 3.24+, Git en `nuget.exe` (of bouw via GitHub Actions).
3. Installeer de **Microsoft Edge WebView2 Runtime** (meestal al aanwezig op Windows 11).
4. Installeer de officiële **Focusrite Windows/ASIO-driver**.
5. Start `BUILD_WINDOWS.cmd` in deze map.
6. Start de gegenereerde `.exe` onder `build/SquirrelStudioDesktop_artefacts/Release/`.
7. Open **AUDIO / ASIO**, kies het Focusrite ASIO-device en probeer **TEST 440 Hz**.

Een Windows-build kan hier in de Linux-ontwikkelomgeving niet worden uitgevoerd.
De GitHub Actions-workflow moet als eerste echte Windows-compile worden gecontroleerd.

## Samen met de webversie

De repository bevat:

- `/index.html` — bestaande webversie, geen wijzigingen nodig.
- `/windows/web/index.html` — kopie voor de Windows-build (wordt automatisch vanuit `/index.html` aangemaakt; de ZIP bevat al een kopie).
- `/windows/src/Main.cpp` — JUCE Windows shell en ASIO-test.
- `/windows/CMakeLists.txt` — Windows build.
- `/.github/workflows/windows-desktop.yml` — automatische Windows-build.

Bij webupdates kun je `/index.html` naar `/windows/web/index.html` kopiëren en de desktop opnieuw compileren.

## Licenties

JUCE kan onder GPLv3 of een commerciële licentie worden gebruikt. JUCE 8 bevat
Steinberg ASIO-bronbestanden waarvoor ook licentievoorwaarden gelden. Controleer
de licenties voordat je de Windows-app publiek verspreidt. Dit project voegt
geen losse SDK of drivers toe aan de ZIP.