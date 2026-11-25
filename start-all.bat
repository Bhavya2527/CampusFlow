@echo off
REM ============================================================
REM  CampusFlow Master - start everything (Windows)
REM  Double-click this file, or run it from the master folder.
REM  Needs: Node.js 18+ and Python 3.10+ installed.
REM ============================================================
cd /d "%~dp0"

echo [1/4] Backend setup...
if not exist "04-backend\.env" copy "04-backend\.env.example" "04-backend\.env" >nul
python -m pip install -r 04-backend\requirements.txt

echo [2/4] Frontend (design system) setup...
if not exist "01-frontend\node_modules" (
  pushd 01-frontend
  call npm install
  popd
)

echo [3/4] Live mapping setup...
if not exist "03-live-mapping\ui\node_modules" (
  pushd 03-live-mapping\ui
  call npm install
  popd
)

echo [4/4] Starting all servers in separate windows...
start "CampusFix Backend  :8000" /d "04-backend"        cmd /k python main.py
start "Frontend           :3000" /d "01-frontend"       cmd /k npm run dev
start "Dashboard          :3001" /d "02-dashboard"      cmd /k python server.py
start "Live Mapping       :3002" /d "03-live-mapping\ui" cmd /k npm run dev

echo.
echo  Frontend     http://localhost:3000
echo  Dashboard    http://localhost:3001
echo  Live Mapping http://localhost:3002
echo  Backend API  http://localhost:8000/docs
echo.
pause
