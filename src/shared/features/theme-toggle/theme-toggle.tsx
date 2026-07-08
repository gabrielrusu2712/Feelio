import { useTranslation } from 'react-i18next'
import { useColorMode } from '@/core/providers/theme-provider/color-mode-context'
import type { ThemeMode } from '@/core/providers/theme-provider/color-mode-context'
import { ToggleButton } from '@/shared/features/theme-toggle/theme-toggle.styled'

const ThemeLabels: Record<ThemeMode, string> = {
  auto: '🌗',
  light: '☀️',
  dark: '🌙',
}

const NextMode: Record<ThemeMode, ThemeMode> = {
  auto: 'light',
  light: 'dark',
  dark: 'auto',
}

const ThemeToggle = () => {
  const { t } = useTranslation()
  const { themeMode, setThemeMode } = useColorMode()

  return (
    <ToggleButton
      type="button"
      onClick={() => setThemeMode(NextMode[themeMode])}
      aria-label={t('common.toggleTheme')}
    >
      {ThemeLabels[themeMode]}
    </ToggleButton>
  )
}

export default ThemeToggle
