import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import AuthPage from '@/auth/features/auth-page/auth-page'

describe('AuthPage', () => {
  it('starts in login mode with no confirm-password field', () => {
    renderWithProviders(<AuthPage />)

    expect(screen.getByRole('button', { name: '🔑 Login' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Confirm password')).not.toBeInTheDocument()
  })

  it('reveals the confirm-password field when switching to register', async () => {
    const { user } = renderWithProviders(<AuthPage />)

    await user.click(screen.getByRole('button', { name: /Don't have an account/ }))

    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '📝 Register' })).toBeInTheDocument()
  })

  it('blocks registration and shows an error when the passwords do not match', async () => {
    const { user } = renderWithProviders(<AuthPage />)

    await user.click(screen.getByRole('button', { name: /Don't have an account/ }))
    await user.type(screen.getByLabelText('Email'), 'sam@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret1')
    await user.type(screen.getByLabelText('Confirm password'), 'secret2')
    await user.click(screen.getByRole('button', { name: '📝 Register' }))

    expect(screen.getByRole('alert')).toHaveTextContent("The passwords don't match.")
  })
})
