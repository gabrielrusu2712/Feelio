import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import type * as ReactRouter from 'react-router'
import { renderWithProviders } from '@/test/test-utils'
import OnboardingPage from '@/onboarding/features/onboarding-page/onboarding-page'
import { TUTORIAL_SLIDES } from '@/onboarding/data-access/constants/tutorial-slides'

// react-router's useNavigate is mocked so we can assert where close / start go
// without needing a full route tree.
const navigateMock = vi.fn()
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>()
  return { ...actual, useNavigate: () => navigateMock }
})

const firstSlideTitle = 'Feelio'
const lastSlideTitle = "Let's go!"

describe('OnboardingPage', () => {
  it('starts on the first slide with the prev control disabled', () => {
    renderWithProviders(<OnboardingPage />)

    expect(screen.getByRole('heading', { name: firstSlideTitle })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled()
  })

  it('renders one dot per slide', () => {
    renderWithProviders(<OnboardingPage />)

    const dots = screen.getAllByRole('button', { name: /Go to slide/ })
    expect(dots).toHaveLength(TUTORIAL_SLIDES.length)
  })

  it('advances to the next slide and marks its dot current', async () => {
    const { user } = renderWithProviders(<OnboardingPage />)

    await user.click(screen.getByRole('button', { name: 'Next slide' }))

    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled()
  })

  it('jumps directly to a slide when its dot is clicked, disabling next on the last', async () => {
    const { user } = renderWithProviders(<OnboardingPage />)

    await user.click(screen.getByRole('button', { name: `Go to slide ${TUTORIAL_SLIDES.length}` }))

    expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled()
  })

  it('hides inactive slides from assistive tech and keeps the CTA inert until reached', () => {
    renderWithProviders(<OnboardingPage />)

    // The final slide (with the CTA) is off-screen on mount, so its region is
    // aria-hidden and the "LET'S START!" button must not be reachable.
    const startButton = screen.getByRole('button', { name: "LET'S START!", hidden: true })
    const inactiveSlide = startButton.closest('[aria-hidden]')
    expect(inactiveSlide).toHaveAttribute('aria-hidden', 'true')
    expect(inactiveSlide).toHaveAttribute('inert')

    // The visible first slide is not hidden.
    const activeSlide = screen
      .getByRole('heading', { name: firstSlideTitle })
      .closest('[aria-hidden]')
    expect(activeSlide).toHaveAttribute('aria-hidden', 'false')
    expect(activeSlide).not.toHaveAttribute('inert')
  })

  it('navigates to /auth from the CTA on the final slide', async () => {
    const { user } = renderWithProviders(<OnboardingPage />)

    await user.click(screen.getByRole('button', { name: `Go to slide ${TUTORIAL_SLIDES.length}` }))

    const lastSlide = screen.getByRole('heading', { name: lastSlideTitle }).closest('[aria-hidden]')
    expect(lastSlide).toHaveAttribute('aria-hidden', 'false')

    await user.click(within(lastSlide as HTMLElement).getByRole('button', { name: "LET'S START!" }))
    expect(navigateMock).toHaveBeenCalledWith('/auth')
  })

  it('navigates to the landing page when closed', async () => {
    const { user } = renderWithProviders(<OnboardingPage />)

    await user.click(screen.getByRole('button', { name: 'Close tutorial' }))
    expect(navigateMock).toHaveBeenCalledWith('/')
  })
})
