import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { setupStore } from '@/core/store'
import { setUserData } from '@/user/data-access/store'
import AppLayout from '@/shared/features/app-layout/app-layout'

const storeWithUser = () => {
  const store = setupStore()
  store.dispatch(
    setUserData({
      username: 'ana',
      stats: { sleep: 4, water: 2, food: 1, sport: 0, wellbeing: 3 },
      totalDays: 3,
      totalStars: 0,
    }),
  )
  return store
}

// jsdom matchMedia is mocked to landscape (matches: false) in test setup → desktop.
describe('AppLayout', () => {
  it('shows the username and day counter in the fixed top bar', () => {
    renderWithProviders(<AppLayout />, { store: storeWithUser() })

    expect(screen.getByText('ana')).toBeInTheDocument()
    expect(screen.getByText('Day 3')).toBeInTheDocument()
  })

  it('shows the default Stats view active and lists views in the page menu', async () => {
    const { user } = renderWithProviders(<AppLayout />, { store: storeWithUser() })

    // The active view label is shown in the content header.
    expect(screen.getByText('Stats')).toBeInTheDocument()

    // Views live behind the "…" menu, not a tab row.
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('menuitem', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Explore' })).toBeInTheDocument()
  })

  it('opens the settings overlay from the top-bar button', async () => {
    const { user } = renderWithProviders(<AppLayout />, { store: storeWithUser() })

    await user.click(screen.getByRole('button', { name: 'Open settings' }))

    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
  })

  describe('portrait (mobile) layout', () => {
    afterEach(() => vi.restoreAllMocks())

    it('renders the stacked mobile shell with the panels and page menu', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('portrait'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      renderWithProviders(<AppLayout />, { store: storeWithUser() })

      expect(screen.getByText('ana')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
    })
  })
})
