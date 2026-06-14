import { Navigate, Outlet } from 'react-router'

// TODO: Replace with real auth state (e.g., from context, store, or hook)
const useIsAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem('auth-token'))
}

export const AuthGuard = () => {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}

export const GuestGuard = () => {
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
