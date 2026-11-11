@echo off
setlocal enabledelayedexpansion

echo =========================================================================
echo       USCalcHub Environment Setup & Antigravity Restore Script
echo =========================================================================
echo.

:: 1. Check Git
echo [1/5] Checking Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH!
    echo Please install Git from: https://git-scm.com/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%g in ('git --version') do echo [OK] %%g
)

:: 2. Check Node.js & NPM
echo.
echo [2/5] Checking Node.js and NPM...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js LTS from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%n in ('node -v') do echo [OK] Node.js Version: %%n
    for /f "tokens=*" %%m in ('npm -v') do echo [OK] NPM Version: %%m
)

:: 3. Check Python
echo.
echo [3/5] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Python is not installed or not in PATH.
    echo Python scripts like generator utilities may require Python 3.10+.
) else (
    for /f "tokens=*" %%p in ('python --version') do echo [OK] %%p
)

:: 4. Restore Antigravity Chats and Config
echo.
echo [4/5] Checking Antigravity Data Restoration...
set "TARGET_GEMINI=%USERPROFILE%\.gemini"
set "BACKUP_DIR=D:\Website Development\Antigravity_Backup"

if exist "%BACKUP_DIR%" (
    if not exist "%TARGET_GEMINI%\antigravity\conversations\934bafbd-6fa0-45e8-8990-c1ad9e4379be.pb" (
        echo Restoring Antigravity Chat History and Settings from Backup...
        if not exist "%TARGET_GEMINI%\antigravity" mkdir "%TARGET_GEMINI%\antigravity"
        if not exist "%TARGET_GEMINI%\config" mkdir "%TARGET_GEMINI%\config"
        
        xcopy "%BACKUP_DIR%\conversations" "%TARGET_GEMINI%\antigravity\conversations\" /E /I /Y /Q >nul
        xcopy "%BACKUP_DIR%\brain" "%TARGET_GEMINI%\antigravity\brain\" /E /I /Y /Q >nul
        xcopy "%BACKUP_DIR%\chapter_titles" "%TARGET_GEMINI%\antigravity\chapter_titles\" /E /I /Y /Q >nul
        xcopy "%BACKUP_DIR%\config" "%TARGET_GEMINI%\config\" /E /I /Y /Q >nul
        
        copy "%BACKUP_DIR%\*.db*" "%TARGET_GEMINI%\antigravity\" /Y >nul 2>&1
        copy "%BACKUP_DIR%\*.pb*" "%TARGET_GEMINI%\antigravity\" /Y >nul 2>&1
        copy "%BACKUP_DIR%\*.pbtxt*" "%TARGET_GEMINI%\antigravity\" /Y >nul 2>&1
        copy "%BACKUP_DIR%\*.txt*" "%TARGET_GEMINI%\antigravity\" /Y >nul 2>&1
        echo [OK] Antigravity chat history and settings restored to %TARGET_GEMINI%!
    ) else (
        echo [OK] Antigravity data already present in %TARGET_GEMINI%.
    )
) else (
    echo [INFO] Backup folder %BACKUP_DIR% not found. Skipping auto-restore.
)

:: 5. Install NPM Dependencies
echo.
echo [5/5] Installing NPM Dependencies...
cd /d "D:\Website Development\uscalchub"
if not exist "node_modules" (
    echo Installing root dependencies (Tailwind CLI)...
    call npm install
) else (
    echo [OK] Root node_modules already exists.
)

if exist "pseo-builder\package.json" (
    cd /d "D:\Website Development\uscalchub\pseo-builder"
    if not exist "node_modules" (
        echo Installing pseo-builder dependencies (Next.js, Chart.js, etc.)...
        call npm install
    ) else (
        echo [OK] pseo-builder node_modules already exists.
    )
    cd /d "D:\Website Development\uscalchub"
)

echo.
echo =========================================================================
echo       SETUP COMPLETE! Everything is ready.
echo       You can now open Antigravity and work directly from:
echo       D:\Website Development\uscalchub
echo =========================================================================
echo.
pause
