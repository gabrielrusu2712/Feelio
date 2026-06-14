import { useTranslation } from 'react-i18next'

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
    <button type="button" onClick={handleSwitch}>
      {nextLang.label}
    </button>
  )
}

export default LanguageSwitcher
