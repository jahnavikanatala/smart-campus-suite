@echo off
title EduPulse 360 - Smart Campus Suite Launcher
echo ===================================================
echo     Launching EduPulse 360 Presentation Suite...
echo ===================================================
echo.

:: Open default browser to localhost:8080 in 2 seconds
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8080"

:: Start Python HTTP Server
echo Starting local web server on port 8080...
echo Keep this window open during your presentation.
echo Press Ctrl+C to stop the server when finished.
echo.
python -m http.server 8080

pause
