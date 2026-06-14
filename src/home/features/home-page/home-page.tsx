import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/core/store'
import { selectLoading, setLoading } from '@/core/store/ui'

const HomePage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectLoading)

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    navigate('/')
  }

  const handleToggleLoading = () => {
    dispatch(setLoading(!isLoading))
  }

  return (
    <div>
      <h1>Home Page</h1>
      <p>Loading state: {isLoading ? '⏳ Loading...' : '✅ Idle'}</p>
      <button type="button" onClick={handleToggleLoading}>
        Toggle Loading
      </button>
      <button type="button" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  )
}

export default HomePage
