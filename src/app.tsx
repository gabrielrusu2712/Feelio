import { GlobalStyle } from '@/global-style'
import { ThemeProvider } from '@/core/providers/theme-provider/theme-provider'
import AppRoutes from '@/core/routes/routes'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/core/store'
import { useAuthListener } from '@/auth/data-access/hooks/use-auth-listener'

const AppContent = () => {
  useAuthListener()

  return <AppRoutes />
}

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <GlobalStyle />
          <AppContent />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
