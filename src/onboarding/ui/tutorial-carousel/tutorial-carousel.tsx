import type { ReactNode } from 'react'
import {
  CarouselRoot,
  Dot,
  Dots,
  NavButton,
  NavControls,
  SlidesTrack,
  SlidesWindow,
} from '@/onboarding/ui/tutorial-carousel/tutorial-carousel.styled'

interface TutorialCarouselProps {
  /** One `TutorialSlide` element per slide, in order. */
  children: ReactNode
  totalSlides: number
  activeIndex: number
  onPrev: () => void
  onNext: () => void
  onSelectDot: (index: number) => void
  prevLabel: string
  nextLabel: string
  getDotLabel: (slideNumber: number) => string
}

// Dumb: the sliding track + dots + prev/next controls. The parent owns which
// slide is active and provides the slide elements as children.
const TutorialCarousel = (props: TutorialCarouselProps) => {
  const {
    children,
    totalSlides,
    activeIndex,
    onPrev,
    onNext,
    onSelectDot,
    prevLabel,
    nextLabel,
    getDotLabel,
  } = props

  return (
    <CarouselRoot>
      <SlidesWindow>
        <SlidesTrack $activeIndex={activeIndex}>{children}</SlidesTrack>
      </SlidesWindow>

      <NavControls>
        <NavButton
          type="button"
          aria-label={prevLabel}
          disabled={activeIndex === 0}
          onClick={onPrev}
        >
          ‹
        </NavButton>

        <Dots>
          {Array.from({ length: totalSlides }, (_, index) => (
            <Dot
              key={index}
              type="button"
              $active={index === activeIndex}
              aria-label={getDotLabel(index + 1)}
              aria-current={index === activeIndex}
              onClick={() => onSelectDot(index)}
            />
          ))}
        </Dots>

        <NavButton
          type="button"
          aria-label={nextLabel}
          disabled={activeIndex === totalSlides - 1}
          onClick={onNext}
        >
          ›
        </NavButton>
      </NavControls>
    </CarouselRoot>
  )
}

export default TutorialCarousel
