import { useNavigate } from 'react-router'

const HomePage = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    navigate('/')
  }

  return (
    <div>
      <h1>Home Page</h1>
      <button type="button" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  )
}

export default HomePage
