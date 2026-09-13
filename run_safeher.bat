@echo off
echo ========================================================
echo Starting SafeHer Web Application...
echo ========================================================
cd /d "%~dp0"

start "" powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0server.ps1" -Port 3000

timeout /t 2 /nobreak >nul

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:3000"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://localhost:3000"
) else (
    start http://localhost:3000
)

echo SafeHer is running at http://localhost:3000
pause
