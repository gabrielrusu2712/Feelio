import LandingPage from '@/landing/ui/landing-page/landing-page'
import OnboardingPage from '@/onboarding/features/onboarding-page/onboarding-page'
import AuthPage from '@/auth/features/auth-page/auth-page'
import AppLayout from '@/shared/features/app-layout/app-layout'
import { Navigate, Route, Routes } from 'react-router'
import { AuthGuard, GuestGuard } from '@/core/routes/guards'
import { AUTHED_PATHS } from '@/shared/data-access/constants/content-views'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public informational pages — shown whether or not you're signed in, so
          a logged-in user landing on the site (or PWA) still sees the home
          screen and can browse the tutorial. */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Guest-only routes (redirect to /home if authenticated) */}
      <Route element={<GuestGuard />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Authenticated app shell. AppLayout stays mounted across these paths and
          derives the active destination from the URL; each path is a marker. */}
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          {AUTHED_PATHS.map((path) => (
            <Route key={path} path={path} element={null} />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default AppRoutes
