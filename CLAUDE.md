# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev              # Start dev server (Vite)
yarn build            # Type-check and build for production
yarn lint             # Run ESLint
yarn type-check       # Run TypeScript type checking
yarn prettier         # Check formatting
yarn prettier:fix     # Format code
yarn knip:all         # Check for unused files/exports
yarn design-tokens    # Rebuild design tokens (preprocess, build, type generation)
```

## Architecture

Feelio is a React 19 SPA using Vite, TypeScript, Redux Toolkit, React Router 7, styled-components, and i18next. Full architectural documentation is in [`docs/architecture.md`](docs/architecture.md).

### Directory structure

```
src/
├── core/          # Singletons: store, routing, theme, i18n, providers
├── shared/        # Cross-domain reusables (features/ and data-access/)
├── auth/          # Auth domain
├── landing/       # Landing domain
├── onboarding/    # Onboarding domain
├── home/          # Home domain (placeholder)
├── diary/         # Journal/diary domain ← Phase 6 (partial)
├── map/           # Map/explore domain ← Phase 5 (partial)
├── app.tsx
└── global-style.ts
```

Each domain follows `{domain}/{features|ui|data-access}/` — `features/` for smart (container) components, `ui/` for dumb (presentational) components, `data-access/` for types/hooks/utils.

### Key conventions

- **Imports**: Always use `@/` path alias — no relative imports (ESLint enforced)
- **Styling**: styled-components only; co-locate in `.styled.ts` next to the component; transient props prefixed with `$`; access theme via `theme.colors.*` / `theme.spacing.*` / `theme.radius.*` / `theme.typography.*`
- **Components**: Arrow functions only; do not destructure props in the function signature — destructure in the body
- **Dumb components**: no Redux, only `useState`; **Smart components**: can use Redux, API calls, `useTranslation()`
- **Object enums**: PascalCase with UPPERCASE keys (avoid TypeScript `enum`)
- **Async**: always `async/await`, never `.then()` chains
- **Type imports**: use `import type` (enforced by ESLint)
- **Files**: kebab-case; styled-components files use `.styled.ts` suffix
- **Redux slices**: 4-file pattern (`*.slice.ts` / `*.selectors.ts` / `*.thunks.ts` / `*.types.ts` / `index.ts`), live in `src/<domain>/data-access/store/`

## Migration status (from FEELIO_MIGRATION_PLAN.md)

> Reference: `FEELIO_MIGRATION_PLAN.md` at the project root.

| Phase                    | Status                                                                   |
| ------------------------ | ------------------------------------------------------------------------ |
| 0 — Foundation           | 🟡 ~7/11 workstreams done                                                |
| 1 — Auth + user backbone | 🟡 logic done, UI deferred                                               |
| 2–4                      | ⬜ not started                                                           |
| 5 — **Map**              | 🟡 **map domain implemented** (explore view, no album pending-claim yet) |
| 6 — **Diary**            | 🟡 **diary domain implemented**                                          |
| 7                        | ⬜ not started                                                           |

## Diary domain (Phase 6 — partial)

**Implemented 2026-06-23.** The `diary` domain mirrors `Feelio-Judeteana/src/journal.ts` behaviour rewritten into React/Redux/styled-components.

### Files created

```
src/diary/
├── data-access/
│   ├── api/diary.api.ts          # Firestore CRUD (saveJournalEntry, fetchJournalEntries)
│   ├── constants/diary.constants.ts  # DIARY_QUESTION_KEYS, Moods, MOOD_LIST
│   └── store/
│       ├── diary.types.ts        # DiaryEntry, DiaryState
│       ├── diary.slice.ts        # RTK slice — loadEntriesThunk / saveEntryThunk
│       ├── diary.thunks.ts       # createAsyncThunk wrappers
│       ├── diary.selectors.ts    # selectDiaryEntries, selectDiaryStatus, etc.
│       └── index.ts              # barrel
├── features/
│   └── diary-page/
│       ├── diary-page.tsx        # Smart container (loads entries, saves, selects mood/question)
│       └── diary-page.styled.ts
└── ui/
    ├── mood-selector/            # Dumb — 5 mood emoji buttons
    ├── daily-question-card/      # Dumb — random question + textarea + save button
    ├── entry-item/               # Dumb — single past entry card (peach bg)
    └── entry-list/               # Dumb — scrollable history with empty state
```

### Files modified

- `src/auth/data-access/store/auth.selectors.ts` — added `selectAuthUser`
- `src/core/store/store.ts` — registered `diary` reducer
- `src/core/i18n/locales/en/translation.json` — added `diary.*` keys (20 keys)
- `src/core/i18n/locales/ro/translation.json` — added `diary.*` keys (20 keys)
- `src/shared/features/app-layout/panels/content-panel.tsx` — renders `<DiaryPage />` when active === 'journal'
- `src/shared/features/app-layout/panels/content-panel.styled.ts` — added `$noPadding` prop to `ContentBody`

### Behaviour matches Feelio-Judeteana

- Random daily question picked from 10 keys on mount and after each save
- 5 mood buttons (🌟 🙂 😐 😔 😫); active state highlighted with border
- Textarea for free-form entry
- Save → Firestore `users/{uid}/journal/{entryId}` (addDoc + serverTimestamp)
- After save: text cleared, question refreshed, "saved" feedback shown for 3 s
- Past 10 entries loaded on mount, newest first; peach (#FFB38E = peach-500 token) background per card
- Full bilingual support (EN/RO)

## Map domain (Phase 5 — partial)

**Implemented 2026-06-23.** The `map` domain mirrors `Feelio-Judeteana/src/map.ts` rewritten into React/Redux/Leaflet.

### Files created

```
src/map/
├── data-access/
│   ├── api/map.api.ts               # Firestore fetch of 'locations' collection
│   ├── constants/map.constants.ts   # Categories, tile URL, default center/zoom, distance threshold
│   ├── hooks/use-leaflet-map.ts     # Leaflet lifecycle in refs — map/markers/user never touch Redux
│   └── store/
│       ├── map.types.ts             # MapObjective, MapState, BilingualText
│       ├── map.slice.ts             # setCategory / setSearchQuery / setSelectedLocation
│       ├── map.thunks.ts            # loadLocationsThunk
│       ├── map.selectors.ts         # selectFilteredObjectives (category + search combined)
│       └── index.ts
├── features/
│   └── map-page/
│       ├── map-page.tsx             # Smart container; loads locations, dispatches filters, handles check-in
│       └── map-page.styled.ts
└── ui/
    ├── map-search-bar/              # Dumb — search input with 🔍 icon
    ├── map-filter-bar/              # Dumb — All/Parks/Waterscapes/Tourist pills
    ├── map-frame/                   # Dumb — Leaflet container + GPS centering button
    └── confetti/                    # Dumb — mounts particles on active=true, auto-removes after 3 s
```

### Files modified

- `src/core/store/store.ts` — registered `map` reducer
- `src/core/i18n/locales/en/translation.json` — added `map.*` keys (11 keys)
- `src/core/i18n/locales/ro/translation.json` — added `map.*` keys (11 keys)
- `src/global-style.ts` — added `@keyframes confetti-fall` + Leaflet popup overrides (`.feelio-map-popup`)
- `src/shared/features/app-layout/panels/content-panel.tsx` — renders `<MapPage />` when active === 'explore'
- `src/shared/features/app-layout/mobile-shell.tsx` — same for mobile
- `package.json` / `node_modules` — added `leaflet` + `@types/leaflet`
- `public/nivel.png` + `public/neutral.png` — GPS icon and fallback location image

### Behaviour matches Feelio-Judeteana

- Locations loaded from Firestore `locations` collection on mount (bilingual name/desc)
- Category filter pills: All / Parks / Waterscapes / Tourist Attractions
- Live search filters by name (RO or EN)
- Markers: terracotta circle markers (`#C44A3A`) with white border
- Popup: glassmorphism-style card (cream bg `#FFF0BE`), location image, name, description, check-in button
- User location: blue marker, map recenters to user on first GPS fix
- GPS button (bottom-right, peach + nivel.png icon) re-centers map on user
- Check-in: ≤200 m → confetti + success message; >200 m → distance error message
- Dark mode: tile layer inverted via `data-dark` attribute + CSS filter
- Language switch: markers re-rendered with correct name/desc on i18n change

### What remains (map)

- `map→album pending-claim`: after a successful check-in, should store claim in Redux + navigate to `/album`. Deferred until Album domain is built (Phase 5 second half).
- Hardcoded GPS test marker from source deliberately **not ported** (DO-NOT-PORT list in migration plan).
- No unit tests yet.

---

### What remains (diary)

- `diary.status === 'error'` visual feedback in the UI (currently only `saveStatus === 'error'` shows ⚠️)
- The route `/journal` renders DiaryPage inside the content panel only; standalone `/diary` route not yet wired (migration plan maps to `/diary`)
- No unit tests yet (follow the Vitest + Testing-Library pattern in `src/test/`)

## Theme token access pattern

Always use the theme object, never raw hex. Example:

```ts
// ✅
background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};

// ❌
background: #FFF9D2;
color: #C44A3A;
```

Key semantic tokens:

- `surface.primary` → cream `#FFF0BE`
- `surface.secondary` → light cream `#FFF9D2`
- `onSurface.primary` → terracotta `#C44A3A`
- `border.primary` → peach `#FFB38E`

## Firebase / Firestore

Modular SDK (`firebase/firestore`). Import from `@/core/services/firebase` (re-exports `app`, `auth`, `db`). Never store `firebase.User` or Firestore `Timestamp` in Redux — map to plain strings/numbers in the API layer.

## i18n

Keys use dotted namespacing: `domain.subsection.key`. EN drives generated types (`src/core/i18n/types/resources.d.ts`). Interpolation uses `{{var}}` (double braces). Never hand-edit generated type files.
