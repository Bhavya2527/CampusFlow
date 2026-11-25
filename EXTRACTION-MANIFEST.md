# Extraction manifest

The original archive was scanned and extracted into the GitHub-ready package.

## Included files by section
- `.gitignore/` (or root section `.gitignore`): 1 files
- `01-frontend/` (or root section `01-frontend`): 41 files
- `02-dashboard/` (or root section `02-dashboard`): 29 files
- `03-live-mapping/` (or root section `03-live-mapping`): 23 files
- `04-backend/` (or root section `04-backend`): 16 files
- `docs/` (or root section `docs`): 1 files
- `README.md/` (or root section `README.md`): 1 files
- `start-all.bat/` (or root section `start-all.bat`): 1 files
- `start-all.sh/` (or root section `start-all.sh`): 1 files

## Intentionally excluded
- `node_modules/`: 16163 files
- Python virtual environments (`venv/`): 2851 files
- Python cache folders (`__pycache__/`): 12 files
- `.env`: 1 file (may contain secrets; `.env.example` is included)

These are generated dependencies, caches, or local secrets—not application source files. Install dependencies after cloning and create your own local `.env` from `.env.example`.
