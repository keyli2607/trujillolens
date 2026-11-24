@echo off
chcp 65001 >nul
title TrujilloLens - Sistema de Gestión Óptica
color 0A
cls

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║          TRUJILLOLENS - LENS GROUP TRUJILLO          ║
echo  ║           Sistema Integral de Gestión Óptica         ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
echo  Iniciando sistema... Por favor espere.
echo.

cd /d %~dp0

REM ─── Verificar Node.js ───────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js no está instalado.
    echo  Descárgalo desde: https://nodejs.org
    pause
    exit /b
)

REM ─── Verificar cloudflared.exe ───────────────────────────
if not exist "cloudflared.exe" (
    echo  [ERROR] cloudflared.exe no encontrado en %~dp0
    pause
    exit /b
)

REM ─── Instalar dependencias si faltan ─────────────────────
if not exist "nextjs-app\node_modules" (
    echo  [1/3] Instalando dependencias de Next.js...
    cd nextjs-app
    call npm install --silent
    cd ..
    echo  Dependencias instaladas.
    echo.
)

REM ─── Build de Next.js (solo si no existe .next) ──────────
if not exist "nextjs-app\.next" (
    echo  [2/3] Compilando la aplicación Next.js...
    echo  (Esto puede tardar 1-2 minutos la primera vez)
    cd nextjs-app
    call npm run build
    cd ..
    echo.
    echo  Compilación completada.
    echo.
) else (
    echo  [2/3] Compilación previa encontrada. Usando cache.
)

REM ─── Iniciar Next.js en segundo plano ────────────────────
echo  [3/3] Iniciando servidor Next.js en puerto 3000...
cd nextjs-app
start "TrujilloLens-Server" /min cmd /c "npm run start"
cd ..

REM ─── Esperar a que el servidor esté listo ────────────────
echo.
echo  Esperando que el servidor arranque...
timeout /t 5 /nobreak >nul

REM ─── Iniciar túnel Cloudflare ────────────────────────────
echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║   INICIANDO TÚNEL CLOUDFLARE - ACCESO A INTERNET    ║
echo  ║                                                      ║
echo  ║  Busca la línea que dice:                           ║
echo  ║  "Your quick Tunnel has been created"               ║
echo  ║  y la URL tipo: https://xxxx.trycloudflare.com      ║
echo  ║                                                      ║
echo  ║  Copia esa URL y ábrela en tu navegador             ║
echo  ║  o compártela con tus clientes.                     ║
echo  ║                                                      ║
echo  ║  Para cerrar el túnel: presiona Ctrl+C             ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

cloudflared.exe tunnel --url http://localhost:3000

REM ─── Al cerrar el túnel ───────────────────────────────────
echo.
echo  Túnel cerrado. El servidor Next.js sigue corriendo.
echo  Para cerrarlo todo, cierra también la ventana "TrujilloLens-Server".
echo.
pause
