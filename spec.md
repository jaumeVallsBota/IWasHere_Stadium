# Stadium Presence Tracker — Product Specification

**Version:** 0.1 (First Draft)
**Date:** 2026-06-01

---

## 1. Overview

Stadium Presence Tracker is a web application that allows football (soccer) fans to log and manage their personal history of visiting football stadiums around the world. Each user has a private account where they can record visits, stadium tours, personal experiences, and browse a stadium's historical and team information.

---

## 2. Goals

- Give football fans a personal logbook of stadium visits.
- Track both matchday visits and guided stadium tours separately.
- Allow users to record rich, personal experiences per visit.
- Provide historical context about each stadium (history, renovations, hosting clubs).
- Keep data private and tied to a user account.

---

## 3. User Roles

| Role | Description |
|---|---|
| **Visitor (unauthenticated)** | Can browse the app shell and public stadium data, but cannot save anything. |
| **Registered User** | Full access: can log in, record visits, write experiences, manage their profile. |

No admin panel is required in v1. Stadium data is either pre-seeded or user-submitted (TBD in v2).

---

## 4. Authentication & Sessions

- **Registration:** Email + password. Optional: sign in with Google/Apple (v2).
- **Login:** Email + password. JWT or session-cookie based auth.
- **Session:** Persists across browser tabs. Expires after a configurable idle period (e.g. 30 days).
- **Logout:** Clears session and redirects to home.
- **Password reset:** Via email link.

---

## 5. Core Entities

### 5.1 Stadium

A stadium is a global entity (shared across all users). It contains:

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Official name of the stadium |
| `city` | String | City where the stadium is located |
| `country` | String | Country |
| `capacity` | Integer | Seating capacity |
| `year_opened` | Year | Year the stadium was inaugurated |
| `history` | Rich text | Historical narrative of the stadium (construction, renovations, notable events) |
| `current_team` | String (FK) | Main club currently playing there |
| `teams_hosted` | List of Teams | All clubs that have used the stadium as home ground (see §5.3) |
| `photos` | List of URLs | Stadium images |
| `coordinates` | Lat/Lng | Geographic location |

### 5.2 Visit (User ↔ Stadium)

A Visit is a personal record created by a user for a specific stadium. A user can have **multiple visits to the same stadium** (e.g. different matchdays or a tour on a separate date).

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK) | Owner of the visit |
| `stadium_id` | UUID (FK) | Stadium visited |
| `visit_type` | Enum | `matchday` or `tour` |
| `date` | Date | Date of the visit |
| `match` | String (optional) | If matchday: teams and competition (e.g. "FC Barcelona vs Real Madrid — La Liga") |
| `tour_experience` | Rich text (optional) | Personal write-up of the tour experience |
| `rating` | Integer 1–5 (optional) | Personal rating of the experience |
| `notes` | Rich text (optional) | Any other personal notes |
| `photos` | List of URLs (optional) | User-uploaded photos from the visit |
| `created_at` | Timestamp | When the record was created |

### 5.3 Team (hosted at a stadium)

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String | Club name |
| `country` | String | Country of the club |
| `years_at_stadium` | String | Period the team played there (e.g. "1957–present") |
| `notes` | String (optional) | Context (e.g. shared ground, temporary use) |

---

## 6. Features

### 6.1 Stadium Search & Browse

- Search stadiums by name, city, country, or team.
- Filter by: country, capacity range, year range.
- Stadium detail page showing: overview, history, hosted teams, and (if logged in) the user's own visit history for that stadium.

### 6.2 Log a Visit

From a stadium's page (or a dedicated "Add Visit" flow):

1. Select visit type: **Matchday** or **Tour**.
2. Pick the date.
3. If **Matchday**: optionally enter match details (home team, away team, competition, score).
4. If **Tour**: write a free-text experience description (rich text editor).
5. Add a personal rating (1–5 stars) and optional notes.
6. Upload photos (optional).
7. Save.

### 6.3 Visit History per Stadium

On each stadium's page, logged-in users see a **"My Visits"** section:

- Chronological list of all their visits to that stadium.
- Each entry shows: date, type (matchday/tour), rating, and a preview of notes/experience.
- Expandable to show full details.
- Edit and delete actions per visit.

### 6.4 My Profile / Dashboard

A personal dashboard showing:

- **Stats:** Total stadiums visited, total visits, countries covered, % of a chosen league's stadiums visited.
- **Stadium list:** All stadiums the user has visited (deduplicated), with visit count per stadium.
- **Recent activity:** Latest visit entries.
- **Map view:** Pins on a world map for all visited stadiums.

### 6.5 Stadium History Section

On each stadium detail page, a dedicated **History** tab containing:

- Narrative history of the stadium (founding, key renovations, notable matches hosted).
- Timeline of name changes (if any).
- List of all teams that have used the stadium as home ground, with the years of tenure and any relevant notes.

---

## 7. Pages & Navigation

| Route | Page | Auth required |
|---|---|---|
| `/` | Home / Landing | No |
| `/login` | Login | No |
| `/register` | Registration | No |
| `/stadiums` | Stadium search & browse | No |
| `/stadiums/:id` | Stadium detail | No (visit section: yes) |
| `/stadiums/:id/visit/new` | Log a new visit | Yes |
| `/stadiums/:id/visit/:visitId/edit` | Edit a visit | Yes |
| `/dashboard` | User dashboard | Yes |
| `/profile` | User profile & settings | Yes |

---

## 8. Data & Storage

- **Database:** Relational (PostgreSQL recommended). Stadium data is normalised; visits are per-user rows.
- **Auth:** Handled server-side (e.g. NextAuth, Supabase Auth, or custom JWT).
- **File storage:** User-uploaded photos stored in object storage (S3 or equivalent).
- **Stadium seed data:** Pre-populated dataset of major world stadiums for launch.

---

## 9. Non-Functional Requirements

| Concern | Requirement |
|---|---|
| **Privacy** | All visit data is private to the user by default. No social/sharing features in v1. |
| **Performance** | Stadium search returns results in < 500 ms. |
| **Mobile** | Fully responsive; primary use case is mobile (logging a visit on the day). |
| **Accessibility** | WCAG 2.1 AA compliance. |
| **Offline (v2)** | Consider PWA/offline support for logging visits without connectivity. |

---

## 10. Out of Scope (v1)

- Social features (following other users, sharing visits publicly).
- Stadium user-reviews/ratings visible to others.
- Notifications or reminders.
- Import from third-party services.
- Admin CMS for managing stadium data.
- Native mobile app.

---

## 11. Open Questions

1. **Stadium data source:** Will stadium data be manually seeded, scraped, or pulled from an API (e.g. API-Football, OpenStreetMap)?
2. **User-submitted stadiums:** Can users add stadiums not in the database?
3. **Leagues/competitions filter:** Should users be able to track "% of stadiums in La Liga" or similar completion goals?
4. **Multilingual support:** Is the app Spanish-first, English-first, or both?
5. **Tour vs. matchday on the same day:** Should one visit record support both types simultaneously, or always be two separate entries?

---

*End of draft v0.1*
