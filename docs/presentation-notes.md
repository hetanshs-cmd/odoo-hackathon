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
