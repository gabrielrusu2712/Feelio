# Project Architecture

## Project Structure

```
📁 public/
📁 src/
├─ 📁 {domain}/
│  ├─ 📁 data-access/
│  │  ├─ 📁 constants/
│  │  ├─ 📁 hooks/
│  │  ├─ 📁 types/
│  │  ├─ 📁 utils/
│  │  ├─ 📁 .../
│  ├─ 📁 features/
│  │  ├─ 📁 {feature-name}/
│  │  │  ├─ 📝 {feature-name}.tsx
│  │  │  ├─ 📝 {feature-name}.test.tsx
│  │  │  ├─ 📝 {feature-name}.styled.tsx
│  ├─ 📁 ui/
│  │  ├─ 📁 {component-name}/
│  │  │  ├─ 📝 {component-name}.tsx
│  │  │  ├─ 📝 {component-name}.test.tsx
│  │  │  ├─ 📝 {component-name}.styled.tsx
├─ 📁 core/
│  ├─ 📁 middlewares/
│  ├─ 📁 providers/
│  ├─ 📁 services/
│  ├─ 📁 store/
│  ├─ 📁 utils/
│  ├─ 📁 features/
│  ├─ 📁 ui/
├─ 📁 shared/                   /* same structure as {domain} */
📝 .eslintignore
📝 .eslintrc
📝 .nvmrc
📝 package.json
📝 tsconfig.json
```

## Directory Definitions

### `src/`

The `src` folder holds the application code. It is structured in multiple folders, each with specific responsibilities.

### `{domain}/`

All files under a certain domain should be imported **only** in files under that same domain.

> ❌ Can't import a file from `domain-x` into a file from `domain-y`.

### `core/`

Contains files that are used **only once** in the app.

**Examples:** Store declarations, setup hooks, service declarations, components with a general purpose like the router, guards, etc.

### `shared/`

Contains files that are used in **at least 2 different domains**. Follows the same structure as `{domain}/`.

> If a file is under `domain-x` and you need that functionality in `domain-y`, move it to `shared/`.

## Subdirectory Definitions

### `ui/`

Contains **dumb (presentational) components only**.

Dumb components must:

- Be representational only
- Be context-unaware (don't use `dispatch`, don't consume store data, handle only local state)
- Interact with the parent through callbacks (e.g., `onSubmit`, `onChange`)

### `features/`

Contains **smart (container) components only**.

Smart components must:

- Use dumb components or other smart components to display data
- Handle business logic (dispatch actions, consume store state, trigger API requests)

### `data-access/`

Contains data manipulation files — **anything that is not a component**.

Includes: constants, hooks, types, utils, and other non-component logic.

## Naming Conventions

### Files

Use **kebab-case** for all files.

```
cashier-input.tsx
cashier-input.styled.tsx
cashier-input.test.tsx
```

### Variables

| Category            | Convention                              | Example                             |
| ------------------- | --------------------------------------- | ----------------------------------- |
| Components          | PascalCase                              | `CashierInput`, `PaymentMethodList` |
| Object enum-like    | PascalCase (plural) with UPPERCASE keys | `Colors.WHITE`, `Directions.UP`     |
| Constant primitives | UPPERCASE                               | `MAX_INT`, `DEFAULT_LOCALE`         |
| Other variables     | camelCase                               | `isLoading`, `merchantId`           |

> ⚠️ Do **not** use TypeScript `enum`. Use `as const` objects instead.

## Component Guidelines

### Props Destructuring

Do **not** destructure props in the function signature. Instead, accept `props` as a single parameter and destructure inside the function body — one property per line:

```tsx
// ✅ Good
const CashierInput = (props: CashierInputProps) => {
  const { label, value, onChange, required } = props
  const { some, more, params, like, that } = props

  return <input value={value} onChange={onChange} />
}

// ❌ Bad — destructuring in signature
const CashierInput = ({ label, value, onChange, required }: CashierInputProps) => {
  return <input value={value} onChange={onChange} />
}
```

### Component File Structure

Each component directory contains up to 3 files:

```
{component-name}/
├─ {component-name}.tsx           # Component logic
├─ {component-name}.styled.tsx    # Styled-components (if needed)
├─ {component-name}.test.tsx      # Tests (if needed)
```

### Styled Components

- Use **styled-components** for all component styling
- Use **theme accessors** (`theme.cashier.*`) instead of CSS variables for type safety
- Prefix transient props with `$` to avoid DOM forwarding (e.g., `$type`, `$isActive`)
- **Single destructure per component** — destructure `theme` and all `$` props once at the top of the template literal. Never use multiple inline `({ theme }) =>` interpolations.

```tsx
// ✅ Good — single destructure with theme + props
export const StyledCard = styled.div<{ $active: boolean }>`
  ${({ theme: { cashier }, $active }) => `
    color: ${cashier.headings.color};
    font-weight: ${cashier.headings.fontWeight};
    border: 1px solid ${cashier.derived.borderColor};
    background: ${$active ? cashier.derived.selectedCardBg : cashier.derived.cardBg};
    outline: ${$active ? `2px solid ${cashier.buttons.color}` : 'none'};
  `}
`

// ❌ Bad — multiple destructures in the same component
export const StyledCard = styled.div<{ $active: boolean }>`
  ${({ theme: { cashier } }) => `
    color: ${cashier.headings.color};
  `}
  background: ${({ $active, theme: { cashier } }) =>
    $active ? cashier.derived.selectedCardBg : cashier.derived.cardBg};
`

// ❌ Bad — repeated inline destructuring
export const StyledCard = styled.div`
  color: ${({ theme }) => theme.cashier.headings.color};
  font-weight: ${({ theme }) => theme.cashier.headings.fontWeight};
`

// ❌ Bad — raw CSS variable instead of theme accessor
color: var(--headings-color);
```

### Async Code Style

Always use `async/await` — never `.then()` chains.

```tsx
// ✅ Good
const handleSubmit = useCallback(async () => {
  await dispatch(validateTransaction())
  navigate(RoutePath.Receipt)
}, [dispatch, navigate])

useEffect(() => {
  const init = async () => {
    await dispatch(fetchData())
    setLoaded(true)
  }
  init()
}, [dispatch])

// ❌ Bad
dispatch(fetchData()).then(() => setLoaded(true))
```

### Dumb vs Smart Components

|               | Dumb (`ui/`)                             | Smart (`features/`)        |
| ------------- | ---------------------------------------- | -------------------------- |
| Redux         | ❌ No `useSelector` / `useDispatch`      | ✅ Yes                     |
| API calls     | ❌ No                                    | ✅ Yes                     |
| Local state   | ✅ `useState` only                       | ✅ Any                     |
| Communication | Props + callbacks                        | Props + hooks              |
| i18n          | ❌ Receives translated strings via props | ✅ Uses `useTranslation()` |
