#!/usr/bin/env bash
# CampusFlow Master - start everything (macOS / Linux / Git Bash)
# Needs: Node.js 18+ and Python 3.10+
set -e
cd "$(dirname "$0")"

[ -f 04-backend/.env ] || cp 04-backend/.env.example 04-backend/.env
python3 -m pip install -r 04-backend/requirements.txt
[ -d 01-frontend/node_modules ] || (cd 01-frontend && npm install)
[ -d 03-live-mapping/ui/node_modules ] || (cd 03-live-mapping/ui && npm install)

pids=()
trap 'kill "${pids[@]}" 2>/dev/null' EXIT INT TERM

(cd 04-backend && python3 main.py) & pids+=($!)
(cd 01-frontend && npm run dev) & pids+=($!)
(cd 02-dashboard && python3 server.py) & pids+=($!)
(cd 03-live-mapping/ui && npm run dev) & pids+=($!)

echo
echo " Frontend     http://localhost:3000"
echo " Dashboard    http://localhost:3001"
echo " Live Mapping http://localhost:3002"
echo " Backend API  http://localhost:8000/docs"
echo " (Ctrl+C stops everything)"
wait
