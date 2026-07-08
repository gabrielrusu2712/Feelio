import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import ThemeToggle from '@/shared/features/theme-toggle/theme-toggle'

// Clear the persisted preference so each test starts from the 'auto' default.
beforeEach(() => {
  localStorage.clear()
})

describe('ThemeToggle', () => {
  it('cycles auto → light → dark → auto on each click', async () => {
    const { user } = renderWithProviders(<ThemeToggle />)
    const button = screen.getByRole('button', { name: 'Change theme' })

    expect(button).toHaveTextContent('🌗') // auto
    await user.click(button)
    expect(button).toHaveTextContent('☀️') // light
    await user.click(button)
    expect(button).toHaveTextContent('🌙') // dark
    await user.click(button)
    expect(button).toHaveTextContent('🌗') // back to auto
  })
})
