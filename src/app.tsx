import { GlobalStyle } from '@/global-style'
import { ThemeProvider } from '@/core/providers/theme-provider/theme-provider'
import AppRoutes from '@/core/routes/routes'
import { Provider } from 'react-redux'
import { store } from '@/core/store'

const AppContent = () => {
  return <AppRoutes />
}

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyle />
        <AppContent />
      </ThemeProvider>
    </Provider>
  )
}

export default App
