# Project Configuration & Guidelines (`claude.md`)

## 1. Overview
**Stadium Presence Tracker** is a web application that allows football (soccer) fans to log and manage their personal history of visiting football stadiums around the world. Each user has a private account where they can record visits, stadium tours, and personal experiences, as well as browse historical data and team information for each stadium.

---

## 2. Tech Stack & Architecture
The application splits responsibilities between a Python-based backend and a React-based frontend to handle complex client-side interactions (like maps, statistics, and dashboards) efficiently.

*   **Backend (BE):** Python 3.12 — **FastAPI** (async) + SQLAlchemy 2.x async (ORM) + Alembic (migrations) + PostgreSQL + Pydantic v2
*   **Frontend (FE):** **Next.js 14+ (App Router)** — Spanish-first UI, SSR for public stadium pages
*   **Styling:** Tailwind CSS (no component library — custom components only)
*   **Maps:** Mapbox GL JS (`react-map-gl`) — requires `NEXT_PUBLIC_MAPBOX_TOKEN` env var
*   **Rich text fields** (`notes`, `tour_highlights`, `history`): plain `<textarea>` — no rich text editor in v1
*   **Auth:** Custom JWT stored in httpOnly cookies (see §9)
*   **Runtime versions:** Python 3.12 (pinned in `.python-version`), Node 22 LTS (pinned in `.nvmrc`)

**Architecture:**
[ Frontend Web ] ----( HTTP / JSON  Requests)----> [ Backend (API) ] <--- Database
                                                           ^
[ Future Mobile Application ] --------------------------------------|

---

## 3. Naming Conventions & Coding Standards

Please strictly adhere to the following casing styles and rules across the codebase:

| Layer / Scope | Specific Element | Casing Style | Practical Example | Rules & Best Practices |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Architecture** | UI Components | `PascalCase` | `UserCard.tsx`, `SubmitButton.tsx` | Exact same name for both file and component declaration. |
| | Logic, Utilities & Hooks | `camelCase` | `useAuth.ts`, `apiClient.ts` | Maintain strict consistency across the frontend app. |
| | Style Classes (CSS/SASS) | `kebab-case` | `.nav-bar`, `.card-profile__title` | Combining with methodologies like BEM is highly recommended. |
| | Web URLs & Routes | `kebab-case` (lowercase) | `/user-profile/settings` | Always lowercase to avoid routing issues across servers. |
| **Code (General)** | Variables | `camelCase` | `const userId = 1;` | Descriptive names using nouns. |
| | Booleans | `camelCase` | `const isActive = true;` | Must start with prefixes like `is`, `has`, `can`, `should`. |
| | Functions / Methods | `camelCase` | `function getUserData() {}` | Always start with a verb indicating the action. |
| | Global Constants | `UPPER_SNAKE_CASE` | `const MAX_RETRIES = 5;` | Reserved only for immutable values across the app lifecycle. |
| | Classes & Models | `PascalCase` | `class UserSession {}` | Nouns representing clear system entities. |
| | Interfaces & Types | `PascalCase` | `interface UserData {}` | Do **not** use the "I" prefix (avoid `IUserData`). |
| **Backend & DB** | API Endpoints | `kebab-case` (lowercase) | `GET /api/v1/stadium-visits` | Use plural nouns. The action is defined by the HTTP method. |
| | Database Tables | `snake_case` (lowercase) | `users`, `stadium_visits` | Plural names for data collections. |
| | Database Columns | `snake_case` (lowercase) | `first_name`, `created_at` | Clear fields. Foreign keys format: `table_id` in singular. |
| **Git / Repository** | Branches | Prefix + `kebab-case` | `feature/add-login-google` | Common prefixes: `feature/`, `bugfix/`, `hotfix/`, `docs/`. |
| | Commit Messages | Fixed Structure | `feat: add dark mode toggle` | Follow **Conventional Commits**: `type: description` in lowercase. |

## 4. Format and Style
### Style and Coding Rules

* **Write concise code:** Avoid documenting trivial or self-explanatory functions like `add_two_numbers(a, b)`.
* **Prioritize readability:** Value readability over premature optimization. Use descriptive variable names and clear structures; do not sacrifice clarity to save two lines of code.
* **Apply the DRY principle:** (*Don't Repeat Yourself*). If you detect repetitive patterns in your proposal, refactor them into reusable functions or components from the first attempt.
* **Respect language conventions:** If working in Python, strictly use PEP 8 and type hinting. If it is JavaScript/TypeScript, use `camelCase` and strict typing. Do not mix styles.

* **Apply the KISS principle**: One function does one task

## Response Format and Structure

* **Get straight to the point:** Avoid polite introductions or redundant conclusions like "Sure, I'd be happy to help you with that!" or "I hope this helps." Start directly with the solution.
* **Use clean code blocks:** Do not fragment a file into multiple small blocks separated by explanatory text. Deliver the complete modified file or the entire function to make it easy to copy and paste.
* **Format with a clear hierarchy:** Use Markdown strictly: headings (`##`), bulleted lists for features, and bold text only for keywords or critical concepts.

## Work Methodology and Problem Solving

* **Don't assume and ask if you have doubts:** Do this when faced with ambiguity. If an instruction is not 100% clear, ask before continuing, so all is clear.
* **Explicit error handling:** When writing functions, always include initial data validations (early returns) and basic exception handling (`try/catch`), instead of assuming everything will work in the "happy path".
* **Propose modular solutions:** When designing systems or refactoring, break the problem down into small, isolated components. Explain the general flow in a short paragraph before showing the code.
* **Add unit tests for each function:** For each function add unit tests. Before providing a solution execute the tests to check if everything still runs. The unit tests need to cover at least 90% of the cases.

---

## 5. Project Structure

```
/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers — one file per resource (stadiums.py, visits.py, auth.py, leagues.py)
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── schemas/      # Pydantic v2 request/response schemas
│   │   ├── services/     # Business logic (no direct DB calls — delegates to repositories)
│   │   ├── repositories/ # DB async query layer (one per model)
│   │   ├── core/         # Config, security helpers, dependencies (get_db, get_current_user)
│   │   ├── seed/         # Manual seed data (JSON files + seed script for initial stadiums)
│   │   └── tests/        # pytest test suite
│   ├── alembic/          # Alembic migration scripts
│   ├── alembic.ini
│   ├── .python-version   # Pins Python 3.12
│   └── main.py
└── frontend/
    ├── src/
    │   ├── app/                    # Next.js App Router
    │   │   ├── (auth)/             # Route group: login, register (no shared layout)
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   ├── estadios/           # Public stadium pages (SSR)
    │   │   │   ├── [id]/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── visita/
    │   │   │   │       ├── nueva/page.tsx
    │   │   │   │       └── [visitId]/editar/page.tsx
    │   │   │   └── nuevo/page.tsx  # Submit a new stadium
    │   │   ├── dashboard/
    │   │   └── perfil/
    │   ├── components/   # Reusable UI components (PascalCase files)
    │   ├── hooks/        # Custom React hooks (useXxx.ts)
    │   ├── services/     # API client functions (apiClient.ts, stadiumService.ts)
    │   ├── types/        # Shared TypeScript interfaces & types
    │   └── utils/        # Pure helper functions
    ├── .nvmrc            # Pins Node 22 LTS
    └── public/
```

---

## 6. Testing Frameworks

| Layer | Framework | Notes |
| :--- | :--- | :--- |
| **Backend unit tests** | `pytest` + `pytest-cov` | Minimum 90% coverage enforced |
| **Backend API tests** | `pytest` + `httpx.AsyncClient` (async) | Test against a real test DB, not mocks |
| **Frontend unit tests** | `Vitest` + `@testing-library/react` | For hooks and utility functions |
| **Frontend component tests** | `@testing-library/react` | Render + user-event interactions |
| **E2E (v2)** | `Playwright` | Golden-path flows only |

**Rules:**
* Never mock the database in backend tests — use a dedicated test database with seeded fixtures.
* Each new service function must ship with at least one happy-path and one edge-case test.
* Run the full test suite before marking a task complete: `pytest` (BE) and `npm run test` (FE).

---

## 7. Environment & Dev Commands

```bash
# Backend (Python 3.12 — verify with: python --version)
cd backend
# A .venv already exists — activate it directly (do NOT recreate it)
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload          # Dev server → http://localhost:8000
                                       # Auto-docs: /docs (Swagger), /redoc

# Database migrations (Alembic)
alembic upgrade head                                          # Apply all pending migrations
alembic revision --autogenerate -m "describe change"          # Generate a new migration
alembic downgrade -1                                          # Roll back one migration

# Seed initial stadium data
python -m app.seed.run

# Backend tests
pytest --cov=app --cov-report=term-missing

# Frontend (Node 22 LTS — verify with: node --version)
cd frontend
npm install
npm run dev        # Dev server → http://localhost:3000
npm run test       # Run Vitest
npm run build      # Production build
npm run lint       # ESLint check
```

Environment variables are stored in `.env` (never committed). A `.env.example` must be kept up to date with all required keys.

Required backend env vars (minimum):
```
DATABASE_URL=postgresql+asyncpg://admin_stadium_tracker:<password>@localhost:5432/stadium_tracker
SECRET_KEY=...                      # JWT signing key
ACCESS_TOKEN_EXPIRE_MINUTES=43200   # 30 days

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MAPBOX_TOKEN=...
```

---

## 8. State Management (Frontend)

* **Server state** (API data, caching, loading/error states): use **React Query** (`@tanstack/react-query`).
* **Client/UI state** (modals, form steps, ephemeral UI): plain `useState` / `useReducer` — no global store needed for v1.
* Do not use Redux or Zustand unless React Query + local state proves insufficient.

---

## 9. Authentication Pattern

* Auth is **JWT stored in httpOnly cookies** — never in `localStorage` or `sessionStorage` (XSS risk).
* Password hashing: **bcrypt** via `passlib[bcrypt]`.
* The frontend never stores the raw token; it only reads authentication state from a `GET /api/v1/me` call on load.
* Protected routes redirect to `/login` if the session check fails.
* All auth logic lives in `src/hooks/useAuth.ts` (FE) and `app/api/auth.py` (BE); do not scatter auth checks across components.

---

## 10. API Endpoints

All routes are prefixed with `/api/v1/`. All requests and responses use JSON.

**Auth**
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register with email + password |
| `POST` | `/auth/login` | No | Login, returns JWT cookie |
| `POST` | `/auth/logout` | Yes | Clear JWT cookie |

**Stadiums**
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/stadiums` | No | Search & browse (query params: name, city, country, team, capacity_min/max, year_min/max) |
| `POST` | `/stadiums` | Yes | Submit a new stadium (`status: pending_review`) |
| `GET` | `/stadiums/:id` | No | Stadium detail |
| `GET` | `/stadiums/:id/history` | No | History narrative + team tenure list |
| `GET` | `/stadiums/:id/teams` | No | Teams hosted at this stadium |

**Visits**
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/stadiums/:id/visits` | Yes | All visits by the current user for a stadium |
| `POST` | `/stadiums/:id/visits` | Yes | Log a new visit |
| `GET` | `/visits/:visitId` | Yes | Single visit detail |
| `PATCH` | `/visits/:visitId` | Yes | Edit a visit |
| `DELETE` | `/visits/:visitId` | Yes | Delete a visit |

**User / Dashboard**
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/me` | Yes | Current user profile |
| `PATCH` | `/me` | Yes | Update profile |
| `GET` | `/me/dashboard` | Yes | Stats + recent activity |
| `GET` | `/me/stadiums` | Yes | All visited stadiums (deduplicated) |
| `GET` | `/me/visits` | Yes | All visit entries |
| `GET` | `/me/map` | Yes | Map pins for visited stadiums |

**Leagues**
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/leagues` | No | List all available leagues |
| `GET` | `/leagues/:id` | No | League detail + stadium list |
| `GET` | `/me/leagues` | Yes | Leagues the user tracks |
| `POST` | `/me/leagues/:id` | Yes | Opt into a league |
| `DELETE` | `/me/leagues/:id` | Yes | Opt out of a league |
| `GET` | `/me/leagues/:id/progress` | Yes | Completion % for a league |

**Stadium submission note:** User-submitted stadiums (`POST /stadiums`) are saved with `status: pending_review` and are visible **only to the submitting user** until manually approved. No auto-approval in v1.