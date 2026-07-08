import { Hero, HeroImage, Subtitle, Title } from '@/auth/ui/auth-hero/auth-hero.styled'

const HERO_IMAGE = '/assets/auth/panda-welcome.png'

interface AuthHeroProps {
  title: string
  subtitle: string
  imageAlt: string
}

const AuthHero = (props: AuthHeroProps) => {
  const { title, subtitle, imageAlt } = props

  return (
    <Hero>
      <HeroImage src={HERO_IMAGE} alt={imageAlt} width={1049} height={1008} />
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </Hero>
  )
}

export default AuthHero
