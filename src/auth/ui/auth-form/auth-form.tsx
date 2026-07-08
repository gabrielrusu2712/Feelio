import type { FormEvent } from 'react'
import {
  ErrorText,
  Field,
  Form,
  Input,
  SubmitButton,
  ToggleButton,
} from '@/auth/ui/auth-form/auth-form.styled'

interface AuthFormProps {
  email: string
  password: string
  confirmPassword: string
  showConfirmPassword: boolean
  emailLabel: string
  passwordLabel: string
  confirmPasswordLabel: string
  emailPlaceholder: string
  passwordPlaceholder: string
  confirmPasswordPlaceholder: string
  submitLabel: string
  toggleLabel: string
  error: string | null
  isSubmitting: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: () => void
  onToggle: () => void
}

const AuthForm = (props: AuthFormProps) => {
  const {
    email,
    password,
    confirmPassword,
    showConfirmPassword,
    emailLabel,
    passwordLabel,
    confirmPasswordLabel,
    emailPlaceholder,
    passwordPlaceholder,
    confirmPasswordPlaceholder,
    submitLabel,
    toggleLabel,
    error,
    isSubmitting,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    onToggle,
  } = props

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        {emailLabel}
        <Input
          type="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          required
        />
      </Field>
      <Field>
        {passwordLabel}
        <Input
          type="password"
          autoComplete={showConfirmPassword ? 'new-password' : 'current-password'}
          placeholder={passwordPlaceholder}
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
        />
      </Field>
      {showConfirmPassword && (
        <Field>
          {confirmPasswordLabel}
          <Input
            type="password"
            autoComplete="new-password"
            placeholder={confirmPasswordPlaceholder}
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            required
          />
        </Field>
      )}

      {error && <ErrorText role="alert">{error}</ErrorText>}

      <SubmitButton type="submit" disabled={isSubmitting}>
        {submitLabel}
      </SubmitButton>
      <ToggleButton type="button" onClick={onToggle}>
        {toggleLabel}
      </ToggleButton>
    </Form>
  )
}

export default AuthForm
