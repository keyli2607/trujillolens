@echo off
cd /d "%~dp0"
title Servidor Publico Lens Group Trujillo
echo ========================================================
echo   Iniciando Servidor Local y Tunel Publico Cloudflare
echo ========================================================
echo.
start "Servidor Local" cmd /k "node server.js"
timeout /t 3 >nul
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8080
pause