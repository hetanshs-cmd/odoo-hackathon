# TransitOps — Fleet Operations Management Platform

TransitOps is a comprehensive fleet operations management platform designed to streamline vehicle tracking, driver allocation, trip scheduling, dispatching, maintenance records, and analytics.

---

## 1. Problem Statement
Fleet management organizations face severe inefficiencies when coordinating vehicles, verifying driver licence eligibility, scheduling maintenance, and tracking logs manually. TransitOps provides a real-time, role-based dashboard and API contract system that ensures high operational safety, prevents illegal double-scheduling, and manages active maintenance windows automatically.

---

## 2. Team & Ownership
| Role | Responsibility / Module | Owner |
|------|-------------------------|-------|
| **Database Owner** | Prisma schema, client integration, seed compatibility, DB validation | Teammate A |
| **Frontend Owner** | Frontend UI pages, components, responsive views, API prep | Teammate B |
| **Backend/API Owner** | Modular API development, service logic, integration verification | Hetansh |

---

## 3. Tech Stack
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Axios
* **Backend:** Node.js, Express, TypeScript, Zod validation, Morgan request logging
* **Database:** PostgreSQL & Prisma ORM
* **Auth:** JWT authentication (Access + Refresh tokens) & bcrypt password hashing
* **Security:** Helmet, CORS whitelisting

---

## 4. Architecture
The backend is structured under a strict 5-layer design:
```
Routes → Controller → Service → Repository → Database
              ↓
         Validator (Zod schemas)
```
For detailed architecture information, see [docs/architecture.md](docs/architecture.md).

For the proposed API contract, see [docs/api.md](docs/api.md).

For the current roadmap and milestones, see [docs/development-roadmap.md](docs/development-roadmap.md).

---

## 5. Local Setup & Verification

### Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Validate and generate Prisma client (once database branch is merged)
npx prisma validate
npx prisma generate

# Run development server
npm run dev

# Run test suite
npm test
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

---

## 6. Project Directory Structure
```
odoo-hackathon/
├── backend/                  # REST API Layer
│   ├── src/
│   │   ├── config/           # App environment configuration
│   │   ├── controllers/      # Health check and global controllers
│   │   ├── middleware/       # Error handling, Auth guards, logging
│   │   ├── modules/          # Domain-specific modules (auth, vehicles, etc.)
│   │   └── routes/           # Central API router mounting
│   ├── prisma/               # Database schema & migrations
│   └── tests/                # Integration test suites
├── docs/                     # Architecture, DB Schema, API contract, Roadmap
├── frontend/                 # React UI Layer
│   └── src/
│       ├── components/       # Shared UI components
│       ├── pages/            # View pages
│       ├── routes/           # Protected React routing
│       └── services/         # Axios API clients
└── .github/                  # PR & Issue templates
```
