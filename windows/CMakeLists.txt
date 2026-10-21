cmake_minimum_required(VERSION 3.24)
project(SquirrelStudioDesktop VERSION 0.1.1 LANGUAGES C CXX)

if (NOT WIN32)
    message(FATAL_ERROR "Deze desktop-build is bedoeld voor Windows 10/11 x64. Gebruik de webversie op andere platforms.")
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
    juce
    GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
    GIT_TAG 8.0.16-security
    GIT_SHALLOW TRUE)
FetchContent_MakeAvailable(juce)

# De HTML is gedeeld met de gewone webversie en wordt IN de .exe ingebakken.
# Dit bestand wordt vanuit de repo-root gekopieerd door BUILD_WINDOWS.cmd / GitHub Actions.
set(SQUIRREL_WEB_HTML "${CMAKE_CURRENT_SOURCE_DIR}/web/index.html")
if (NOT EXISTS "${SQUIRREL_WEB_HTML}")
    message(FATAL_ERROR "web/index.html ontbreekt: kopieer de actuele webversie eerst.")
endif()

juce_add_binary_data(SquirrelWebResources SOURCES "${SQUIRREL_WEB_HTML}")

juce_add_gui_app(SquirrelStudioDesktop
    PRODUCT_NAME "Squirrel Studio Desktop"
    COMPANY_NAME "Squirrel Studio"
    NEEDS_WEBVIEW2 TRUE)

juce_generate_juce_header(SquirrelStudioDesktop)

target_sources(SquirrelStudioDesktop PRIVATE src/Main.cpp)

target_compile_definitions(SquirrelStudioDesktop PRIVATE
    JUCE_WEB_BROWSER=1
    JUCE_USE_WIN_WEBVIEW2_WITH_STATIC_LINKING=1
    JUCE_ASIO=1
    JUCE_ASIO_USE_EXTERNAL_SDK=0
    JUCE_APPLICATION_NAME_STRING="Squirrel Studio Desktop"
    JUCE_APPLICATION_VERSION_STRING="0.1.1")

target_link_libraries(SquirrelStudioDesktop PRIVATE
    SquirrelWebResources
    juce::juce_gui_extra
    juce::juce_audio_utils
    juce::juce_recommended_config_flags
    juce::juce_recommended_warning_flags)