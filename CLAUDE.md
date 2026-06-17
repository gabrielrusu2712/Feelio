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
├── home/          # Home domain
├── app.tsx
└── global-style.ts
```

Each domain follows `{domain}/{features|ui|data-access}/` — `features/` for smart (container) components, `ui/` for dumb (presentational) components, `data-access/` for types/hooks/utils.

### Key conventions

- **Imports**: Always use `@/` path alias — no relative imports (ESLint enforced)
- **Styling**: styled-components only; co-locate in `.styled.ts` next to the component; transient props prefixed with `$`; access theme via `theme.cashier.*`
- **Components**: Arrow functions only; do not destructure props in the function signature — destructure in the body
- **Dumb components**: no Redux, only `useState`; **Smart components**: can use Redux, API calls, `useTranslation()`
- **Object enums**: PascalCase with UPPERCASE keys (avoid TypeScript `enum`)
- **Async**: always `async/await`, never `.then()` chains
- **Type imports**: use `import type` (enforced by ESLint)
- **Files**: kebab-case; styled-components files use `.styled.ts` suffix
