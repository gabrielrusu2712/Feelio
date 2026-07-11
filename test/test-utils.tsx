import type { PropsWithChildren, ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { ThemeProvider } from '@/core/providers/theme-provider/theme-provider'
import { setupStore } from '@/core/store/store'
import type { AppStore, RootState } from '@/core/store/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
  route?: string
}

/**
 * Renders a component wrapped in the app-wide providers (Redux store,
 * styled-components theme, and a routing context). Returns the created store
 * plus a pre-configured userEvent instance alongside the usual RTL result.
 */
export const renderWithProviders = (ui: ReactElement, options: ExtendedRenderOptions = {}) => {
  const {
    preloadedState,
    store = setupStore(preloadedState),
    route = '/',
    ...renderOptions
  } = options

  const Wrapper = (props: PropsWithChildren) => {
    const { children } = props

    return (
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    )
  }

  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// Re-export everything from RTL so tests import from a single module.
export * from '@testing-library/react'
