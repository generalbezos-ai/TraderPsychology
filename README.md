# Trader's Mind SPA

Production-ready React + TypeScript single-page app for trader psychology, discipline, and emotional regulation.

## Features

- **Home Dashboard**: streak, profile rules, active program, latest session snapshot
- **Sessions**: guided pacing with minimum-time gates, override controls, and required plan/debrief quality gates
- **Emergency Tools**: structured intervention protocols with gated step timers and usage tracking
- **Programs**: enrollment eligibility checks and day progression controls
- **Library**: category filtering + favorites
- **Insights**: charts now prioritize real logged session data (fallback to sample data if empty)
- **Settings/Profile**: editable profile, timezone, notifications, JSON export, data reset
- **Persistence**: robust localStorage migration + malformed-state guards
- **UX**: mobile-first nav, desktop sidebar, persistent SOS access

## Stack

- React 19 + TypeScript
- Vite 7
- React Router
- Recharts
- Vitest + Testing Library
- Tailwind CSS v4 (`@tailwindcss/vite`)

## Run Locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## QA / Verification Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Run everything in one command:

```bash
npm run qa
```

## Build & Preview

```bash
npm run build
npm run dev -- --host
```

## Data Storage

- localStorage key: `traders-mind-state`
- Versioned schema: currently v3
- Export path: Settings → Data Controls → Export JSON

## Launch Checklist

- [ ] `npm run qa` passes cleanly
- [ ] Manual smoke test all routes: Home, Sessions, Emergency, Programs, Library, Insights, Settings
- [ ] Verify session flow gating and save requirements
- [ ] Verify emergency protocol start/gated progression and logs
- [ ] Verify insights with both empty state and real session logs
- [ ] Verify settings save + JSON export + clear data
- [ ] Verify mobile bottom nav usability and no overlap with primary actions
- [ ] Confirm production build artifacts generated in `dist/`

## Known Limitations

- PnL values in session logs are still placeholder/generated until broker/journal integration exists.
- A full automated a11y engine (axe/pa11y) is not yet wired into CI; current checks use heuristic test coverage.
