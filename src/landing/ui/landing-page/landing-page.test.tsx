import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import LandingPage from '@/landing/ui/landing-page/landing-page'

describe('LandingPage', () => {
  it('renders the brand, tagline and navigation targets', () => {
    renderWithProviders(<LandingPage />)

    expect(screen.getByRole('heading', { name: 'Feelio' })).toBeInTheDocument()
    expect(screen.getByText('Your daily well-being companion.')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Tutorial' })).toHaveAttribute('href', '/onboarding')
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/auth')
  })

  it('renders the shared theme and language controls', () => {
    renderWithProviders(<LandingPage />)

    expect(screen.getByRole('button', { name: 'Change theme' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Română|English/ })).toBeInTheDocument()
  })
})
