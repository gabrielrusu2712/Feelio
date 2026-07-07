import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Initialize the shared i18next instance so useTranslation() resolves keys in tests.
import '@/core/i18n'

// jsdom does not implement matchMedia; ThemeProvider reads it on mount.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// jsdom has no canvas 2D context. Chart-bearing pages (statistics) guard on a null
// context and skip rendering the chart, so stub getContext to null — this keeps
// those pages renderable in tests and silences jsdom's "Not implemented" noise.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext

// jsdom has no ResizeObserver; layout-observing components (e.g. sky-climb's bear
// positioning) construct one on mount. Stub it so those components render in tests.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof ResizeObserver
}

afterEach(() => {
  cleanup()
})
