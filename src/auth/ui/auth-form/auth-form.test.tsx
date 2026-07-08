import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import AuthForm from '@/auth/ui/auth-form/auth-form'

// Fresh props (with fresh mocks) per call so call counts never leak between tests.
const makeProps = (overrides: Partial<Parameters<typeof AuthForm>[0]> = {}) => ({
  email: '',
  password: '',
  confirmPassword: '',
  showConfirmPassword: false,
  emailLabel: 'Email',
  passwordLabel: 'Password',
  confirmPasswordLabel: 'Confirm password',
  emailPlaceholder: 'Email',
  passwordPlaceholder: 'Password',
  confirmPasswordPlaceholder: 'Confirm password',
  submitLabel: 'Login',
  toggleLabel: 'Register',
  error: null,
  isSubmitting: false,
  onEmailChange: vi.fn(),
  onPasswordChange: vi.fn(),
  onConfirmPasswordChange: vi.fn(),
  onSubmit: vi.fn(),
  onToggle: vi.fn(),
  ...overrides,
})

describe('AuthForm', () => {
  it('hides the confirm-password field in login mode', () => {
    renderWithProviders(<AuthForm {...makeProps()} />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.queryByLabelText('Confirm password')).not.toBeInTheDocument()
  })

  it('shows the confirm-password field in register mode', () => {
    renderWithProviders(<AuthForm {...makeProps({ showConfirmPassword: true })} />)

    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
  })

  it('reports edits through the change callbacks', async () => {
    const props = makeProps({ showConfirmPassword: true })
    const { user } = renderWithProviders(<AuthForm {...props} />)

    await user.type(screen.getByLabelText('Email'), 'a')
    await user.type(screen.getByLabelText('Password'), 'b')
    await user.type(screen.getByLabelText('Confirm password'), 'c')

    expect(props.onEmailChange).toHaveBeenCalledWith('a')
    expect(props.onPasswordChange).toHaveBeenCalledWith('b')
    expect(props.onConfirmPasswordChange).toHaveBeenCalledWith('c')
  })

  it('calls onSubmit when the form is submitted', async () => {
    // Provide values so the required fields are valid and the browser lets the
    // submit event through.
    const props = makeProps({ email: 'sam@example.com', password: 'secret1' })
    const { user } = renderWithProviders(<AuthForm {...props} />)

    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(props.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when the toggle button is clicked', async () => {
    const props = makeProps()
    const { user } = renderWithProviders(<AuthForm {...props} />)

    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(props.onToggle).toHaveBeenCalledTimes(1)
    expect(props.onSubmit).not.toHaveBeenCalled()
  })

  it('renders the error as an alert', () => {
    renderWithProviders(<AuthForm {...makeProps({ error: 'Something went wrong' })} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })

  it('disables the submit button while submitting', () => {
    renderWithProviders(<AuthForm {...makeProps({ isSubmitting: true })} />)

    expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
  })
})
