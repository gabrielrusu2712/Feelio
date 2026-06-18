import { Navigate, Outlet } from 'react-router'
import { useAppSelector } from '@/core/store'
import { selectAuthInitialized, selectIsAuthenticated } from '@/auth/data-access/store'

export const AuthGuard = () => {
  const initialized = useAppSelector(selectAuthInitialized)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!initialized) return null

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}

export const GuestGuard = () => {
  const initialized = useAppSelector(selectAuthInitialized)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!initialized) return null

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
