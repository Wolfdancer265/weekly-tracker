# Weekly Strategic Companion

A single-user weekly goal-tracking app built with Next.js, TypeScript, Tailwind CSS, SQLite, and Recharts.

The app is a calm weekly companion for long-horizon work across:
- Inner Wolves
- Sapphire Dragon
- Physical Vitality

## Stack
- Next.js 14+ App Router
- TypeScript
- Tailwind CSS
- SQLite (Node built-in `node:sqlite`) for local persistence
- Recharts for analytics

## Features
- Dashboard with current-week snapshot and summary cards
- Weekly Check-In form for create/edit in one flow
- Reflection prompts for all three pillars + next-week adjustment
- History list page (reverse chronological)
- Week detail page with all fields
- Analytics page with lightweight trend charts
- SQLite-backed create/read/update/list service layer
- Validation and normalization helpers

## 1) Install
```bash
npm install
```

## 2) Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

No required environment variables for default local setup.

## SQLite Behavior
- The app auto-creates the DB file on first run.
- Default DB path: `data/weekly-goals.db`
- Optional override: `SQLITE_DB_PATH=/absolute/or/relative/path.db`

## Optional DB Init Script
```bash
npm run seed
```
This initializes the SQLite schema only and inserts no sample data.

## Data Layer
Code is organized under:
- `lib/sqlite/client.ts`
- `lib/sqlite/weekly-entries.ts`
- `lib/weekly-entries.ts`

Includes:
- Create / read / update / list
- Query by `weekOf`
- Typed transformation between DB rows and app models
- Validation and normalization before save
- Graceful local DB error handling

## Project Structure
```text
app/
  analytics/page.tsx
  check-in/page.tsx
  history/page.tsx
  history/[weekOf]/page.tsx
  api/weekly-entries/route.ts
  api/weekly-entries/[weekOf]/route.ts
components/
  AnalyticsCharts.tsx
  ChartCard.tsx
  EmptyState.tsx
  PageHeader.tsx
  PillarCard.tsx
  ProgressBar.tsx
  ReflectionCard.tsx
  StatBadge.tsx
  WeeklyEntryForm.tsx
lib/
  sqlite/client.ts
  sqlite/weekly-entries.ts
  date-helpers.ts
  transformers.ts
  validation.ts
  weekly-entries.ts
types/
  index.ts
scripts/
  seed-demo.mjs
```

## Notes
- No authentication is implemented in v1 (single-user local use).
- `sapphireDragonShowedUp` is auto-calculated from `writingSessions >= 3`.
- Weekly date input normalizes to Monday week start.
# weekly-tracker
