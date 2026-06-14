import LandingPage from '@/landing/ui/landing-page/landing-page'
import OnboardingPage from '@/onboarding/ui/onboarding-page/onboarding-page'
import AuthPage from '@/auth/features/auth-page/auth-page'
import HomePage from '@/home/features/home-page/home-page'
import { Route, Routes } from 'react-router'
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

      {/* Authenticated routes */}
      <Route element={<AuthGuard />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/statistics" element={<div>Statistics Page</div>} />
        <Route path="/explore" element={<div>Explore Page</div>} />
        <Route path="/album" element={<div>Album Page</div>} />
        <Route path="/diary" element={<div>Diary Page</div>} />
        <Route path="/chat" element={<div>Chat Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        <Route path="/about-us" element={<div>About Us Page</div>} />
      </Route>

      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes
