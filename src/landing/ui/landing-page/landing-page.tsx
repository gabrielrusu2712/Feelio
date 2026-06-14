import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import reactLogo from '@/core/assets/react.svg'
import viteLogo from '@/core/assets/vite.svg'
import heroImg from '@/core/assets/hero.png'
import {
  Center,
  Counter,
  Docs,
  Hero,
  NextSteps,
  NextStepsList,
  Spacer,
  ThemeModeButton,
  Ticks,
} from '@/landing/ui/landing-page/landing-page.styled'
import { useColorMode } from '@/core/providers/theme-provider/color-mode-context'
import type { ThemeMode } from '@/core/providers/theme-provider/color-mode-context'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'

const ThemeLabels: Record<ThemeMode, string> = {
  auto: '🌗 Auto',
  light: '☀️ Light',
  dark: '🌙 Dark',
}

const NextMode: Record<ThemeMode, ThemeMode> = {
  auto: 'light',
  light: 'dark',
  dark: 'auto',
}

const LandingPage = () => {
  const [count, setCount] = useState(0)
  const { themeMode, setThemeMode } = useColorMode()
  const { t } = useTranslation()

  return (
    <>
      <Center>
        <ThemeModeButton type="button" onClick={() => setThemeMode(NextMode[themeMode])}>
          {ThemeLabels[themeMode]}
        </ThemeModeButton>
        <LanguageSwitcher />
        <ThemeModeButton as={Link} to="/auth">
          🔑 {t('common.login')}
        </ThemeModeButton>
        <Hero>
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </Hero>
        <div>
          <h1>{t('landing.title')}</h1>
          <p>{t('landing.subtitle')}</p>
        </div>
        <Counter type="button" onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </Counter>
      </Center>

      <Ticks />

      <NextSteps>
        <Docs>
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <NextStepsList>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </NextStepsList>
        </Docs>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <NextStepsList>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </NextStepsList>
        </div>
      </NextSteps>

      <Ticks />
      <Spacer />
    </>
  )
}

export default LandingPage
