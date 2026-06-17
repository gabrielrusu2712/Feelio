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

// ─── Main ───────────────────────────────────────────────────────────────────

console.log('Reading raw token files...')
const base = JSON.parse(readFileSync(resolve(RAW_DIR, 'base.tokens.json'), 'utf8'))
const light = JSON.parse(
  readFileSync(resolve(RAW_DIR, 'feelioColorModes/light.tokens.json'), 'utf8'),
)
const dark = JSON.parse(readFileSync(resolve(RAW_DIR, 'feelioColorModes/dark.tokens.json'), 'utf8'))

console.log('Processing tokens...\n')

// 1. Primitives (palette + spacing scale)
const primitives = base['primitives']
writeJson(
  resolve(OUTPUT_DIR, 'primitives/colors.json'),
  processTree({ primitives: { palette: primitives.palette } }),
)
writeJson(
  resolve(OUTPUT_DIR, 'primitives/spacing.json'),
  processTree({ primitives: { spacing: primitives.spacing } }),
)

// 2. Semantic colors — light & dark (layouts, functional, effects)
writeJson(resolve(OUTPUT_DIR, 'semantic/colors-light.json'), processTree(light))
writeJson(resolve(OUTPUT_DIR, 'semantic/colors-dark.json'), processTree(dark))

// 3. Dimensions — spacing, radius (from base)
writeJson(resolve(OUTPUT_DIR, 'dimensions/spacing.json'), processTree({ spacing: base['spacing'] }))
writeJson(resolve(OUTPUT_DIR, 'dimensions/radius.json'), processTree({ radius: base['radius'] }))

// 4. Typography (from base)
writeJson(resolve(OUTPUT_DIR, 'typography.json'), processTree({ typography: base['typography'] }))

console.log('\n✅ Done! Processed tokens written to style-dictionary/tokens/processed/')
