# CampusFlow — GitHub-ready repository

This package keeps the original project structure and separates the main parts:

- `01-frontend/` — main frontend application
- `02-dashboard/` — dashboard application
- `03-live-mapping/` — live mapping UI and shared mapping code
- `04-backend/` — backend/API
- `docs/` — documentation and supporting prompts
- Root files — project README, ignore rules, and start scripts

## Important setup notes

- Dependency folders (`node_modules`, Python virtual environments), Python bytecode caches, and `.git` history were excluded. Reinstall dependencies from the included package/requirements lock files after cloning.
- The original backend `.env` file was intentionally not copied because it may contain private credentials or API keys. Use the included `.env.example` and add your own values locally. Never commit real secrets to GitHub.
- Existing build output such as `dist/` is retained if it was present in the source archive.
- The files are extracted as provided; this packaging does not guarantee that every component is configured to run together without environment-specific setup.

## Upload to GitHub

Extract this ZIP, open the extracted `CampusFlow-GitHub-Ready` folder, and upload/push its contents as the repository root (so `01-frontend`, `02-dashboard`, `03-live-mapping`, `04-backend`, `docs`, and the root files appear directly in GitHub).
