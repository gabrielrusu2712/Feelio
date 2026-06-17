import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import HomePage from '@/home/features/home-page/home-page'

describe('HomePage', () => {
  it('renders the translated title and idle loading state', () => {
    renderWithProviders(<HomePage />)

    expect(screen.getByRole('heading', { name: 'Home Page' })).toBeInTheDocument()
    expect(screen.getByText(/idle/i)).toBeInTheDocument()
  })

  it('toggles the loading state through the store', async () => {
    const { user, store } = renderWithProviders(<HomePage />)

    expect(screen.getByText(/idle/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /toggle loading/i }))

    expect(store.getState().ui.loading).toBe(true)
    expect(screen.queryByText(/idle/i)).not.toBeInTheDocument()
  })
})
