@echo off
echo Starting Training Center Local Development Environment...
echo.

echo Setting up environment files...
if not exist "server\.env" (
    copy "server-env-template.txt" "server\.env"
    echo Created server .env file
)

if not exist "client\.env.local" (
    copy "client-env-template.txt" "client\.env.local"
    echo Created client .env.local file
)

echo.
echo Starting MongoDB (make sure MongoDB is installed and running)...
echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start "Frontend Server" cmd /k "cd client && npm run serve"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:8080
echo.
echo Press any key to exit this window...
pause > nul
