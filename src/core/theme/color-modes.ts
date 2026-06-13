/**
 * Single source of truth for available color modes.
 * Add new modes here — ColorMode type and the token pipeline all derive from this object.
 */
const ColorModes = { light: 'light', dark: 'dark' } as const

const colorModesArr = Object.values(ColorModes)

export type ColorMode = (typeof colorModesArr)[number]
