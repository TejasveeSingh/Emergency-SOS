@echo off
echo ========================================================
echo Pushing SafeHer to https://github.com/TejasveeSingh/Emergency-SOS.git
echo ========================================================
cd /d "%~dp0"
"C:\Program Files\Git\cmd\git.exe" push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Checking if remote has existing files (pulling with rebase)...
    "C:\Program Files\Git\cmd\git.exe" pull origin main --rebase --allow-unrelated-histories
    echo Pushing changes...
    "C:\Program Files\Git\cmd\git.exe" push -u origin main
)
echo.
echo Done!
pause
