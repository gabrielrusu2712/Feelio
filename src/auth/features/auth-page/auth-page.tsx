import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store'
import {
  clearAuthError,
  loginThunk,
  registerThunk,
  selectAuthError,
  selectAuthStatus,
} from '@/auth/data-access/store'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'
import ThemeToggle from '@/shared/features/theme-toggle/theme-toggle'
import AuthHero from '@/auth/ui/auth-hero/auth-hero'
import AuthForm from '@/auth/ui/auth-form/auth-form'
import { BackButton, Panel, Shell, TopControls } from '@/auth/features/auth-page/auth-page.styled'

const AuthPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const error = useAppSelector(selectAuthError)
  const status = useAppSelector(selectAuthStatus)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const isSubmitting = status === 'pending'

  const handleSubmit = () => {
    if (isRegistering && password !== confirmPassword) {
      setFormError('auth.error.passwordMismatch')
      return
    }
    setFormError(null)
    const thunk = isRegistering ? registerThunk : loginThunk
    void dispatch(thunk({ email, password }))
  }

  const toggleMode = () => {
    setIsRegistering((previous) => !previous)
    setConfirmPassword('')
    setFormError(null)
    dispatch(clearAuthError())
  }

  const displayedError = formError ?? error

  return (
    <Shell>
      <BackButton type="button" onClick={() => navigate('/')}>
        {t('auth.backHome')}
      </BackButton>
      <TopControls>
        <LanguageSwitcher />
        <ThemeToggle />
      </TopControls>

      <Panel>
        <AuthHero
          title={isRegistering ? t('auth.registerHeader') : t('auth.loginHeader')}
          subtitle={isRegistering ? t('auth.registerSubtitle') : t('auth.loginSubtitle')}
          imageAlt={t('auth.heroAlt')}
        />
        <AuthForm
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          showConfirmPassword={isRegistering}
          emailLabel={t('auth.emailLabel')}
          passwordLabel={t('auth.passwordLabel')}
          confirmPasswordLabel={t('auth.confirmPasswordLabel')}
          emailPlaceholder={t('auth.emailPlaceholder')}
          passwordPlaceholder={t('auth.passwordPlaceholder')}
          confirmPasswordPlaceholder={t('auth.confirmPasswordPlaceholder')}
          submitLabel={isRegistering ? t('auth.register') : t('auth.login')}
          toggleLabel={isRegistering ? t('auth.toggleToLogin') : t('auth.toggleToRegister')}
          error={displayedError ? t(displayedError, { defaultValue: displayedError }) : null}
          isSubmitting={isSubmitting}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleSubmit}
          onToggle={toggleMode}
        />
      </Panel>
    </Shell>
  )
}

export default AuthPage
