@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ================================================
echo   SQUIRREL STUDIO - LOCAL WEB SERVER
echo ================================================
echo Open in Microsoft Edge or Chrome: http://localhost:8765
echo Close this window to stop the local server.
echo.
start "" "http://localhost:8765"
py -3 -m http.server 8765
if errorlevel 1 (
  echo.
  echo Python launcher not found. Trying python...
  python -m http.server 8765
)
pause
