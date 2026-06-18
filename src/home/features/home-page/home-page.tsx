import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store'
import { selectLoading, setLoading } from '@/core/store/ui'
import { logoutThunk } from '@/auth/data-access/store'
import { selectTotalDays, selectUsername } from '@/user/data-access/store'
import LanguageSwitcher from '@/shared/features/language-switcher/language-switcher'

const HomePage = () => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectLoading)
  const username = useAppSelector(selectUsername)
  const totalDays = useAppSelector(selectTotalDays)
  const { t } = useTranslation()

  const handleLogout = () => {
    void dispatch(logoutThunk())
  }

  const handleToggleLoading = () => {
    dispatch(setLoading(!isLoading))
  }

  return (
    <div>
      <h1>{t('home.title')}</h1>
      {username && <p>👋 Hello, {username}!</p>}
      <p>Day {totalDays}</p>
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
