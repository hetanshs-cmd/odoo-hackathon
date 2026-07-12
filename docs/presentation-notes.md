# Presentation Notes — Odoo Hackathon

This file is updated after every completed feature by Antigravity.
Use it to prepare for the live demo and Q&A with Odoo evaluators.

---

## How to Use This File

After each feature is merged, there will be a new section below.
Each section contains:
- What problem the feature solves
- How to demo it (step-by-step)
- Architecture highlights
- Database design decisions
- Security measures implemented
- Likely reviewer questions and prepared answers

---

## Project Overview

**Project Name**: TBD (fill in after problem statement is selected)

**Problem Statement**:
> [Paste the chosen Odoo problem statement here]

**Target Users**:
- [Primary user type and their pain points]
- [Secondary user type and their pain points]

**Core Value Proposition**:
> [One sentence: what does this project do better than the alternative?]

**Tech Stack**:
- Frontend: TBD
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT

---

## Architecture Summary (for the presentation)

```
[React Frontend]
      |
      | HTTPS/JSON
      v
[Express REST API]  ← validates all input, enforces auth
      |
      v
[Service Layer]  ← all business logic lives here
      |
      v
[Repository Layer]  ← all DB queries, parameterized only
      |
      v
[PostgreSQL Database]  ← normalized, indexed, constrained
```

**Why this architecture?**
- Each layer is independently testable
- Team members can work in parallel without stepping on each other
- Business logic can be reused (e.g., same service called by REST + future WebSocket)
- Clear separation makes code review straightforward

---

<!-- Completed features will be appended below by Antigravity after each task -->

---

## Feature: Backend Foundation (TransitOps API)

### Problem Solved
The team needs a shared, consistent backend skeleton so that 10 feature modules
can be developed in parallel without conflicts, inconsistent response shapes, or
unhandled async errors. This foundation provides the architecture contract every
subsequent module inherits.

### How It Works (for the demo)
1. `npm install` — installs all dependencies
2. Copy `.env.example` → `.env`, fill in values
3. `npm run dev` — server starts on port 5000
4. `GET http://localhost:5000/api/health` → `{ success: true, message: "TransitOps API is running" }`
5. Hit any placeholder route (e.g., `/api/vehicles`) → `{ success: false, error: "NOT_IMPLEMENTED", ... }`
6. Hit a non-existent path → `{ success: false, error: "NOT_FOUND", ... }`

### Architecture Highlights
- **Factory pattern** in `app.ts`: `createApp()` returns an Express instance without
  binding a port — enables Supertest integration tests without port conflicts
- **Zod env validation** in `config/env.ts`: server refuses to start with a clear
  human-readable error listing every missing variable — eliminates `undefined` runtime bugs
- **AppError + asyncHandler**: every service layer error is typed with an `ErrorCode`
  and HTTP status; the global handler converts it to the envelope — no raw stacks to client
- **Dependency direction enforced**: Routes → Controller → Service → Repository
  (no circular imports, no HTTP objects below the controller layer)
- **10 placeholder modules registered**: adding a feature only requires implementing
  the files in `src/modules/<module>/` — the routing infrastructure is already wired

### Security Measures
- Helmet.js: `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, CSP headers on every response
- CORS: whitelists only `FRONTEND_URL` (comma-separated for multi-origin); credentials enabled for httpOnly refresh cookie support
- No secrets in code: all sensitive values sourced from `process.env`, validated by Zod
- bcrypt rounds: configurable (default 12, AGENTS.md minimum is 12)
- JWT: dual-secret pattern (access + refresh), short expiry config documented in `.env.example`

### Challenges & How We Solved Them
- **Windows path-separator bug in @typescript-eslint**: `tests\file.ts` backslash
  path doesn't match `tests/**/*` glob in tsconfig. Solution: excluded `tests/` from
  the ESLint lint command (type-safety for tests is provided by ts-jest during `npm test`)
- **`require-await` lint error on placeholder routes**: async handlers that only `throw`
  triggered the rule. Fixed by using synchronous `next(new AppError(...))` — semantically
  correct since these handlers are truly synchronous

### Why Not Alternative Approach X?

**Q: Why asyncHandler instead of express-async-errors?**
A: `express-async-errors` monkey-patches Express internals — a black box. `asyncHandler`
is a 5-line explicit wrapper that a junior can read, explain, and debug. Every senior
Odoo evaluator will prefer explicit over magical.

**Q: Why Zod for env validation instead of dotenv-safe?**
A: Zod gives typed output (numbers are parsed, enums are validated), not just string presence checks.
The exported `env` object has TypeScript autocomplete — no `process.env.PORT as number` casts anywhere in the codebase.

**Q: Why factory pattern for Express app?**
A: `createApp()` separates HTTP server lifecycle (port binding) from application setup. This is
the textbook pattern for testable Express apps — Supertest documentation recommends it explicitly.

### Likely Reviewer Questions
- Q: Where is the database connection?
  A: Owned by `feature/database-schema`. `DATABASE_URL` is already in `.env.example` and marked
  optional in `env.ts`. Once that branch merges, Prisma Client is imported in repository files only.
- Q: How does a new developer add a module?
  A: Create `src/modules/<name>/<name>.routes.ts`, add 2 lines to `src/routes/index.ts`. Done.
- Q: What happens if an env var is missing in production?
  A: `config/env.ts` calls `process.exit(1)` with a formatted error listing every failing field.
  The server never starts in a broken state.
- Q: How does this scale to 10,000 users?
  Rate limiting (express-rate-limit) will be added to auth endpoints in the feature branch.

---

## Feature: Frontend Foundation (TransitOps UI) & Auth Module

### Problem Solved
The team needs a robust, scalable React frontend to build all enterprise fleet management views upon. It requires a unified authentication flow with 2-step verification and strict role-based access checks, while also providing standard routing, layout wrappers, and robust API handlers that intercept 401s and token expirations.

### How It Works (for the demo)
1. User hits `/` (Dashboard) and is redirected to `/login` via `ProtectedRoute`.
2. User enters credentials; UI handles form validation and submits to the backend.
3. Upon success, user goes to `/login/verify` where they input a 6-digit OTP (paste support enabled).
4. `AuthContext` consumes the JWT and user data, redirects user back to `/dashboard`.
5. The `DashboardLayout` renders the Sidebar and Top Navbar, showcasing the responsive application shell. 
6. User can navigate to `Vehicles`, `Drivers`, `Trips`, etc., viewing placeholder layouts ready for integration.

### Architecture Highlights
- **Vite + React (TypeScript):** Modern, fast compilation with strict TS adherence (`verbatimModuleSyntax`).
- **TanStack Query + Axios Interceptors:** Ensures robust token management and data-fetching hooks capability.
- **Context API for Auth:** Centralizes user state, avoiding prop-drilling.
- **React Hook Form + Zod:** Strict schema-based form validation eliminating invalid payload dispatching.
- **Tailwind + shadcn/ui:** Extensible enterprise-level UI foundations without bloat. Custom TransitOps themes integrated.

### Security Measures
- **No tokens in code:** All API requests leverage dynamic headers supplied by `AuthContext` state/localStorage.
- **Strict typing:** Total interface-level type-checking between UI layers and API layers.
- **Form sanitization:** Input elements use native validation rules enhanced by Zod's parsing constraints (e.g., password regex).
- **ProtectedRoute Guard:** Pre-render redirection logic prevents flashing of protected pages to unauthenticated users.

### Challenges & How We Solved Them
- **TypeScript Module Resolutions:** Fixing `verbatimModuleSyntax` errors enforced by TS config required converting interface imports to `import type {...}` preventing runtime bloat and strict compliance.
- **Tailwind CSS versions:** Shadcn/ui latest relies heavily on standard Tailwind v3 behavior, requiring manual configuration of `tailwind.config.js` over automated v4 injection which caused parsing conflicts in the initial setup.

### Likely Reviewer Questions
- Q: Why use `localStorage` over `httpOnly` cookies for JWT?
  A: For this hackathon scope, it simplifies frontend data management and allows rapid development. We plan to migrate to `httpOnly` cookies in production for strict XSS prevention, and the transition only requires modifying the `api.ts` interceptors to include credentials, keeping the rest of the application unchanged.
- Q: Why Framer Motion instead of standard CSS transitions?
  A: Framer Motion provides programmatic layout animations (like the error shake on invalid OTP) which drastically improves the premium feel of the platform with very few lines of code.
- Q: How does the app scale if we add 20 more feature pages?
  A: The `DashboardLayout` encapsulates navigation dynamically, and React Router's nested structure means new modules can be plugged in by simply extending `routes/index.tsx` and adding a placeholder component.

