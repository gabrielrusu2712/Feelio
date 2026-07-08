import { useTranslation } from 'react-i18next'
import { SwitcherButton } from '@/shared/features/language-switcher/language-switcher.styled'

const Languages = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'ro', label: '🇷🇴 Română' },
] as const

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const currentIndex = Languages.findIndex((lang) => lang.code === i18n.language)
  const nextIndex = (currentIndex + 1) % Languages.length
  const nextLang = Languages[nextIndex]

  const handleSwitch = () => {
    void i18n.changeLanguage(nextLang.code)
  }

  return (
    <SwitcherButton type="button" onClick={handleSwitch}>
      {nextLang.label}
    </SwitcherButton>
  )
}

export default LanguageSwitcher
