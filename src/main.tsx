import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/core/theme/tokens/css/base.css'
import '@/core/theme/tokens/css/light.css'
import '@/core/theme/tokens/css/dark.css'
import App from '@/app'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
