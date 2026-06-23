import { useTranslation } from 'react-i18next'
import { SplashRoot } from '@/shared/ui/splash/splash.styled'

// Shown while the session restores / store rehydrates — never a blank screen.
const Splash = () => {
  const { t } = useTranslation()

  return (
    <SplashRoot>
      <span aria-hidden="true">🐼</span>
      <span>{t('common.loading')}</span>
    </SplashRoot>
  )
}

export default Splash
