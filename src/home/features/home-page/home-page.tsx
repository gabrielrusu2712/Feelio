import { useTranslation } from 'react-i18next'
import { signOut } from 'firebase/auth'
import { auth } from '@/core/services/firebase'
import { useAppDispatch, useAppSelector } from '@/core/store'
import { selectLoading, setLoading } from '@/core/store/ui'
import { selectUser } from '@/core/store/auth'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'

const HomePage = () => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectLoading)
  const user = useAppSelector(selectUser)
  const { t } = useTranslation()

  const handleLogout = () => {
    signOut(auth)
  }

  const handleToggleLoading = () => {
    dispatch(setLoading(!isLoading))
  }

  return (
    <div>
      <h1>{t('home.title')}</h1>
      {user?.displayName && <p>👋 Hello, {user.displayName}!</p>}
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
