/**
 * Style Dictionary v5 configuration.
 *
 * Builds processed tokens into CSS custom properties with var() chaining:
 * - base.css    → primitives + shared tokens (palette, spacing, radius, widths, containers, typography)
 * - light.css   → light mode semantic tokens referencing primitives via var()
 * - dark.css    → dark mode semantic tokens referencing primitives via var()
 *
 * This enables full runtime cascading:
 *   palette → semantic → component (all via CSS var() references)
 *
 * Run: `yarn tokens:build`
 */

import StyleDictionary from 'style-dictionary'
import type { TransformedToken } from 'style-dictionary/types'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROCESSED_DIR = resolve(__dirname, 'tokens/processed')
const OUTPUT_DIR = resolve(__dirname, '../src/core/theme/tokens/css')

// ─── Custom Transforms ──────────────────────────────────────────────────────

StyleDictionary.registerTransform({
  name: 'size/pxUnitless',
  type: 'value',
  filter: (token) => typeof token.$value === 'number' && token.$value !== 0,
  transform: (token) => `${token.$value}px`,
})

// ─── Build Functions ────────────────────────────────────────────────────────

const buildBase = () =>
  new StyleDictionary({
    log: { verbosity: 'silent' as const, errors: { brokenReferences: 'console' as const } },
    source: [
      `${PROCESSED_DIR}/primitives/**/*.json`,
      `${PROCESSED_DIR}/dimensions/**/*.json`,
      `${PROCESSED_DIR}/typography.json`,
    ],
    platforms: {
      css: {
        transforms: ['name/kebab', 'size/pxUnitless'],
        buildPath: `${OUTPUT_DIR}/`,
        files: [
          {
            destination: 'base.css',
            format: 'css/variables',
            options: { outputReferences: true },
          },
        ],
      },
    },
  })

const buildColorMode = (mode: 'light' | 'dark') => {
  const selector =
    mode === 'light' ? ':root, [data-color-mode="light"]' : '[data-color-mode="dark"]'

  return new StyleDictionary({
    log: { verbosity: 'silent' as const, errors: { brokenReferences: 'console' as const } },
    include: [`${PROCESSED_DIR}/primitives/**/*.json`],
    source: [`${PROCESSED_DIR}/semantic/colors-${mode}.json`],
    platforms: {
      css: {
        transforms: ['name/kebab', 'color/css'],
        buildPath: `${OUTPUT_DIR}/`,
        files: [
          {
            destination: `${mode}.css`,
            format: 'css/variables',
            options: { selector, outputReferences: true },
            filter: (token: TransformedToken) => token.isSource,
          },
        ],
      },
    },
  })
}

// ─── Main ───────────────────────────────────────────────────────────────────

console.log('Building design tokens...\n')

await buildBase().buildAllPlatforms()
console.log('  ✓ base.css')

await buildColorMode('light').buildAllPlatforms()
console.log('  ✓ light.css')

await buildColorMode('dark').buildAllPlatforms()
console.log('  ✓ dark.css')

console.log('\n✅ Done! Tokens written to src/core/theme/tokens/')
