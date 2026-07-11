import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/core/store'
import { selectIsAuthenticated } from '@/auth/data-access/store'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'
import ThemeToggle from '@/shared/features/theme-toggle/theme-toggle'
import {
  Cloud,
  Clouds,
  Content,
  Footer,
  Header,
  HeaderControls,
  HeroImage,
  PlayButton,
  Shell,
  Tagline,
  Title,
  TutorialLink,
} from '@/landing/ui/landing-page/landing-page.styled'

const CLOUD_IMAGE = '/assets/shared/cloud.png'
const CHARACTER_IMAGE = '/assets/character/neutral.png'

const CLOUDS = [
  { top: '8%', side: 'left', offset: '3%', size: '6rem', delay: '0s', opacity: 0.6 },
  { top: '12%', side: 'right', offset: '-2%', size: '8rem', delay: '1.5s', opacity: 0.5 },
  { top: '30%', side: 'left', offset: '-4%', size: '7rem', delay: '3s', opacity: 0.45 },
  { top: '34%', side: 'right', offset: '6%', size: '5.5rem', delay: '2.2s', opacity: 0.55 },
  { top: '50%', side: 'right', offset: '-3%', size: '8.5rem', delay: '0.5s', opacity: 0.4 },
  { top: '58%', side: 'left', offset: '2%', size: '6.5rem', delay: '4s', opacity: 0.5 },
  { top: '74%', side: 'right', offset: '8%', size: '6rem', delay: '1s', opacity: 0.45 },
  { top: '80%', side: 'left', offset: '-2%', size: '7.5rem', delay: '2.8s', opacity: 0.4 },
] as const

// Extra clouds shown only in landscape/desktop (hidden in portrait via $desktopOnly).
const DESKTOP_CLOUDS = [
  { top: '6%', side: 'left', offset: '22%', size: '6.5rem', delay: '2s', opacity: 0.5 },
  { top: '10%', side: 'right', offset: '20%', size: '7rem', delay: '3.5s', opacity: 0.45 },
  { top: '24%', side: 'right', offset: '32%', size: '5rem', delay: '1.2s', opacity: 0.5 },
  { top: '42%', side: 'left', offset: '15%', size: '7.5rem', delay: '0.8s', opacity: 0.4 },
  { top: '46%', side: 'left', offset: '38%', size: '5.5rem', delay: '4.5s', opacity: 0.5 },
  { top: '66%', side: 'right', offset: '24%', size: '6.5rem', delay: '2.6s', opacity: 0.45 },
  { top: '70%', side: 'left', offset: '30%', size: '6rem', delay: '3.2s', opacity: 0.4 },
  { top: '86%', side: 'right', offset: '18%', size: '7rem', delay: '1.6s', opacity: 0.45 },
] as const

const LandingPage = () => {
  const { t } = useTranslation()
  // Signed-in visitors still see the landing page; their CTA enters the app
  // instead of routing to the auth form.
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return (
    <Shell>
      <Clouds aria-hidden>
        {CLOUDS.map((cloud, index) => (
          <Cloud
            key={index}
            src={CLOUD_IMAGE}
            alt=""
            $top={cloud.top}
            $side={cloud.side}
            $offset={cloud.offset}
            $size={cloud.size}
            $delay={cloud.delay}
            $opacity={cloud.opacity}
          />
        ))}
        {DESKTOP_CLOUDS.map((cloud, index) => (
          <Cloud
            key={`desktop-${index}`}
            src={CLOUD_IMAGE}
            alt=""
            $top={cloud.top}
            $side={cloud.side}
            $offset={cloud.offset}
            $size={cloud.size}
            $delay={cloud.delay}
            $opacity={cloud.opacity}
            $desktopOnly
          />
        ))}
      </Clouds>

      <Header>
        <TutorialLink to="/onboarding">{t('landing.tutorial')}</TutorialLink>
        <HeaderControls>
          <LanguageSwitcher />
          <ThemeToggle />
        </HeaderControls>
      </Header>

      <Content>
        <Title>Feelio</Title>
        <Tagline>{t('landing.tagline')}</Tagline>
        <HeroImage src={CHARACTER_IMAGE} alt={t('landing.characterAlt')} />
      </Content>

      <Footer>
        <PlayButton to={isAuthenticated ? '/home' : '/auth'}>
          {isAuthenticated ? t('landing.enter') : t('landing.cta')}
        </PlayButton>
      </Footer>
    </Shell>
  )
}

export default LandingPage
