@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Squirrel Studio - Local Windows Build

echo ==========================================
echo SQUIRREL STUDIO - LOCAL WINDOWS x64 BUILD
echo ==========================================
echo.

if exist "..\index.html" (
  if not exist "web" mkdir "web"
  copy /Y "..\index.html" "web\index.html" >nul
)
if not exist "web\index.html" (
  echo ERROR: windows\web\index.html ontbreekt.
  goto :failed
)

rem Prefer the native Windows CMake, not MSYS/MinGW CMake from PATH.
set "CMAKE_EXE="
if exist "%ProgramFiles%\CMake\bin\cmake.exe" set "CMAKE_EXE=%ProgramFiles%\CMake\bin\cmake.exe"
if not defined CMAKE_EXE (
  for %%E in (Community Professional Enterprise BuildTools) do (
    if not defined CMAKE_EXE if exist "%ProgramFiles%\Microsoft Visual Studio\2022\%%E\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe" (
      set "CMAKE_EXE=%ProgramFiles%\Microsoft Visual Studio\2022\%%E\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe"
    )
  )
)
if not defined CMAKE_EXE (
  for /f "delims=" %%P in ('where.exe cmake 2^>nul') do (
    if not defined CMAKE_EXE set "CMAKE_EXE=%%P"
  )
)
if not defined CMAKE_EXE (
  echo ERROR: CMake ontbreekt. Installeer de officiele Windows x64-versie van CMake.
  echo https://cmake.org/download/
  goto :failed
)
echo Gekozen CMake: "%CMAKE_EXE%"
"%CMAKE_EXE%" --version
"%CMAKE_EXE%" --help | findstr /C:"Visual Studio 17 2022" >nul
if errorlevel 1 (
  echo.
  echo ERROR: Deze CMake heeft GEEN Visual Studio 17 2022-generator.
  echo Waarschijnlijk gebruikt Windows de MSYS2/MinGW/Unix-versie van CMake.
  echo Installeer Windows x64 CMake in C:\Program Files\CMake en Visual Studio 2022
  echo met de workload 'Desktop development with C++'.
  echo Controleer met: where.exe cmake
  goto :failed
)

set "NUGET=nuget"
where nuget >nul 2>&1
if errorlevel 1 (
  if exist "C:\Tools\NuGet\nuget.exe" (
    set "NUGET=C:\Tools\NuGet\nuget.exe"
  ) else (
    echo ERROR: nuget.exe ontbreekt.
    echo Zet nuget.exe in PATH of in C:\Tools\NuGet\
    goto :failed
  )
)

if not exist "third_party\Microsoft.Web.WebView2" (
  if not exist "third_party" mkdir "third_party"
  echo WebView2 SDK ophalen via NuGet...
  "%NUGET%" install Microsoft.Web.WebView2 -OutputDirectory "third_party" -NonInteractive -ExcludeVersion
  if errorlevel 1 goto :failed
)

echo.
echo CMake configureren...
"%CMAKE_EXE%" -S . -B build -G "Visual Studio 17 2022" -A x64 -DJUCE_WEBVIEW2_PACKAGE_LOCATION="%CD%\third_party"
if errorlevel 1 goto :failed

echo.
echo Release compileren...
"%CMAKE_EXE%" --build build --config Release --parallel 4
if errorlevel 1 goto :failed

set "EXE=build\SquirrelStudioDesktop_artefacts\Release\Squirrel Studio Desktop.exe"
if not exist "%EXE%" (
  echo ERROR: Windows EXE niet gevonden op: %EXE%
  goto :failed
)

if not exist "..\dist" mkdir "..\dist"
copy /Y "%EXE%" "..\dist\Squirrel Studio Desktop.exe" >nul
if errorlevel 1 goto :failed

echo.
echo BUILD GESLAAGD!
echo Windows app: %CD%\..\dist\Squirrel Studio Desktop.exe
echo Geen GitHub Actions-minuten gebruikt.
pause
exit /b 0

:failed
echo.
echo BUILD MISLUKT - zie de foutmelding hierboven.
pause
exit /b 1
