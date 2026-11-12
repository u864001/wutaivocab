@echo off
title WutaiVocab Local Preview
cd /d "%~dp0"

echo Starting WutaiVocab local preview...
echo Keep this window open while viewing the website.
echo Close this window to stop the preview server.
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://127.0.0.1:5173/?view=mcq-exam'"
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort

echo.
echo The preview server has stopped or could not start.
pause
