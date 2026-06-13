import { createContext, useContext } from 'react'
import type { ColorMode } from '@/core/theme/color-modes'

/** The user-selectable theme mode preference */
export type ThemeMode = 'auto' | ColorMode

interface ColorModeContextValue {
  /** The user's selected preference (auto, light, dark) */
  themeMode: ThemeMode
  /** The resolved color mode actually applied (light or dark) */
  colorMode: ColorMode
  setThemeMode: (mode: ThemeMode) => void
}

export const ColorModeContext = createContext<ColorModeContextValue | null>(null)

export const useColorMode = (): ColorModeContextValue => {
  const ctx = useContext(ColorModeContext)
  if (!ctx) throw new Error('useColorMode must be used within ThemeProvider')
  return ctx
}
