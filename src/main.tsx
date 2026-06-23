import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/core/i18n'
import '@/core/theme/tokens/css/base.css'
import '@/core/theme/tokens/css/light.css'
import '@/core/theme/tokens/css/dark.css'
import App from '@/app'
import { BrowserRouter } from 'react-router'

const rootElement = document.getElementById('root')!
rootElement.setAttribute('data-mounted', '1')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
