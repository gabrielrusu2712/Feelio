import { useNavigate } from 'react-router'

const AuthPage = () => {
  const navigate = useNavigate()

  const handleLogin = () => {
    localStorage.setItem('auth-token', 'demo-token')
    navigate('/home')
  }

  return (
    <div>
      <h1>Auth Page</h1>
      <button type="button" onClick={handleLogin}>
        🔑 Login
      </button>
    </div>
  )
}

export default AuthPage
