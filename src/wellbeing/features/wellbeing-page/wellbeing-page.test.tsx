import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import WellbeingPage from '@/wellbeing/features/wellbeing-page/wellbeing-page'

// Rendered without an authenticated uid, so the progress-load thunk is guarded off
// (completed = 0 for every category) — deterministic render/interaction coverage.
describe('WellbeingPage', () => {
  it('renders the four challenge categories', () => {
    renderWithProviders(<WellbeingPage />)

    for (const name of ['Physical', 'Relaxation', 'Creative', 'Social']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
  })

  it('renders the ten daily levels on the climb', () => {
    renderWithProviders(<WellbeingPage />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('selects a category when its pill is clicked', async () => {
    const { user } = renderWithProviders(<WellbeingPage />)

    const social = screen.getByRole('button', { name: 'Social' })
    expect(social).toHaveAttribute('aria-pressed', 'false')

    await user.click(social)

    expect(social).toHaveAttribute('aria-pressed', 'true')
  })

  it('opens the challenge modal when the active level is tapped', async () => {
    const { user } = renderWithProviders(<WellbeingPage />)

    // The active level (1) is the only clickable cloud; its button's accessible
    // name is its number.
    await user.click(screen.getByRole('button', { name: '1' }))

    expect(screen.getByRole('heading', { name: 'Level 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'I did it' })).toBeInTheDocument()
  })
})
