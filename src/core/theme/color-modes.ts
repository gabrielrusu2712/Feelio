/**
 * Single source of truth for available color modes.
 * Add new modes here — ColorMode type and the token pipeline all derive from this object.
 */
const ColorModes = { light: 'light', dark: 'dark' } as const

export type ColorMode = (typeof ColorModes)[keyof typeof ColorModes]
