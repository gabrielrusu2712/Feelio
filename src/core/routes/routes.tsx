import LandingPage from '@/landing/ui/landing-page/landing-page'
import OnboardingPage from '@/onboarding/ui/onboarding-page/onboarding-page'
import AuthPage from '@/auth/features/auth-page/auth-page'
import AppLayout from '@/shared/features/app-layout/app-layout'
import { Navigate, Route, Routes } from 'react-router'
import { AuthGuard, GuestGuard } from '@/core/routes/guards'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Guest-only routes (redirect to /home if authenticated) */}
      <Route element={<GuestGuard />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Authenticated app shell. Content (stats/explore/album/…) switches
          inside the shell's content panel rather than via separate routes. */}
      <Route element={<AuthGuard />}>
        <Route path="/home" element={<AppLayout />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default AppRoutes
