/**
 * Reads processed token JSON files and produces TypeScript modules
 * with deeply nested light/dark default token objects (ThemeValue leaves).
 *
 * Usage in styled-components: theme.layout.default.enabled.surface.base.cssVar
 *                             theme.typography.fontSize.text.xs.value
 *
 * Derives structure directly from the processed JSON tree (not from CSS var names),
 * so the TypeScript nesting exactly mirrors the design token hierarchy.
 *
 * Run via: yarn design-tokens:types
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const TOKENS_DIR = resolve(import.meta.dirname, '../../src/core/theme/tokens')
const TYPES_GENERATED_DIR = resolve(import.meta.dirname, '../../src/core/theme/types/generated')
const CSS_DIR = resolve(TOKENS_DIR, 'css')
const DEFAULTS_DIR = resolve(TOKENS_DIR, 'defaults')

// Ensure output directories exist
mkdirSync(TYPES_GENERATED_DIR, { recursive: true })
mkdirSync(DEFAULTS_DIR, { recursive: true })

const CSS_VAR_RE = /--([a-z0-9-]+):\s*(.+);/g

// ─── Types ──────────────────────────────────────────────────────────────────

interface TokenLeaf {
  cssVarName: string
  lightValue: string
  darkValue: string
}

type TokenTree = { [key: string]: TokenTree | TokenLeaf }

// ─── Utilities ──────────────────────────────────────────────────────────────

/** Converts camelCase segment to kebab-case (for CSS var name derivation) */
const camelToKebab = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/** Derives the CSS variable name from a JSON path */
const pathToCssVar = (path: string[]): string => `--${path.map(camelToKebab).join('-')}`

/** Checks if a node is a SD token leaf ({ $value, $type }) */
const isSDLeaf = (obj: unknown): boolean =>
  typeof obj === 'object' && obj !== null && '$value' in obj

/** Parses CSS file into varName → resolved value map */
const parseCSSValues = (filePath: string): Map<string, string> => {
  const content = readFileSync(filePath, 'utf-8')
  const map = new Map<string, string>()
  for (const match of content.matchAll(CSS_VAR_RE)) {
    map.set(`--${match[1]}`, match[2].trim())
  }
  return map
}

/** Recursively resolves var() references to their final static value */
const resolveValue = (value: string, allValues: Map<string, string>, depth = 0): string => {
  if (depth > 10) return value // prevent infinite loops
  const varMatch = value.match(/^var\((--[a-z0-9-]+)\)$/)
  if (!varMatch) return value
  const referenced = allValues.get(varMatch[1])
  if (!referenced) return value
  return resolveValue(referenced, allValues, depth + 1)
}

// ─── Tree Building ──────────────────────────────────────────────────────────

/**
 * Recursively walks a processed JSON tree and builds a TokenTree.
 * Each leaf maps to its CSS var name + resolved light/dark values.
 */
const buildTokenTree = (
  node: Record<string, unknown>,
  path: string[],
  lightValues: Map<string, string>,
  darkValues: Map<string, string>,
  baseValues: Map<string, string>,
  allLightResolved: Map<string, string>,
  allDarkResolved: Map<string, string>,
): TokenTree => {
  const result: TokenTree = {}

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue // skip $type, $value at group level

    const currentPath = [...path, key]

    if (isSDLeaf(value)) {
      const cssVarName = pathToCssVar(currentPath)
      const rawLight = lightValues.get(cssVarName) ?? baseValues.get(cssVarName) ?? ''
      const rawDark = darkValues.get(cssVarName) ?? baseValues.get(cssVarName) ?? ''
      result[key] = {
        cssVarName,
        lightValue: resolveValue(rawLight, allLightResolved),
        darkValue: resolveValue(rawDark, allDarkResolved),
      }
    } else if (typeof value === 'object' && value !== null) {
      const subtree = buildTokenTree(
        value as Record<string, unknown>,
        currentPath,
        lightValues,
        darkValues,
        baseValues,
        allLightResolved,
        allDarkResolved,
      )
      if (Object.keys(subtree).length > 0) {
        result[key] = subtree
      }
    }
  }

  return result
}

// ─── Rendering ──────────────────────────────────────────────────────────────

const quoteKey = (key: string): string =>
  /^\d/.test(key) || /[^a-zA-Z0-9_$]/.test(key) ? `'${key}'` : key

const escapeValue = (val: string): string => val.replace(/'/g, "\\'")

const isLeaf = (node: TokenTree[string]): node is TokenLeaf => 'cssVarName' in node

const renderType = (node: TokenTree, indent: number): string[] => {
  const pad = '  '.repeat(indent)
  const result: string[] = []
  for (const [key, value] of Object.entries(node)) {
    const safeKey = quoteKey(key)
    if (isLeaf(value)) {
      result.push(`${pad}readonly ${safeKey}: ThemeValue`)
    } else {
      result.push(`${pad}readonly ${safeKey}: {`)
      result.push(...renderType(value, indent + 1))
      result.push(`${pad}}`)
    }
  }
  return result
}

const renderTree = (node: TokenTree, indent: number, mode: 'light' | 'dark'): string[] => {
  const pad = '  '.repeat(indent)
  const result: string[] = []
  for (const [key, value] of Object.entries(node)) {
    const safeKey = quoteKey(key)
    if (isLeaf(value)) {
      const val = mode === 'light' ? value.lightValue : value.darkValue
      result.push(
        `${pad}${safeKey}: { cssVar: 'var(${value.cssVarName})', cssVarName: '${value.cssVarName}', value: '${escapeValue(val)}' },`,
      )
    } else {
      result.push(`${pad}${safeKey}: {`)
      result.push(...renderTree(value, indent + 1, mode))
      result.push(`${pad}},`)
    }
  }
  return result
}

// ─── Main ───────────────────────────────────────────────────────────────────

const PROCESSED_DIR = resolve(import.meta.dirname, '../tokens/processed')

// Parse resolved CSS values
const baseValues = parseCSSValues(resolve(CSS_DIR, 'base.css'))
const lightValues = parseCSSValues(resolve(CSS_DIR, 'light.css'))
const darkValues = parseCSSValues(resolve(CSS_DIR, 'dark.css'))

// Merged maps for resolving var() chains to final static values
const allLightValues = new Map([...baseValues, ...lightValues])
const allDarkValues = new Map([...baseValues, ...darkValues])

// Read processed JSON source files
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf-8'))

const semanticLight = readJson(resolve(PROCESSED_DIR, 'semantic/colors-light.json'))
const primitivesColors = readJson(resolve(PROCESSED_DIR, 'primitives/colors.json'))
const primitivesSpacing = readJson(resolve(PROCESSED_DIR, 'primitives/spacing.json'))
const dimensionsRadius = readJson(resolve(PROCESSED_DIR, 'dimensions/radius.json'))
const dimensionsSpacing = readJson(resolve(PROCESSED_DIR, 'dimensions/spacing.json'))
const typography = readJson(resolve(PROCESSED_DIR, 'typography.json'))

const buildArgs = [lightValues, darkValues, baseValues, allLightValues, allDarkValues] as const

// Build token trees from JSON structure
// Primitives (palette + spacing scale) — deep merge since both share "primitives" root
const primitivesColorsTree = buildTokenTree(primitivesColors, [], ...buildArgs)
const primitivesSpacingTree = buildTokenTree(primitivesSpacing, [], ...buildArgs)
const primitivesTree: TokenTree = {
  primitives: {
    ...((primitivesColorsTree.primitives ?? {}) as TokenTree),
    ...((primitivesSpacingTree.primitives ?? {}) as TokenTree),
  },
}

// Base tokens: shared between light/dark (spacing, radius, typography)
const baseTree: TokenTree = {
  ...buildTokenTree(dimensionsSpacing, [], ...buildArgs),
  ...buildTokenTree(dimensionsRadius, [], ...buildArgs),
  ...buildTokenTree(typography, [], ...buildArgs),
}

// Color tokens: wrapped under "colors" key
const colorTree: TokenTree = {
  colors: buildTokenTree(semanticLight, [], ...buildArgs) as TokenTree,
}

// Combine into final tree
const tree: TokenTree = { ...primitivesTree, ...baseTree, ...colorTree }

// Count leaves
const countLeaves = (node: TokenTree): number =>
  Object.values(node).reduce((sum, v) => sum + (isLeaf(v) ? 1 : countLeaves(v as TokenTree)), 0)

const HEADER = ['/**', ' * Do not edit directly, this file was auto-generated.', ' */', '']

// --- types.ts ---

const typesLines = [
  ...HEADER,
  "import type { ThemeValue } from '@/core/theme/theme-value'",
  '',
  'export interface AppTheme {',
  ...renderType(tree, 1),
  '}',
  '',
]
writeFileSync(resolve(TYPES_GENERATED_DIR, 'theme.ts'), typesLines.join('\n'))

// --- defaults/light.ts ---
const lightLines = [
  ...HEADER,
  "import type { AppTheme } from '@/core/theme/types'",
  '',
  'export const themeDefaultLight: AppTheme = {',
  ...renderTree(tree, 1, 'light'),
  '}',
  '',
]
writeFileSync(resolve(DEFAULTS_DIR, 'light.ts'), lightLines.join('\n'))

// --- defaults/dark.ts ---
const darkLines = [
  ...HEADER,
  "import type { AppTheme } from '@/core/theme/types'",
  '',
  'export const themeDefaultDark: AppTheme = {',
  ...renderTree(tree, 1, 'dark'),
  '}',
  '',
]
writeFileSync(resolve(DEFAULTS_DIR, 'dark.ts'), darkLines.join('\n'))

// --- defaults/index.ts ---
const defaultsBarrel = [
  ...HEADER,
  "export { themeDefaultLight } from '@/core/theme/tokens/defaults/light'",
  "export { themeDefaultDark } from '@/core/theme/tokens/defaults/dark'",
  '',
]
writeFileSync(resolve(DEFAULTS_DIR, 'index.ts'), defaultsBarrel.join('\n'))

// --- tokens/index.ts (barrel) ---
const barrelLines = [
  ...HEADER,
  "export { themeDefaultLight, themeDefaultDark } from '@/core/theme/tokens/defaults'",
  '',
]
writeFileSync(resolve(TOKENS_DIR, 'index.ts'), barrelLines.join('\n'))

console.log(`Generated ${countLeaves(tree)} tokens (light + dark) → ${TOKENS_DIR}/`)
