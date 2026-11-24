@echo off
cd /d "%~dp0"
title Servidor y Tunel Publico - Lens Group Trujillo

echo ========================================================
echo   LENS GROUP TRUJILLO - SALIDA PUBLICA A INTERNET
echo ========================================================
echo.

echo 1. Iniciando aplicacion Next.js en puerto 3000...
cd nextjs-app
start "TrujilloLens - Servidor Local" cmd /k "npm run start"
cd ..

echo 2. Esperando a que el servidor este listo...
timeout /t 4 >nul

echo 3. Creando Tunel Seguro Cloudflare (Salida a Internet)...
echo.
echo ========================================================
echo   Tu enlace publico aparecera a continuacion:
echo ========================================================
echo.
"%~dp0cloudflared.exe" tunnel --url http://localhost:3000

pause
