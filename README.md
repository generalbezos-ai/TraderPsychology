# Trader's Mind SPA

Production-ready React + Tailwind single-page app for trader psychology, discipline, and emotional regulation.

## Features

- **Home Dashboard**: streak, profile rules, latest session snapshot
- **Sessions**: Premarket plan, check-in mood, debrief pacing workflow
- **Emergency Tools**: 4 intervention flows with timer + checklists
- **Programs**: 21 Days to Discipline (detailed Day 1-3)
- **Library**: reset players, soundscapes, wisdom vault
- **Insights**: 30-day generated psychology/performance trends with charts
- **Settings/Profile**: editable profile, JSON export, full data clear
- **Persistence**: localStorage schema with migration utility (v1 -> v2)
- **UX**: mobile-first nav + desktop sidebar, dark premium theme, reusable breathing circle, persistent SOS access

## Stack

- React + TypeScript + Vite
- Tailwind (v4 via `@tailwindcss/vite`)
- React Router
- Recharts
- Vitest + Testing Library

## Quick Start

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm test
npm run build
```

## Data Storage

- Key: `traders-mind-state`
- Includes state versioning and migration.

## Notes

- Build emits a chunk-size warning due to charting/router bundle; functionality is unaffected.
