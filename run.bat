@echo off
echo Starting VentureLens AI Local Servers (No Docker Mode)...

:: Start backend in a new window
echo Starting FastAPI Backend...
start "VentureLens Backend" cmd /k "cd backend && venv\Scripts\activate.bat && pip install -r requirements.txt && uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: Start frontend in a new window
echo Starting Next.js Frontend...
start "VentureLens Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are launching in separate windows.
pause
