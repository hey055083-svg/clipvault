@echo off
REM ClipVault Quick Setup Script for Windows

title ClipVault - Production Setup Checker
echo.
echo 🎬 ClipVault - Production Setup Checker
echo ======================================
echo.

REM Check Node.js
echo 1️⃣  Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo    ✅ Node.js !NODE_VERSION! installed
) else (
    echo    ❌ Node.js not found
    echo    ^→ Install from https://nodejs.org/
    exit /b 1
)

REM Check npm
echo.
echo 2️⃣  Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo    ✅ npm !NPM_VERSION! installed
) else (
    echo    ❌ npm not found
    exit /b 1
)

REM Check Python
echo.
echo 3️⃣  Checking Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo    ✅ Python !PYTHON_VERSION! installed
) else (
    echo    ⚠️  Python not found
    echo    ^→ Install from https://www.python.org/downloads/
    echo    ^→ Check "Add Python to PATH" during installation
    echo    ^→ App will still work with fallback services
)

REM Check yt-dlp
echo.
echo 4️⃣  Checking yt-dlp...
yt-dlp --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('yt-dlp --version') do set YTDLP_VERSION=%%i
    echo    ✅ yt-dlp !YTDLP_VERSION! installed
) else (
    echo    ⚠️  yt-dlp not installed
    echo    ^→ Optional for direct downloads
    echo    ^→ Install with: pip install yt-dlp
)

REM Check dependencies
echo.
echo 5️⃣  Checking npm dependencies...
if exist "node_modules" (
    echo    ✅ Dependencies installed
) else (
    echo    ⚠️  Dependencies not installed
    echo    ^→ Run: npm install
)

REM Check build
echo.
echo 6️⃣  Checking build...
if exist "dist" (
    echo    ✅ Production build ready
) else (
    echo    ⚠️  Build not found
    echo    ^→ Run: npm run build
)

echo.
echo ======================================
echo ✅ Setup Check Complete!
echo.
echo Next Steps:
echo   1. npm run dev        # Start frontend (http://localhost:3007)
echo   2. npm run api        # Start backend (http://localhost:5000)
echo   3. Open browser and test
echo.
echo For production deployment:
echo   ^→ Read DEPLOYMENT.md for Netlify + Railway setup
echo.
pause
