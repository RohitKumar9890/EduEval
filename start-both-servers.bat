@echo off
echo ========================================
echo Starting BOTH Backend and Frontend
echo ========================================
echo.

echo This will open 2 new command windows:
echo   1. Backend Server (port 5000)
echo   2. Frontend Server (port 3000)
echo.
pause

echo Starting Backend Server...
start "EduEval Backend" cmd /k "cd server && npm run dev"

timeout /t 5

echo Starting Frontend Server...
start "EduEval Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000/api/health
echo Frontend: http://localhost:3000/auth/login
echo.
echo Wait for both to say "ready" or "running"
echo Then open: http://localhost:3000/auth/login
echo.
pause
