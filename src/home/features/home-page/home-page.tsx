import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store'
import { selectLoading, setLoading } from '@/core/store/ui'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'

const HomePage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectLoading)
  const { t } = useTranslation()

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    navigate('/')
  }

  const handleToggleLoading = () => {
    dispatch(setLoading(!isLoading))
  }

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <LanguageSwitcher />
      <p>Loading state: {isLoading ? '⏳ Loading...' : '✅ Idle'}</p>
      <button type="button" onClick={handleToggleLoading}>
        Toggle Loading
      </button>
      <button type="button" onClick={handleLogout}>
        🚪 {t('common.logout')}
      </button>
    </div>
  )
}

export default HomePage
