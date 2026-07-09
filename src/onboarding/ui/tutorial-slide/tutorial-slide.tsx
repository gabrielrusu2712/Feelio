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
  /**
   * Whether this is the slide currently shown. Off-screen slides stay in the
   * DOM (the track slides via translateX), so inactive ones are made `inert`
   * and `aria-hidden` — otherwise a keyboard user could tab onto the hidden
   * CTA and a screen reader would read all slides at once.
   */
  active: boolean
  /** Only the final slide gets a call-to-action button. */
  cta?: {
    label: string
    onClick: () => void
  }
}

// Dumb: one carousel slide — a title, a description, and either the
// character portrait or a bordered app screenshot.
const TutorialSlide = (props: TutorialSlideProps) => {
  const { title, description, image, active, cta } = props

  return (
    <SlideRoot aria-hidden={!active} inert={!active}>
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
