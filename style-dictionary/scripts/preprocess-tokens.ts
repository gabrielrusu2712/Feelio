/**
 * Preprocesses raw Figma token exports into Style Dictionary v5 compatible source files.
 *
 * Transformations:
 * - Strips $extensions (Figma metadata)
 * - Normalizes color objects { colorSpace, components, alpha, hex } → hex string
 * - Strips parenthesized suffixes from keys: "text-primary (900)" → "text-primary"
 * - Normalizes U+2024 (one dot leader) to regular dots in references
 * - Fixes references to match transformed key names
 * - Splits into categorized source files for SD consumption
 *
 * Input:
 *   style-dictionary/tokens/raw/base.tokens.json
 *   style-dictionary/tokens/raw/feelioColorModes/light.tokens.json
 *   style-dictionary/tokens/raw/feelioColorModes/dark.tokens.json
 *
 * Output: style-dictionary/tokens/processed/
 *
 * base.tokens.json contains primitives, spacing, radius, typography (mode-agnostic).
 * feelioColorModes contains layouts, functional, effects (per color mode).
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const RAW_DIR = resolve(ROOT, 'tokens/raw')
const OUTPUT_DIR = resolve(ROOT, 'tokens/processed')

// ─── Key/Reference Transformations ──────────────────────────────────────────

/** Strips parenthesized suffix and normalizes to kebab-case */
const normalizeKey = (key: string): string =>
  key
    .replace(/\s*\(.*?\)\s*$/, '')
    .trim()
    .replace(/\u2024/g, '.') // Figma exports dots as U+2024 (one dot leader)
    .replace(/_/g, '-')

/** Fixes reference paths inside {curly.braces} values */
const fixReference = (value: string): string =>
  value.replace(/\{([^}]+)\}/g, (_match, refPath: string) => {
    const fixed = refPath
      .split('.')
      .map((seg) => normalizeKey(seg))
      .join('.')
    return `{${fixed}}`
  })

// ─── Token Processing ───────────────────────────────────────────────────────

/** Detects a Figma color object: { colorSpace, components, alpha, hex } */
const isFigmaColor = (
  obj: unknown,
): obj is { hex: string; alpha?: number; components?: number[] } =>
  typeof obj === 'object' && obj !== null && 'hex' in obj && 'colorSpace' in obj

/** Normalizes a Figma color object to a hex string */
const normalizeColorValue = (color: { hex: string; alpha?: number }): string => {
  const hex = color.hex
  if (color.alpha != null && color.alpha < 1) {
    const alphaHex = Math.round(color.alpha * 255)
      .toString(16)
      .padStart(2, '0')
    return `${hex}${alphaHex}`
  }
  return hex
}

/** Detects SD v5 format leaf: { $value, $type } */
const isSDLeaf = (obj: unknown): obj is { $value: unknown; $type?: string } =>
  typeof obj === 'object' && obj !== null && '$value' in obj

/**
 * Recursively processes a token tree:
 * - Strips $extensions (after extracting aliasData references)
 * - Normalizes color objects to hex strings
 * - Transforms keys (strip parens, normalize)
 * - Fixes reference strings in $value
 * - Converts aliasData references to proper SD {reference} format
 */
const processTree = (node: unknown): unknown => {
  if (node === null || typeof node !== 'object') return node

  if (isSDLeaf(node)) {
    const result: Record<string, unknown> = {}
    if (node.$type != null) result.$type = node.$type

    // Check for alias reference in $extensions before stripping
    const extensions = (node as Record<string, unknown>)['$extensions'] as
      | Record<string, unknown>
      | undefined
    const aliasData = extensions?.['com.figma.aliasData'] as
      | { targetVariableName?: string }
      | undefined
    const aliasRef = aliasData?.targetVariableName

    if (aliasRef) {
      // Convert "primitives/palette/greyNeutral/100" → "{primitives.palette.greyNeutral.100}"
      const refPath = aliasRef
        .split('/')
        .map((seg) => normalizeKey(seg))
        .join('.')
      result.$value = `{${refPath}}`
    } else {
      const val = node.$value
      if (isFigmaColor(val)) {
        result.$value = normalizeColorValue(val)
      } else if (typeof val === 'string' && val.includes('{')) {
        result.$value = fixReference(val)
      } else {
        result.$value = val
      }
    }
    return result
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key === '$extensions') continue
    result[normalizeKey(key)] = processTree(value)
  }
  return result
}

// ─── File Output ────────────────────────────────────────────────────────────

const writeJson = (filePath: string, data: unknown): void => {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
  console.log(`  ✓ ${filePath.replace(ROOT + '/', '')}`)
}

// ─── Brand Palette Generation (anchor-driven ramps) ──────────────────────────
//
// Each brand anchor (one hex value) is expanded into a full 50–950 tint/shade
// ramp here, so the palette has a single human-editable source of truth
// (raw/brand-anchors.tokens.json). Stops < 500 mix the anchor toward white;
// stops > 500 mix it toward a warm near-black so darks stay in the brand family.
// `pins` let an anchor (e.g. the source's exact dark-red) override a stop.

const RAMP_MIX: Record<number, { toward: 'light' | 'dark'; amount: number }> = {
  50: { toward: 'light', amount: 0.94 },
  100: { toward: 'light', amount: 0.86 },
  200: { toward: 'light', amount: 0.72 },
  300: { toward: 'light', amount: 0.52 },
  400: { toward: 'light', amount: 0.28 },
  500: { toward: 'light', amount: 0 },
  600: { toward: 'dark', amount: 0.16 },
  700: { toward: 'dark', amount: 0.34 },
  800: { toward: 'dark', amount: 0.52 },
  900: { toward: 'dark', amount: 0.68 },
  950: { toward: 'dark', amount: 0.82 },
}

const LIGHT_END = '#FFFFFF'
const DARK_END = '#1A0E07' // warm near-black keeps brand shades from going muddy

interface ColorLeaf {
  $type: 'color'
  $value: string
}

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const rgbToHex = (rgb: [number, number, number]): string =>
  '#' +
  rgb
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

const mix = (from: string, to: string, ratio: number): string => {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return rgbToHex([
    a[0] + (b[0] - a[0]) * ratio,
    a[1] + (b[1] - a[1]) * ratio,
    a[2] + (b[2] - a[2]) * ratio,
  ])
}

/** Expands one anchor hex into a 50–950 ramp; `pins` override specific stops. */
const buildRamp = (
  anchor: string,
  pins: Record<number, string> = {},
): Record<string, ColorLeaf> => {
  const ramp: Record<string, ColorLeaf> = {}
  for (const [stop, { toward, amount }] of Object.entries(RAMP_MIX)) {
    const pinned = pins[Number(stop)]
    const value =
      pinned ??
      (amount === 0 ? anchor : mix(anchor, toward === 'light' ? LIGHT_END : DARK_END, amount))
    ramp[stop] = { $type: 'color', $value: value.toUpperCase() }
  }
  return ramp
}

/** Sets a nested token's $value by dotted path; warns (no-op) if the path is absent. */
const setTokenRef = (tree: Record<string, unknown>, path: string, ref: string): void => {
  const segments = path.split('.')
  let node: Record<string, unknown> | undefined = tree
  for (const segment of segments.slice(0, -1)) {
    const next: unknown = node?.[segment]
    node = next && typeof next === 'object' ? (next as Record<string, unknown>) : undefined
  }
  const leaf = node?.[segments[segments.length - 1]]
  if (leaf && typeof leaf === 'object') {
    ;(leaf as Record<string, unknown>).$value = ref
  } else {
    console.warn(`  ⚠ brand overlay path not found: ${path}`)
  }
}

const applyOverlay = (tree: unknown, overlay: Record<string, string>): void => {
  for (const [path, ref] of Object.entries(overlay)) {
    setTokenRef(tree as Record<string, unknown>, path, ref)
  }
}

// Repoints the core semantic layout roles onto the warm brand palette. Add paths
// here as more components need brand-coloured surfaces/text/borders.
const ref = (path: string) => `{primitives.palette.${path}}`

const BRAND_OVERLAY_LIGHT: Record<string, string> = {
  'layouts.default.enabled.surface.primary': ref('cream.500'),
  'layouts.default.enabled.surface.secondary': ref('cream.200'),
  'layouts.default.enabled.surface.tertiary': ref('cream.100'),
  'layouts.default.enabled.onSurface.primary': ref('brand.500'),
  'layouts.default.enabled.onSurface.secondary': ref('brand.700'),
  'layouts.default.enabled.onSurface.tertiary': ref('brand.600'),
  'layouts.default.enabled.border.primary': ref('peach.500'),
  'layouts.default.enabled.border.secondary': ref('peach.600'),
  'layouts.default.enabled.border.tertiary': ref('peach.300'),
}

const BRAND_OVERLAY_DARK: Record<string, string> = {
  'layouts.default.enabled.surface.primary': ref('brand.800'),
  'layouts.default.enabled.surface.secondary': ref('brand.950'),
  'layouts.default.enabled.surface.tertiary': ref('brand.900'),
  'layouts.default.enabled.onSurface.primary': ref('cream.200'),
  'layouts.default.enabled.onSurface.secondary': ref('cream.400'),
  'layouts.default.enabled.onSurface.tertiary': ref('peach.300'),
  'layouts.default.enabled.border.primary': ref('brand.700'),
  'layouts.default.enabled.border.secondary': ref('brand.600'),
}

// ─── Main ───────────────────────────────────────────────────────────────────

console.log('Reading raw token files...')
const base = JSON.parse(readFileSync(resolve(RAW_DIR, 'base.tokens.json'), 'utf8'))
const light = JSON.parse(
  readFileSync(resolve(RAW_DIR, 'feelioColorModes/light.tokens.json'), 'utf8'),
)
const dark = JSON.parse(readFileSync(resolve(RAW_DIR, 'feelioColorModes/dark.tokens.json'), 'utf8'))

console.log('Processing tokens...\n')

// 1. Primitives (palette + spacing scale).
//    The brand/cream/peach families are generated from brand-anchors.tokens.json
//    and merged over the Figma-exported palette (brand replaces the placeholder).
const anchors = JSON.parse(readFileSync(resolve(RAW_DIR, 'brand-anchors.tokens.json'), 'utf8'))
  .brandAnchors as Record<string, string>

const brandFamilies = {
  brand: buildRamp(anchors.terracotta, { 900: anchors.darkRed }),
  cream: buildRamp(anchors.cream, { 200: anchors.creamAlt }),
  peach: buildRamp(anchors.peach),
}

const primitives = base['primitives']
const palette = { ...primitives.palette, ...brandFamilies }
writeJson(resolve(OUTPUT_DIR, 'primitives/colors.json'), processTree({ primitives: { palette } }))
writeJson(
  resolve(OUTPUT_DIR, 'primitives/spacing.json'),
  processTree({ primitives: { spacing: primitives.spacing } }),
)

// 2. Semantic colors — light & dark (layouts, functional, effects).
//    The brand overlay repoints the core layout roles onto the warm palette.
const lightProcessed = processTree(light)
const darkProcessed = processTree(dark)
applyOverlay(lightProcessed, BRAND_OVERLAY_LIGHT)
applyOverlay(darkProcessed, BRAND_OVERLAY_DARK)
writeJson(resolve(OUTPUT_DIR, 'semantic/colors-light.json'), lightProcessed)
writeJson(resolve(OUTPUT_DIR, 'semantic/colors-dark.json'), darkProcessed)

// 3. Dimensions — spacing, radius (from base)
writeJson(resolve(OUTPUT_DIR, 'dimensions/spacing.json'), processTree({ spacing: base['spacing'] }))
writeJson(resolve(OUTPUT_DIR, 'dimensions/radius.json'), processTree({ radius: base['radius'] }))

// 4. Typography (from base)
writeJson(resolve(OUTPUT_DIR, 'typography.json'), processTree({ typography: base['typography'] }))

console.log('\n✅ Done! Processed tokens written to style-dictionary/tokens/processed/')
