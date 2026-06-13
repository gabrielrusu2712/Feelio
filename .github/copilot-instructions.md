# Copilot Instructions

## Reference

For detailed naming conventions, folder structure, and architecture guidelines, see [`docs/architecture.md`](../docs/architecture.md).

## Project Overview

Feelio is a React application being migrated to a modern stack. It uses Vite as the build tool and TypeScript for type safety.

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** for dev server and bundling
- **styled-components** for CSS-in-JS component styling
- **ESLint 9** with Prettier for linting and formatting
- **Husky** for pre-commit hooks
- **Knip** for detecting unused files and exports

## Conventions

### File Naming

- Use lowercase filenames (e.g., `app.tsx`, `global-style.ts`)
- Styled-components files use the `.styled.ts` suffix (e.g., `app.styled.ts`)
- Use kebab-case for file names

### Imports

- Use the `@/` path alias for absolute imports from `src/` — no relative imports
- Static assets live in `src/core/assets/`

### Styling

- Use **styled-components** for all component styling — do not use CSS modules or plain CSS files
- Keep global styles (CSS variables, resets) in `global-style.ts` using `createGlobalStyle`
- Co-locate styled components in a `.styled.ts` file next to the component that uses them

### Code Style

- Prettier handles formatting — do not configure formatting rules in ESLint
- No unused locals or parameters (enforced by TypeScript strict settings)
- Use functional components with hooks

## Commands

- `yarn dev` — start dev server
- `yarn build` — type-check and build for production
- `yarn lint` — run ESLint
- `yarn type-check` — run TypeScript type checking
- `yarn prettier:fix` — format code with Prettier
- `yarn knip:all` — check for unused files/exports
