import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { StyledThemeProvider } from '@/core/providers/theme-provider/styled-theme-provider'
import { ColorModeContext } from '@/core/providers/theme-provider/color-mode-context'
import type { ThemeMode } from '@/core/providers/theme-provider/color-mode-context'
import type { ColorMode } from '@/core/theme/color-modes'

const STORAGE_KEY = 'feelio-theme-mode'

const getSystemColorMode = (): ColorMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const getInitialThemeMode = (): ThemeMode => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'auto' || stored === 'light' || stored === 'dark') return stored
  return 'auto'
}

const resolveColorMode = (themeMode: ThemeMode): ColorMode =>
  themeMode === 'auto' ? getSystemColorMode() : themeMode

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialThemeMode)
  const [colorMode, setColorMode] = useState<ColorMode>(() =>
    resolveColorMode(getInitialThemeMode()),
  )

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode)
    localStorage.setItem(STORAGE_KEY, mode)
    const resolved = mode === 'auto' ? getSystemColorMode() : mode
    setColorMode(resolved)
    document.documentElement.setAttribute('data-color-mode', resolved)
  }, [])

  // Apply data-color-mode on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorMode)
  }, [colorMode])

  // Listen for OS preference changes (only relevant when themeMode is 'auto')
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (themeMode === 'auto') {
        const resolved = e.matches ? 'dark' : 'light'
        setColorMode(resolved)
        document.documentElement.setAttribute('data-color-mode', resolved)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [themeMode])

  const contextValue = useMemo(
    () => ({ themeMode, colorMode, setThemeMode }),
    [themeMode, colorMode, setThemeMode],
  )

  return (
    <ColorModeContext.Provider value={contextValue}>
      <StyledThemeProvider>{children}</StyledThemeProvider>
    </ColorModeContext.Provider>
  )
}
