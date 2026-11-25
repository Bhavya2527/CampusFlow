# CampusFlow — Master Workspace

Chaaron projects ek jagah, series mein:

| # | Folder | Kya hai | Tech | Port |
|---|--------|---------|------|------|
| 1 | `01-frontend` | UI/UX design system, login/signup, showcase | React + TypeScript + Vite + Tailwind | **3000** |
| 2 | `02-dashboard` | Student ride booking dashboard (mock data + localStorage) | Vanilla JS (ES modules) + Python static server | **3001** |
| 3 | `03-live-mapping` | Live campus map, fleet simulation, driver/student views | React + TypeScript + Vite + Leaflet | **3002** |
| 4 | `04-backend` | CampusFix API: users, complaints, analytics, AI chat | FastAPI + SQLite + JWT | **8000** |

## Run (sab ek saath)

Requirements: Node.js 18+, Python 3.10+

- **Windows:** `start-all.bat` par double-click
- **macOS / Linux / Git Bash:** `bash start-all.sh`

Pehli baar dependencies install hongi (`npm install`, `pip install`), isme kuch minute lagte hain.

| App | URL |
|-----|-----|
| Frontend | http://localhost:3000 |
| Dashboard | http://localhost:3001 |
| Live Mapping | http://localhost:3002 |
| Backend API docs | http://localhost:8000/docs |

Backend demo logins: `admin@campusfix.edu / admin123`, `staff@campusfix.edu / staff123`, `student@campusfix.edu / student123`

## Ek zaroori baat (current state)

Ye projects abhi **ek dusre se connected nahi hain**:

- `01-frontend`, `02-dashboard` aur `03-live-mapping` koi API call nahi karte. Dashboard mock data aur browser localStorage use karta hai, live mapping apna simulation chalata hai.
- `04-backend` ek **complaint management** system hai (CampusFix). Isme ride booking ya live location ke endpoints nahi hain.

Isliye sab apne-apne chalte hain, aur combine karna sirf code ko ek jagah laana hai. Real integration (jaise dashboard ko backend se ride data dena) alag kaam hai.

## Is combine mein kya badla

- Sab frontends port 3000 pe the. Ab alag ports hain (3000 / 3001 / 3002) aur Vite `strictPort` hai, taaki port busy hone par chup-chaap badal na jaye.
- `node_modules`, `dist`, `.git`, `__pycache__`, `.env` aur `campusfix.db` copy nahi kiye. Backend pehli baar chalne par database aur demo data khud bana leta hai.
- `.env` start script `.env.example` se bana deta hai. Deploy karte waqt `SECRET_KEY` zaroor badlo.

## Deploy

Steps `docs/ANTIGRAVITY_PROMPT.md` mein hain.
