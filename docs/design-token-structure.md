# V2 Design Token Structure — Guide for Designers

This document explains the token architecture we want to adopt for the V2 design system. It's inspired by a well-structured reference system (Proteus) but simplified for our cashier context.

---

## Overview

We organize colors **by context** (where they're used), not by CSS property. Everything for one element (button, error state, etc.) lives together — including all its interaction states.

```
colors / {category} / {element} / {state} / {role} / {variant?}
```

| Level    | What it answers          | Examples                                     |
| -------- | ------------------------ | -------------------------------------------- |
| Category | What area of the UI?     | `layout`, `functional`, `effects`            |
| Element  | What concept or element? | `default`, `actionPrimary`, `danger`         |
| State    | What interaction state?  | `enabled`, `hover`, `pressed`, `focused`     |
| Role     | What does this color DO? | `surface`, `onSurface`, `onLayout`, `border` |
| Variant  | Which emphasis level?    | `base`, `primary`, `secondary`, `subtle`     |

---

## Key Concepts

### States

Every token must have a **state** level. The resting/default state is called `enabled` — never use a bare name without a state.

| State     | When it applies                  |
| --------- | -------------------------------- |
| `enabled` | Default/resting — no interaction |
| `hover`   | Mouse hovering over element      |
| `pressed` | Being clicked/tapped             |
| `focused` | Keyboard focus (tab navigation)  |

> **Note:** `disabled` is handled as a separate shared element (`functional / disabled`), not as a state on each element. All disabled elements share the same greyed-out appearance.

### Roles: `surface` vs `onSurface` vs `onLayout`

This is the most important concept to understand:

#### `surface` — the element's own background fill

```
┌──────────────────┐
│                  │  ← this colored box IS the surface
└──────────────────┘
```

#### `onSurface` — content sitting ON the element's own surface

```
┌──────────────────┐  ← surface (e.g. blue button background)
│   "Pay Now"      │  ← onSurface (e.g. white text on the blue)
└──────────────────┘
```

#### `onLayout` — the element rendered directly on the page background

```
┌───────────────────────────────────────────┐  ← layout surface (white page)
│                                           │
│   ⚠️ Your card was declined               │  ← danger.onLayout (red text on page)
│                                           │
│   ┌──────────────────┐                    │
│   │   Try again      │  ← danger.surface (red button bg)
│   │                  │  ← danger.onSurface (white text on red)
│   └──────────────────┘                    │
└───────────────────────────────────────────┘
```

**Rule of thumb:**

- `onSurface` = "I'm inside my own colored box"
- `onLayout` = "I'm floating directly on the page/container background"

#### `border` — the element's border/outline

Used for input borders, dividers, button outlines.

---

## Categories

### 1. Layout — Page and container surfaces

These define the "canvas" — backgrounds, text colors, and borders for the page, cards, and containers.

```
colors / layout / default
  ├── enabled
  │   ├── surface / base                → page background
  │   ├── surface / secondary           → card / raised area background
  │   ├── surface / tertiary            → nested subtle background
  │   ├── onSurface / primary           → main body text
  │   ├── onSurface / secondary         → secondary/muted text
  │   ├── onSurface / tertiary          → least prominent text
  │   ├── onSurface / placeholder       → input placeholder text
  │   ├── border / primary              → dividers, input borders
  │   ├── border / secondary            → subtle borders
  │   └── border / tertiary             → faintest borders
  ├── hover
  │   ├── surface / base                → hovered row/card background
  │   └── onSurface / secondary         → text on hover
  └── focused
      └── border / primary              → focus-visible border

colors / layout / inverted
  ├── enabled
  │   ├── surface / base                → dark section background (e.g. header)
  │   ├── onSurface / primary           → light text on dark section
  │   ├── onSurface / secondary         → muted text on dark section
  │   └── border / primary              → border on dark surfaces
  └── ...
```

**When to use `inverted`:** For areas where the surface flips from the default — like a dark header on a light page, a tooltip, or a notification bar. It's the opposite contrast of `default` regardless of light/dark mode.

### 2. Functional — Interactive and semantic elements

These define colors for things the user interacts with or that communicate meaning.

#### actionPrimary — brand buttons, primary links

```
colors / functional / actionPrimary
  ├── enabled
  │   ├── surface / base                → brand button background
  │   ├── onSurface / base              → text on brand button (usually white)
  │   ├── onLayout / base               → brand link text on page
  │   └── border / base                 → brand button border
  ├── hover
  │   ├── surface / base                → button bg on hover
  │   ├── onLayout / base               → link text on hover
  │   └── border / base
  ├── pressed
  │   ├── surface / base                → button bg when clicked
  │   └── onLayout / base
  └── focused
      └── ring / base                   → focus ring color
```

#### actionSecondary — secondary/outline buttons

```
colors / functional / actionSecondary
  ├── enabled
  │   ├── surface / base                → secondary button bg (often transparent)
  │   ├── onSurface / base              → secondary button text
  │   ├── onLayout / base               → secondary link on page
  │   └── border / base                 → secondary button border
  ├── hover / ...
  └── pressed / ...
```

#### danger — errors, destructive actions

```
colors / functional / danger
  ├── enabled
  │   ├── surface / base                → error banner background
  │   ├── surface / subtle              → light/soft error background
  │   ├── onSurface / base              → text on error surface
  │   ├── onLayout / base               → error text on page
  │   └── border / base                 → error border (inputs, alerts)
  ├── hover
  │   ├── surface / base
  │   └── onLayout / base               → error link hover
  └── ...
```

#### success, warning, info — status indicators

Same shape as `danger`:

```
colors / functional / success
  ├── enabled
  │   ├── surface / base                → success banner bg
  │   ├── surface / subtle              → soft success bg
  │   ├── onSurface / base              → text on success surface
  │   ├── onLayout / base               → success text on page
  │   └── border / base
  └── ...

colors / functional / warning
  └── (same shape)

colors / functional / info
  └── (same shape)
```

#### disabled — non-interactive elements

```
colors / functional / disabled
  └── enabled
      ├── surface / base                → disabled input background
      ├── onSurface / base              → disabled text
      └── border / base                 → disabled border
```

#### selection — focused/selected items

```
colors / functional / selection
  └── enabled
      ├── surface / base                → selected item highlight
      ├── onSurface / base              → selected item text
      └── border / base                 → selection indicator
```

### 3. Effects — Shadows, overlays, focus rings

```
colors / effects / shadow / xs          → lightest shadow
colors / effects / shadow / sm
colors / effects / shadow / md
colors / effects / shadow / lg
colors / effects / shadow / xl
colors / effects / shadow / 2xl

colors / effects / focusRing / default  → standard focus ring
colors / effects / focusRing / error    → error focus ring

colors / effects / overlay / base       → modal backdrop
colors / effects / overlay / subtle     → dropdown overlay
```

### 4. Palette — Raw color scales (primitives)

These are the raw values that semantic tokens reference. Merchants can override to change the brand entirely.

```
palette / brand / 50
palette / brand / 100
palette / brand / 200
...
palette / brand / 900

palette / blue / 50 ... 700
palette / red / 50 ... 700
palette / green / 50 ... 700
palette / purple / 50 ... 700
palette / amber / 50 ... 700
palette / orange / 50 ... 700
... (other utility colors)

palette / alpha / black / 10 ... 100
palette / alpha / white / 10 ... 100
```

---

## Light / Dark Mode

Light and dark are **separate token sets** (files/collections), not part of the token name:

```
📁 light/
   layout / default / enabled / surface / base → #ffffff
   layout / default / enabled / onSurface / primary → #1a1a1a
   functional / danger / enabled / onLayout / base → #d92d20

📁 dark/
   layout / default / enabled / surface / base → #121212
   layout / default / enabled / onSurface / primary → #f5f5f5
   functional / danger / enabled / onLayout / base → #ff6b6b
```

Same token paths, different values per mode.

---

## Typography

Already well structured — no changes needed:

```
font / family / body · display
font / size / text / xs · sm · md · lg · xl
font / size / display / xs · sm · md · lg · xl · 2xl · 3xl · 4xl
font / weight / regular · medium · semibold · bold · black
line / height / text / xs · sm · md · lg · xl
line / height / display / xs · sm · md · lg · xl · 2xl · 3xl · 4xl
```

---

## Spacing, Radius, Width

Flat scales — no changes needed:

```
spacing / none · xxs · xs · sm · md · lg · xl · 2xl ... 11xl
radius  / none · xxs · xs · sm · md · lg · xl · 2xl · 3xl · 4xl · full
width   / xxs · xs · sm · md · lg · xl · 2xl ... 6xl
```

---

## Motion

```
motion / easing / default · emphasis
motion / duration / instant · fast · base · slow
```

---

## Elevation

Elevation defines **depth/shadow structure** — the geometry and color of shadows at different levels. Each level has multiple shadow layers that combine to create a realistic depth effect.

```
elevation / {level} / {layer} / {property}
```

| Level    | Use case                                      |
| -------- | --------------------------------------------- |
| Level -1 | Inset/sunken — pressed buttons, inner shadows |
| Level 0  | Flat — no shadow (flush with surface)         |
| Level 1  | Low — cards, raised sections                  |
| Level 2  | Medium — dropdowns, popovers                  |
| Level 3  | High — modals, dialogs                        |
| Level 4  | Higher — toasts, notifications                |
| Level 5  | Highest — tooltips, floating elements         |

Each level has **three shadow layers** that stack together:

| Layer     | Purpose                                              |
| --------- | ---------------------------------------------------- |
| `key`     | Main directional shadow (defines the "light source") |
| `fill`    | Ambient soft shadow (larger blur, more subtle)       |
| `outline` | Edge definition (gives crispness)                    |

Each layer has these properties:

```
elevation / level1 / key / x         → 0
elevation / level1 / key / y         → 1
elevation / level1 / key / blur      → 2
elevation / level1 / key / spread    → 0
elevation / level1 / key / color     → rgba(35, 24, 180, 0.2)

elevation / level1 / fill / x        → 0
elevation / level1 / fill / y        → 1
elevation / level1 / fill / blur     → 4
elevation / level1 / fill / spread   → 0
elevation / level1 / fill / color    → rgba(35, 24, 180, 0.1)

elevation / level1 / outline / x     → 1
elevation / level1 / outline / y     → 1
elevation / level1 / outline / blur  → 3
elevation / level1 / outline / spread → 0
elevation / level1 / outline / color → rgba(35, 24, 180, 0.1)
```

In CSS, these combine into a single `box-shadow`:

```css
box-shadow:
  0px 1px 2px 0px rgba(35, 24, 180, 0.2),
  /* key */ 0px 1px 4px 0px rgba(35, 24, 180, 0.1),
  /* fill */ 1px 1px 3px 0px rgba(35, 24, 180, 0.1); /* outline */
```

> Level -1 uses the same structure but renders as `inset` shadows in CSS.

---

## Rules Summary

1. **State is always a folder** — `enabled`, `hover`, `focused`, `pressed`
2. **`disabled` is a shared element** — `functional / disabled`, not a state on each element
3. **`enabled` = default** — no bare names without a state level
4. **Role describes function** — `surface` (fill), `onSurface` (content on fill), `onLayout` (content on page), `border` (outline)
5. **Light/dark = separate sets** — not part of the token path
6. **No redundant prefixes** — don't repeat parent folder names in token names
7. **No component-level tokens** — components use semantic tokens (see below)
8. **Extensible** — new elements, states, or variants can be added without restructuring

---

## Why No Component-Specific Tokens?

We do **not** create separate tokens per component (e.g. no `button / fg / brand` or `toggle / border`). Instead, components consume semantic tokens directly.

**Why?**

- A brand button's background IS `functional / actionPrimary / enabled / surface / base` — duplicating it as a "button token" just creates an alias that needs maintaining.
- Adding a new component doesn't require adding new tokens — it just references existing semantic ones.
- Merchants override the semantic meaning ("make all primary actions red"), not individual component internals.

**How components map to tokens:**

| Component              | Uses these tokens                                         |
| ---------------------- | --------------------------------------------------------- |
| Primary button (bg)    | `functional / actionPrimary / enabled / surface / base`   |
| Primary button (text)  | `functional / actionPrimary / enabled / onSurface / base` |
| Primary button (hover) | `functional / actionPrimary / hover / surface / base`     |
| Secondary button (bg)  | `functional / actionSecondary / enabled / surface / base` |
| Error alert (bg)       | `functional / danger / enabled / surface / subtle`        |
| Error alert (text)     | `functional / danger / enabled / onSurface / base`        |
| Input border           | `layout / default / enabled / border / primary`           |
| Input border (error)   | `functional / danger / enabled / border / base`           |
| Disabled button        | `functional / disabled / enabled / surface / base`        |
| Card background        | `layout / default / enabled / surface / secondary`        |
| Body text              | `layout / default / enabled / onSurface / primary`        |
| Link text              | `functional / actionPrimary / enabled / onLayout / base`  |

The designer specifies the token structure. Developers map components to the appropriate tokens in code. If a merchant overrides `actionPrimary / enabled / surface / base`, every primary button updates automatically.

---

## Quick Reference: "Which token do I use?"

| I need a color for...             | Use this path                                             |
| --------------------------------- | --------------------------------------------------------- |
| Page background                   | `layout / default / enabled / surface / base`             |
| Main body text                    | `layout / default / enabled / onSurface / primary`        |
| Secondary text                    | `layout / default / enabled / onSurface / secondary`      |
| Input border                      | `layout / default / enabled / border / primary`           |
| Brand button background           | `functional / actionPrimary / enabled / surface / base`   |
| Brand button text (white on blue) | `functional / actionPrimary / enabled / onSurface / base` |
| Brand link text on page           | `functional / actionPrimary / enabled / onLayout / base`  |
| Brand button hovered              | `functional / actionPrimary / hover / surface / base`     |
| Error message text                | `functional / danger / enabled / onLayout / base`         |
| Error banner background           | `functional / danger / enabled / surface / base`          |
| Success text                      | `functional / success / enabled / onLayout / base`        |
| Disabled button                   | `functional / disabled / enabled / surface / base`        |
| Modal overlay                     | `effects / overlay / base`                                |
| Card shadow                       | `effects / shadow / md`                                   |

---

## Extending the Structure Later

The structure is designed so new tokens can be added **without renaming or moving existing ones**. Here's how each type of extension works:

### New variants (e.g. emphasis levels)

Add siblings at the last level — existing tokens stay untouched:

```
functional / actionPrimary / enabled / surface / base        ← exists
functional / actionPrimary / enabled / surface / positive1   ← NEW (lighter shade)
functional / actionPrimary / enabled / surface / positive2   ← NEW (even lighter)
functional / actionPrimary / enabled / surface / negative1   ← NEW (darker shade)
functional / actionPrimary / enabled / surface / negative2   ← NEW (even darker)
```

### New functional elements

Add a new element alongside existing ones:

```
functional / actionPrimary   ← exists
functional / actionSecondary ← exists
functional / actionTertiary  ← NEW (e.g. ghost/text buttons)
functional / neutral         ← NEW (e.g. neutral indicators)
```

### New states

Add a state folder to any element:

```
functional / actionPrimary / enabled   ← exists
functional / actionPrimary / hover     ← exists
functional / actionPrimary / dragged   ← NEW
functional / actionPrimary / loading   ← NEW
```

### New roles

Add a new role under any state:

```
functional / actionPrimary / enabled / surface    ← exists
functional / actionPrimary / enabled / onSurface  ← exists
functional / actionPrimary / enabled / ring       ← NEW (e.g. outline ring)
functional / actionPrimary / enabled / icon       ← NEW (if icon color differs)
```

### New categories

Add at the top level:

```
layout /       ← exists
functional /   ← exists
effects /      ← exists
palette /      ← exists
component /    ← NEW (if ever needed for edge cases)
```

> **Rule:** always add, never rename or move. Existing token paths are a contract.
