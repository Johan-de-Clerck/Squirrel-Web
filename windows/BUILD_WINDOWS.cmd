@echo off
setlocal
cd /d "%~dp0"
echo Squirrel Studio Desktop 0.1.1 - Windows x64 build
if exist "..\index.html" (
  if not exist web mkdir web
  copy /Y "..\index.html" "web\index.html" >nul
)
if not exist "web\index.html" (echo web\index.html ontbreekt & pause & exit /b 1)
where cmake >nul 2>&1 || (echo CMake ontbreekt. Installeer CMake 3.24+ & pause & exit /b 1)
where nuget >nul 2>&1 || (echo NuGet CLI ontbreekt. Installeer nuget.exe of build via GitHub Actions. & pause & exit /b 1)
if not exist third_party mkdir third_party
nuget install Microsoft.Web.WebView2 -OutputDirectory third_party -NonInteractive -ExcludeVersion || exit /b 1
cmake -S . -B build -G "Visual Studio 17 2022" -A x64 -DJUCE_WEBVIEW2_PACKAGE_LOCATION="%CD%\third_party" || exit /b 1
cmake --build build --config Release --parallel 4 || exit /b 1
echo.
echo EXE: build\SquirrelStudioDesktop_artefacts\Release\SquirrelStudioDesktop.exe
pause