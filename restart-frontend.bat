@echo off
echo ========================================
echo Restarting Frontend with Clean Cache
echo ========================================
echo.

cd client

echo Stopping any running Next.js processes...
taskkill /F /IM node.exe 2>nul

echo Cleaning Next.js cache...
if exist ".next" (
    echo Deleting .next folder...
    rmdir /s /q .next
)

if exist "node_modules\.cache" (
    echo Deleting node_modules cache...
    rmdir /s /q node_modules\.cache
)

echo.
echo Starting fresh frontend server...
echo.

npm run dev
