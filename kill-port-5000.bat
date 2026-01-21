@echo off
echo ========================================
echo Killing Process on Port 5000
echo ========================================
echo.

echo Finding process using port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Found process ID: %%a
    echo Killing process...
    taskkill /F /PID %%a
    echo.
)

echo Done! Port 5000 should now be free.
echo You can now run: start-backend.bat
echo.
pause
