# Stadium Presence Tracker — Product Specification

**Version:** 0.2
**Date:** 2026-06-01

---

## 1. Overview

Stadium Presence Tracker is a web application (Spanish-first) that allows football (soccer) fans to log and manage their personal history of visiting football stadiums around the world. Each user has a private account where they can record visits, stadium tours, personal experiences, and browse a stadium's historical and team information.

---

## 2. Goals

- Give football fans a personal logbook of stadium visits.
- Track both matchday visits and guided stadium tours as separate entries.
- Allow users to record rich personal experiences, especially for tours.
- Provide historical context about each stadium (history, teams hosted).
- Let users add missing stadiums themselves.
- Track league/competition completion goals (e.g. "% of La Liga grounds visited").
- Keep data private and tied to a user account.

---

## 3. User Roles

| Role | Description |
|---|---|
| **Visitor (unauthenticated)** | Can browse the app shell and public stadium data, but cannot save anything. |
| **Registered User** | Full access: can log in, record visits, write experiences, submit new stadiums, manage their profile. |

No admin panel is required in v1. Stadiums can be pre-seeded or user-submitted.

---

## 4. Authentication & Sessions

- **Registration:** Email + password. Optional: sign in with Google/Apple (v2).
- **Login:** Email + password. JWT or session-cookie based auth.
- **Session:** Persists across browser tabs. Expires after a configurable idle period (e.g. 30 days).
- **Logout:** Clears session and redirects to home.
- **Password reset:** Via email link.

---

## 5. Language

The application is **Spanish-first**. All UI copy, labels, error messages, and static content are written in Spanish. English support may be added in v2.

---

## 6. Core Entities

### 6.1 Stadium

A stadium is a global entity shared across all users. Fields marked with † are required when a user submits a new stadium.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | UUID | auto | Primary key |
| `name` | String | † | Official name of the stadium |
| `city` | String | † | City where the stadium is located |
| `country` | String | † | Country |
| `coordinates` | Lat/Lng | † | Geographic location (used for map pins) |
| `capacity` | Integer | no | Seating capacity |
| `year_opened` | Year | no | Year the stadium was inaugurated |
| `history` | Rich text | no | Brief historical narrative (construction, renovations, notable events) |
| `current_team` | String (FK) | no | Main club currently playing there |
| `teams_hosted` | List of Teams | no | All clubs that have used the stadium as home ground (see §6.3) |
| `photos` | List of URLs | no | Stadium images |
| `submitted_by` | UUID (FK) | auto | User who submitted it (null if pre-seeded) |
| `status` | Enum | auto | `approved` / `pending_review` — user submissions start as `pending_review` |

### 6.2 Visit (User ↔ Stadium)

A Visit is a personal record created by a user for a specific stadium. A user can have **multiple visits to the same stadium** across different dates and types. Matchday and tour visits on the same day are stored as **two separate records**.

A stadium is considered **"visited"** by the user as soon as they have at least one visit record of any type for it.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | UUID | auto | Primary key |
| `user_id` | UUID (FK) | yes | Owner of the visit |
| `stadium_id` | UUID (FK) | yes | Stadium visited |
| `visit_type` | Enum | yes | `matchday` or `tour` |
| `date` | Date | yes | Date of the visit |
| `match_home_team` | String | if matchday | Home team |
| `match_away_team` | String | if matchday | Away team |
| `match_competition` | String | no | Competition name (e.g. "La Liga", "Champions League") |
| `match_score` | String | no | Final score (e.g. "2–1") |
| `tour_overall_impression` | Enum | if tour | `Muy bueno`, `Bueno`, `Normal`, `Malo` (or 1–5 stars) |
| `tour_highlights` | Rich text | if tour | What stood out — best parts of the tour |
| `tour_would_recommend` | Boolean | if tour | Would the user recommend this tour? |
| `tour_guide_quality` | Enum | if tour, optional | `Excelente`, `Bueno`, `Regular`, `Sin guía` |
| `tour_duration_minutes` | Integer | if tour, optional | Approximate duration of the tour |
| `notes` | Rich text | no | Any other personal notes (applies to both types) |
| `rating` | Integer 1–5 | no | Personal overall rating of the experience |
| `photos` | List of URLs | no | User-uploaded photos from the visit |
| `created_at` | Timestamp | auto | When the record was created |

### 6.3 Team (hosted at a stadium)

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Club name |
| `country` | String | Country of the club |
| `years_at_stadium` | String | Period the team played there (e.g. "1957–present") |
| `notes` | String (optional) | Context (e.g. shared ground, temporary use) |

### 6.4 League / Competition

Used for completion tracking goals.

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Competition name (e.g. "La Liga", "Premier League") |
| `country` | String | Country |
| `season` | String | Optional: season reference (e.g. "2025/26") |
| `stadiums` | List of Stadium IDs | Grounds included in this competition |

---

## 7. Features

### 7.1 Stadium Search & Browse

- Search stadiums by name, city, country, or team name.
- Filter by: country, capacity range, year opened.
- Stadium detail page showing: overview info, brief history, hosted teams list, and (if logged in) the user's own visit history for that stadium.
- "Add missing stadium" button for logged-in users when a search returns no results.

### 7.2 Log a Visit

The "log a visit" flow is triggered from a stadium's page. Steps:

1. **Choose visit type:** The user is presented with two clear options — **Partido** (Matchday) or **Tour** — each with a brief description of what it means. A stadium is marked as visited regardless of which type is chosen.

2. **Enter date.**

3. **If Matchday:**
   - Local team (pre-filled if stadium has a current team).
   - Away team.
   - Competition (optional).
   - Score (optional).
   - Notes / personal impressions (optional).
   - Photos (optional).
   - Overall rating 1–5 (optional).

4. **If Tour:**
   The form asks specifically about the tour experience:
   - Overall impression (required): `Muy bueno / Bueno / Normal / Malo`.
   - Highlights — free text: *¿Qué fue lo mejor del tour?* (optional but encouraged).
   - Would you recommend it? Yes / No (optional).
   - Guide quality (optional): `Excelente / Bueno / Regular / Sin guía`.
   - Approximate duration in minutes (optional).
   - Notes (optional).
   - Photos (optional).
   - Overall rating 1–5 (optional).

5. **Save.** The stadium now appears in the user's visited list.

### 7.3 Visit History per Stadium

On each stadium's page, logged-in users see a **"Mis visitas"** section:

- A badge/indicator showing whether the user has visited this stadium.
- Chronological list of all their visits, each showing: date, type (Partido / Tour), rating, and a short preview.
- Expandable cards to show full details.
- Edit and delete actions per visit entry.
- A "+" button to log a new visit to the same stadium.

### 7.4 User Dashboard

A personal dashboard ("Mi perfil") showing:

- **Stats strip:** Total stadiums visited · Total visit entries · Countries covered.
- **League completion tracker:** For each league the user has opted into, a progress bar showing *X of Y grounds visited*. Users can add or remove leagues from their tracker.
- **Stadium list:** All stadiums visited (deduplicated), with a badge per stadium showing visit count and type icons (⚽ for matchday, 🏟 for tour).
- **Recent activity:** Last 5–10 visit entries.
- **Map view:** World map with pins for all visited stadiums. Pin colour/style distinguishes matchday-only, tour-only, or both.

### 7.5 Stadium History & Teams Section

On each stadium detail page, a **Historia** tab containing:

- Brief narrative of the stadium's history (founding, key renovations, notable events).
- List of all teams that have used the stadium as home ground, with years of tenure and any relevant notes.

### 7.6 User-Submitted Stadiums

If a logged-in user searches for a stadium and it doesn't exist:

1. They tap "Añadir estadio".
2. A form collects the required fields (name, city, country, coordinates) plus any optional info.
3. The stadium is saved with `status: pending_review` and is immediately visible **only to the submitting user** until approved.
4. The user can log visits to their submitted stadium right away.
5. Once approved (manual review or auto-approve in v1), the stadium becomes visible to all users.

---

## 8. Pages & Navigation

| Route | Page | Auth required |
|---|---|---|
| `/` | Home / Landing | No |
| `/login` | Login | No |
| `/register` | Registration | No |
| `/estadios` | Stadium search & browse | No |
| `/estadios/nuevo` | Submit a new stadium | Yes |
| `/estadios/:id` | Stadium detail | No (visit section: yes) |
| `/estadios/:id/visita/nueva` | Log a new visit | Yes |
| `/estadios/:id/visita/:visitId/editar` | Edit a visit | Yes |
| `/dashboard` | User dashboard | Yes |
| `/perfil` | User profile & settings | Yes |

---

## 9. Data & Storage

- **Database:** Relational (PostgreSQL recommended). Stadium data is normalised; visits are per-user rows.
- **Stadium data source:** OpenStreetMap and/or Wikipedia for initial seed data (location, basic info, short history). Supplemented by user submissions.
- **Auth:** Handled server-side (e.g. NextAuth, Supabase Auth, or custom JWT).
- **File storage:** User-uploaded photos stored in object storage (S3 or equivalent).
- **Geocoding:** Coordinates required for all stadiums; used for map display.

---

## 10. Non-Functional Requirements

| Concern | Requirement |
|---|---|
| **Language** | Spanish-first. All UI copy in Spanish. |
| **Privacy** | All visit data is private to the user. No social/sharing features in v1. |
| **Performance** | Stadium search returns results in < 500 ms. |
| **Mobile** | Fully responsive; primary use case is mobile (logging a visit on the day). |
| **Accessibility** | WCAG 2.1 AA compliance. |
| **Offline (v2)** | Consider PWA/offline support for logging visits without connectivity. |

---

## 11. Out of Scope (v1)

- Social features (following other users, sharing visits publicly).
- Notifications or reminders.
- Import from third-party services.
- Admin CMS for managing stadium data (manual DB review for submissions in v1).
- Native mobile app.
- English or other language support.

---

## 12. Resolved Decisions

| # | Question | Decision |
|---|---|---|
| 1 | Stadium data source | OpenStreetMap / Wikipedia seed for location, basic info, and brief history. |
| 2 | User-submitted stadiums | Yes — users can submit missing stadiums; they go into `pending_review` status. |
| 3 | League completion tracking | Yes — users opt into leagues and see a % completion progress bar on their dashboard. |
| 4 | Language | Spanish-first. English in v2. |
| 5 | Tour vs matchday same day | Always two separate visit records. A stadium is marked "visited" with either type. Tour visits trigger additional experience questions at log time. |

---

*End of draft v0.2*
