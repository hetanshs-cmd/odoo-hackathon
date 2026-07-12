# Architecture — TransitOps Fleet Operations Platform

## System Overview

TransitOps is a fleet operations management platform built on a strict 5-layer
architecture. Each layer has a single responsibility and communicates only with
adjacent layers through defined interfaces.

## Layer Diagram

```
┌──────────────────────────────────────────────────────────┐
│                   React/Next Frontend                      │
│  (UI only — calls backend via JSON REST API)              │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS / JSON
                         ▼
┌──────────────────────────────────────────────────────────┐
│              Express REST API  (backend/src/)              │
│                                                           │
│  src/routes/        — mount module routers at /api/*      │
│  src/modules/*/     — per-module route files              │
│  src/middleware/    — auth, error handler, 404, logger    │
│  src/controllers/   — parse req, call service, format res │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  Service Layer                             │
│  src/services/ (and src/modules/*/service.ts per module)  │
│  All business logic. No HTTP objects (req/res).           │
│  Throws AppError for known failures.                      │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                 Repository Layer                           │
│  src/modules/*/repository.ts per module                   │
│  All DB queries via Prisma ORM. No business logic.        │
│  Parameterized queries only. No raw SQL interpolation.    │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                       │
│  Schema owned by feature/database-schema branch.          │
│  Accessed via Prisma Client after that branch merges.     │
└──────────────────────────────────────────────────────────┘
```

## Dependency Direction (NEVER reverse these)

```
Routes → Controller → Service → Repository → Database
              ↓
         Validator (Zod schemas called by Controller)
```

## Sacred Layer Boundaries

| Layer       | Responsibility                              | Forbidden                      |
|-------------|---------------------------------------------|--------------------------------|
| Route       | HTTP verb + path, middleware, delegate       | Business logic, DB calls       |
| Controller  | Parse req, validate, call service, respond  | SQL, business rules            |
| Service     | Business logic, orchestration               | req/res objects, raw SQL       |
| Repository  | Prisma queries only                         | Business logic, HTTP           |
| Validator   | Zod schemas — input validation              | Side effects                   |

## Module Structure (per feature)

```
src/modules/<module>/
  ├── <module>.routes.ts      # HTTP route definitions, middleware attachment
  ├── <module>.controller.ts  # Request parsing + response building
  ├── <module>.service.ts     # All business logic
  ├── <module>.repository.ts  # All Prisma queries
  └── <module>.validator.ts   # Zod input schemas
```

## Registered Modules

| Mount Path         | Module Directory           | Status         |
|--------------------|----------------------------|----------------|
| `/api/health`      | controllers/health         | ✅ Implemented |
| `/api/auth`        | modules/auth               | 🔲 Placeholder |
| `/api/dashboard`   | modules/dashboard          | 🔲 Placeholder |
| `/api/vehicles`    | modules/vehicles           | 🔲 Placeholder |
| `/api/drivers`     | modules/drivers            | 🔲 Placeholder |
| `/api/trips`       | modules/trips              | 🔲 Placeholder |
| `/api/maintenance` | modules/maintenance        | 🔲 Placeholder |
| `/api/fuel-logs`   | modules/fuel-logs          | 🔲 Placeholder |
| `/api/expenses`    | modules/expenses           | 🔲 Placeholder |
| `/api/reports`     | modules/reports            | 🔲 Placeholder |
| `/api/settings`    | modules/settings           | 🔲 Placeholder |

## Security Architecture

- **Helmet** — sets HTTP security headers on every response
- **CORS** — whitelist via `FRONTEND_URL` env var (comma-separated for multi-origin)
- **JWT** — access token (15m) + refresh token (7d) pattern; stored in httpOnly cookies
- **bcrypt** — password hashing with minimum 12 rounds (configurable via `BCRYPT_ROUNDS`)
- **Zod env validation** — server refuses to start if required env vars are missing
- **asyncHandler** — all async routes wrapped; uncaught errors forwarded to global handler
- **AppError** — typed operational errors; raw stack traces never sent to client

## Technology Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Runtime     | Node.js ≥ 20                        |
| Framework   | Express 4                           |
| Language    | TypeScript (strict mode)            |
| Database    | PostgreSQL                          |
| ORM         | Prisma (wired in after DB branch)   |
| Validation  | Zod                                 |
| Auth        | JWT (jsonwebtoken) + bcrypt         |
| Logging     | Morgan                              |
| Security    | Helmet, CORS                        |
| Testing     | Jest + Supertest                    |
| Linting     | ESLint + Prettier                   |
| Dev server  | ts-node-dev                         |
