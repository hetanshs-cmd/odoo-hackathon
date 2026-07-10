# Architecture

## Layers
1. **Frontend** — UI, calls backend API only, no direct DB access
2. **Backend API layer** — routes, request validation, calls business logic
3. **Business logic layer** — core rules for the problem statement, framework-agnostic where possible
4. **Data access layer** — DB queries/ORM models, isolated from business logic
5. **Database** — PostgreSQL
6. **Auth & security layer** — middleware for authentication/authorization, applied across relevant routes

## Why this separation?
- Matches Odoo's modularity/scalability criteria
- Each layer can be tested independently
- Team members can work on different layers without blocking each other

## Diagram
```
[React/Next Frontend]
        │ HTTPS (JSON)
        ▼
[Backend API Layer] ── validates requests
        │
        ▼
[Business Logic Layer] ── core rules
        │
        ▼
[Data Access Layer] ── ORM / queries
        │
        ▼
[PostgreSQL Database]
```
