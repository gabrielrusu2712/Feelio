import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '@/shared/features/theme-toggle/theme-toggle'
import TutorialCarousel from '@/onboarding/ui/tutorial-carousel/tutorial-carousel'
import TutorialSlide from '@/onboarding/ui/tutorial-slide/tutorial-slide'
import { TUTORIAL_SLIDES } from '@/onboarding/data-access/constants/tutorial-slides'
import {
  Card,
  CloseButton,
  Shell,
  TopControls,
} from '@/onboarding/features/onboarding-page/onboarding-page.styled'

// Smart: the guest-only tutorial carousel (source: Feelio‑Judeteana's
// tutorial.html). Owns the current slide index; closing or finishing both
// leave the carousel — close returns to the landing page, finishing goes to
// auth like the landing page's own "Get started" button.
const OnboardingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)

  const lastIndex = TUTORIAL_SLIDES.length - 1

  const handlePrev = () => setActiveIndex((index) => Math.max(0, index - 1))
  const handleNext = () => setActiveIndex((index) => Math.min(lastIndex, index + 1))
  const handleStart = () => navigate('/auth')

  return (
    <Shell>
      <Card>
        <CloseButton type="button" aria-label={t('onboarding.close')} onClick={() => navigate('/')}>
          ✕
        </CloseButton>
        <TopControls>
          <ThemeToggle />
        </TopControls>

        <TutorialCarousel
          totalSlides={TUTORIAL_SLIDES.length}
          activeIndex={activeIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelectDot={setActiveIndex}
          prevLabel={t('onboarding.prev')}
          nextLabel={t('onboarding.next')}
          getDotLabel={(slideNumber) => t('onboarding.dotLabel', { number: slideNumber })}
        >
          {TUTORIAL_SLIDES.map((slide, index) => (
            <TutorialSlide
              key={slide.key}
              active={index === activeIndex}
              title={t(slide.titleKey, { defaultValue: slide.key })}
              description={t(slide.descriptionKey, { defaultValue: '' })}
              image={{
                src: slide.image.src,
                alt: t(slide.image.altKey, { defaultValue: slide.key }),
                variant: slide.image.variant,
              }}
              cta={
                index === lastIndex
                  ? { label: t('onboarding.start'), onClick: handleStart }
                  : undefined
              }
            />
          ))}
        </TutorialCarousel>
      </Card>
    </Shell>
  )
}

export default OnboardingPage
