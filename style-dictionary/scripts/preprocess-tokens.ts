/**
 * Preprocesses raw Figma token exports (light.tokens.json + dark.tokens.json)
 * into Style Dictionary v5 compatible source files.
 *
 * Transformations:
 * - Strips $extensions (Figma metadata)
 * - Normalizes color objects { colorSpace, components, alpha, hex } → hex string
 * - Strips parenthesized suffixes from keys: "text-primary (900)" → "text-primary"
 * - Normalizes U+2024 (one dot leader) to regular dots in references
 * - Fixes references to match transformed key names
 * - Splits into categorized source files for SD consumption
 *
 * Input: style-dictionary/tokens/raw/light.tokens.json + dark.tokens.json
 * Output: style-dictionary/tokens/processed/
 *
 * Only colors differ between light/dark. Spacing, radius, typography, primitives
 * are identical in both files — we extract them once from light.
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
 * - Strips $extensions
 * - Normalizes color objects to hex strings
 * - Transforms keys (strip parens, normalize)
 * - Fixes reference strings in $value
 */
const processTree = (node: unknown): unknown => {
  if (node === null || typeof node !== 'object') return node

  if (isSDLeaf(node)) {
    const result: Record<string, unknown> = {}
    if (node.$type != null) result.$type = node.$type

    const val = node.$value
    if (isFigmaColor(val)) {
      result.$value = normalizeColorValue(val)
    } else if (typeof val === 'string' && val.includes('{')) {
      result.$value = fixReference(val)
    } else {
      result.$value = val
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
const light = JSON.parse(readFileSync(resolve(RAW_DIR, 'light.tokens.json'), 'utf8'))
const dark = JSON.parse(readFileSync(resolve(RAW_DIR, 'dark.tokens.json'), 'utf8'))

console.log('Processing tokens...\n')

// 1. Primitives (shared — from light file, same in both)
const primitives = light['primitives']
writeJson(
  resolve(OUTPUT_DIR, 'primitives/colors.json'),
  processTree({ primitives: { palette: primitives.palette } }),
)
writeJson(
  resolve(OUTPUT_DIR, 'primitives/spacing.json'),
  processTree({ primitives: { spacing: primitives.spacing } }),
)

// 2. Semantic colors — light & dark (only colors differ between modes)
writeJson(resolve(OUTPUT_DIR, 'semantic/colors-light.json'), processTree(light['colors']))
writeJson(resolve(OUTPUT_DIR, 'semantic/colors-dark.json'), processTree(dark['colors']))

// 3. Dimensions — spacing, radius (shared — from light file)
writeJson(
  resolve(OUTPUT_DIR, 'dimensions/spacing.json'),
  processTree({ spacing: light['spacing'] }),
)
writeJson(resolve(OUTPUT_DIR, 'dimensions/radius.json'), processTree({ radius: light['radius'] }))

// 4. Typography (shared — from light file)
writeJson(resolve(OUTPUT_DIR, 'typography.json'), processTree({ typography: light['typography'] }))

console.log('\n✅ Done! Processed tokens written to style-dictionary/tokens/processed/')
