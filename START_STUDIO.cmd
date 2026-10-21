@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ================================================
echo   SQUIRREL STUDIO 0.1 - LOKALE WEB SERVER
 echo ================================================
echo Open in Edge / Chrome: http://localhost:8765
 echo Sluit dit venster om de lokale server te stoppen.
echo.
start "" "http://localhost:8765"
py -3 -m http.server 8765
if errorlevel 1 (
  echo.
  echo Python launcher niet gevonden. Probeer python...
  python -m http.server 8765
)
pause