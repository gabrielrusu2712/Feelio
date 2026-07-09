import {
  Description,
  HeroImage,
  ScreenshotImage,
  SlideRoot,
  StartButton,
  Title,
} from '@/onboarding/ui/tutorial-slide/tutorial-slide.styled'

interface TutorialSlideProps {
  title: string
  description: string
  image: {
    src: string
    alt: string
    variant: 'hero' | 'screenshot'
  }
  /** Only the final slide gets a call-to-action button. */
  cta?: {
    label: string
    onClick: () => void
  }
}

// Dumb: one carousel slide — a title, a description, and either the
// character portrait or a bordered app screenshot.
const TutorialSlide = (props: TutorialSlideProps) => {
  const { title, description, image, cta } = props

  return (
    <SlideRoot>
      <Title>{title}</Title>
      {image.variant === 'hero' ? (
        <HeroImage src={image.src} alt={image.alt} />
      ) : (
        <ScreenshotImage src={image.src} alt={image.alt} />
      )}
      <Description>{description}</Description>
      {cta && (
        <StartButton type="button" onClick={cta.onClick}>
          {cta.label}
        </StartButton>
      )}
    </SlideRoot>
  )
}

export default TutorialSlide
