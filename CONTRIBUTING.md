# Contributing Guide (Team of 5)

Odoo explicitly evaluates **shared Git participation** — not one person pushing everything.
Every member must have commits, branches, and at least one PR.

## Branch Strategy

```
main                → always stable, demo-ready
 └── dev            → integration branch, merge here first
      ├── feature/auth-login          (person A)
      ├── feature/user-dashboard      (person B)
      ├── feature/db-schema           (person C)
      ├── feature/core-module-x       (person D)
      └── feature/frontend-ui         (person E)
```

- Never push directly to `main`.
- Branch off `dev` for every feature: `git checkout -b feature/<short-name>`.
- Open a PR from `feature/*` → `dev`. At least one teammate reviews before merging.
- Merge `dev` → `main` only when a feature set is tested and stable (e.g., before each demo checkpoint).

## Commit Message Convention

```
<type>: <short description>

feat: add JWT authentication middleware
fix: handle empty email field on signup form
refactor: split db.js into separate connection module
docs: add API endpoint list to README
test: add unit tests for user validation
chore: update .gitignore
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`

- One logical change per commit.
- No commits like "final fix", "update", "asdf" — reviewers check this.

## Pull Request Rules

1. Fill out `.github/PULL_REQUEST_TEMPLATE.md` — what changed, why, how tested.
2. At least 1 reviewer approves before merge.
3. Resolve conflicts locally before requesting review:
   ```bash
   git checkout feature/your-branch
   git fetch origin
   git merge origin/dev
   # resolve conflicts, then commit
   ```
4. Delete the branch after merge to keep things clean.

## Daily Workflow

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-task
# ... work ...
git add .
git commit -m "feat: your change"
git push origin feature/your-task
# open PR on GitHub: feature/your-task → dev
```

## Division of Ownership (fill in real names)

| Module | Owner | Branch prefix |
|--------|-------|----------------|
| Auth & Authorization | ? | `feature/auth-*` |
| Database schema & migrations | ? | `feature/db-*` |
| Core business logic (problem-specific) | ? | `feature/core-*` |
| Frontend UI/UX | ? | `feature/frontend-*` |
| API integration & testing | ? | `feature/api-*` |

Every member should be able to explain their module in the final presentation — Odoo checks this individually.
