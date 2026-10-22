# Squirrel Studio Desktop (experimental JUCE build)

The `windows/` folder contains a separate **Windows desktop** integration of the Squirrel Studio web interface. The browser release (`index.html`) is authoritative; the native application is a technical prototype and does not yet have complete feature parity with the current web version **0.1.41**.

## Existing native features

The JUCE-native audio path was previously implemented for Kick, Snare, Hi-Hat, Bass, Lead and Chord: note/drum triggers, dual oscillator + sub voice generation, panning/volume and transport-related controls. The Windows project can also display the current browser UI through WebView2.

**Important:** Newer web features such as the five sample slots on each drum track, portable Sample Bank, updated Song Mode, and some sampler or send-FX paths may still use Web Audio or remain unsupported in the native engine. Do not assume full ASIO routing for these functions.

## Building locally

Prerequisites: Visual Studio 2022 C++ toolchain, CMake, WebView2 SDK (NuGet), JUCE as required by the project, and suitable Windows audio drivers.

Run `BUILD_WINDOWS.cmd` from this folder as documented in its script, or use the manually triggered **Windows Desktop (JUCE + ASIO)** GitHub Actions workflow.

The workflow copies the root `index.html` into the Windows package before compilation. It does **not** imply that newer web synth features have been ported to JUCE.

## Audio routing

The browser/web editor uses Web Audio. The Windows test implementation contains a separate JUCE device path that can select a Focusrite ASIO device when correctly installed. Some sounds and effects may be routed to the browser output rather than the JUCE output.

For the latest browser controls and project/sample-bank instructions, see [../HELP.md](../HELP.md).

*Windows README updated to reflect web release 0.1.41. Native build and full integration have not been verified in this update.*
