import { GlobalStyle } from '@/global-style'
import { ThemeProvider } from '@/core/providers/theme-provider/theme-provider'
import ErrorBoundary from '@/core/providers/error-boundary/error-boundary'
import AppRoutes from '@/core/routes/routes'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/core/store'
import { useAuthListener } from '@/auth/data-access/hooks/use-auth-listener'
import Splash from '@/shared/ui/splash/splash'

const AppContent = () => {
  useAuthListener()

  return <AppRoutes />
}

// ThemeProvider sits outside PersistGate so the rehydration splash is themed.
// ErrorBoundary is outermost so a crash anywhere shows a message, not a blank.
const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <GlobalStyle />
          <PersistGate loading={<Splash />} persistor={persistor}>
            <AppContent />
          </PersistGate>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
