import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store'
import {
  clearAuthError,
  loginThunk,
  registerThunk,
  selectAuthError,
  selectAuthStatus,
} from '@/auth/data-access/store'

const AuthPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectAuthError)
  const status = useAppSelector(selectAuthStatus)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const isSubmitting = status === 'pending'

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const thunk = isRegistering ? registerThunk : loginThunk
    void dispatch(thunk({ email, password }))
  }

  const toggleMode = () => {
    setIsRegistering((previous) => !previous)
    dispatch(clearAuthError())
  }

  return (
    <div>
      <h1>{t('auth.title')}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{t(error, { defaultValue: error })}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isRegistering ? t('auth.register') : t('auth.login')}
        </button>
      </form>
      <button type="button" onClick={toggleMode}>
        {isRegistering ? t('auth.toggleToLogin') : t('auth.toggleToRegister')}
      </button>
    </div>
  )
}

export default AuthPage
