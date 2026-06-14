import { GlobalStyle } from '@/global-style'
import { ThemeProvider } from '@/core/providers/theme-provider/theme-provider'
import AppRoutes from '@/core/routes/routes'

const AppContent = () => {
  return <AppRoutes />
}

const App = () => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <AppContent />
    </ThemeProvider>
  )
}

export default App
