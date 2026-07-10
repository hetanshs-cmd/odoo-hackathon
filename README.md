# [Project Name] — Odoo Hackathon

## Problem Statement
> Paste the chosen problem statement here.

## Team
| Name | Role | GitHub |
|------|------|--------|
| Hetansh | Backend / DB | @hetansh |
| — | Frontend | — |
| — | Frontend | — |
| — | Backend | — |
| — | ML / Integrations (if applicable) | — |

## Tech Stack
- **Frontend:** TBD (React / Next.js)
- **Backend:** TBD (Node+Express / Django)
- **Database:** PostgreSQL (relational, self-managed — no Firebase/Supabase as primary DB)
- **Auth:** TBD (JWT / session-based)

## Architecture
```
Frontend (UI) → Backend API (business logic) → PostgreSQL (data)
```
See `docs/architecture.md` and `docs/db-schema.md` for details.

## Local Setup
```bash
git clone <repo-url>
cd odoo-hackathon

# Backend
cd backend
cp .env.example .env   # fill in real values, never commit .env
# install deps per chosen framework
# run migrations
# start server

# Frontend
cd ../frontend
# install deps
# start dev server
```

## Environment Variables
All secrets go in `.env` files (never committed — see `.gitignore`).
Copy `.env.example` in each folder and fill in real values locally.

## Branch Strategy
See `CONTRIBUTING.md`.

## Folder Structure
```
odoo-hackathon/
├── frontend/              # UI layer
├── backend/
│   ├── modules/
│   │   ├── auth/          # authentication & authorization
│   │   ├── users/         # user management
│   │   └── core/          # core business logic for the problem statement
│   ├── config/            # env, db connection config
│   └── tests/
├── docs/                  # architecture, db schema, API docs
└── .github/                # PR & issue templates
```
