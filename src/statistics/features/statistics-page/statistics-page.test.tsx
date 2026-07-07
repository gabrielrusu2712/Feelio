import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import StatisticsPage from '@/statistics/features/statistics-page/statistics-page'

// Rendered without an authenticated uid, so the per-day Firestore fetches are
// guarded off — this exercises the page's render path, i18n keys, chart guard, and
// the empty-data defaults deterministically.
describe('StatisticsPage', () => {
  it('renders the three dashboard sections', () => {
    renderWithProviders(<StatisticsPage />)

    expect(screen.getByRole('heading', { name: "This week's recap" })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Wellbeing evolution' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Monthly progress' })).toBeInTheDocument()
  })

  it('renders the mood summary cards and the range tabs', () => {
    renderWithProviders(<StatisticsPage />)

    expect(screen.getByText(/Great/)).toBeInTheDocument()
    expect(screen.getByText(/Sad/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Week' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Month' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Year' })).toBeInTheDocument()
  })

  it('activates a range tab when clicked', async () => {
    const { user } = renderWithProviders(<StatisticsPage />)

    const weekTab = screen.getByRole('button', { name: 'Week' })
    const monthTab = screen.getByRole('button', { name: 'Month' })
    expect(weekTab).toHaveAttribute('aria-pressed', 'true')
    expect(monthTab).toHaveAttribute('aria-pressed', 'false')

    await user.click(monthTab)

    expect(monthTab).toHaveAttribute('aria-pressed', 'true')
    expect(weekTab).toHaveAttribute('aria-pressed', 'false')
  })
})
