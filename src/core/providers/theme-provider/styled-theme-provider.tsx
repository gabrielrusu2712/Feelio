import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { themeDefaultLight, themeDefaultDark } from '@/core/theme/tokens'
import { useColorMode } from '@/core/providers/theme-provider/color-mode-context'

export const StyledThemeProvider = ({ children }: PropsWithChildren) => {
  const { colorMode } = useColorMode()

  const theme = useMemo(
    () => (colorMode === 'dark' ? themeDefaultDark : themeDefaultLight),
    [colorMode],
  )

  return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
}
