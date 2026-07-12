import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useInstallPrompt } from '@/shared/data-access/hooks/use-install-prompt'
import { STORAGE_KEYS } from '@/shared/data-access/utils/local-storage'

const setUserAgent = (ua: string) => {
  Object.defineProperty(window.navigator, 'userAgent', { value: ua, configurable: true })
}

// jsdom's default matchMedia mock reports standalone=false; keep it explicit.
const mockNotStandalone = () => {
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

describe('useInstallPrompt', () => {
  beforeEach(() => {
    localStorage.clear()
    mockNotStandalone()
  })
  afterEach(() => vi.restoreAllMocks())

  it('offers nothing on a plain desktop UA (waits for beforeinstallprompt)', () => {
    setUserAgent('Mozilla/5.0 (X11; Linux x86_64) Chrome/120 Safari/537.36')
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.kind).toBe('none')
  })

  it('shows the manual hint on iOS Safari', () => {
    setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
    )
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.kind).toBe('ios')
  })

  it('does not show the hint for Chrome on iOS (CriOS)', () => {
    setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/120 Mobile/15E148 Safari/604.1',
    )
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.kind).toBe('none')
  })

  it('stays hidden once dismissed (persisted flag)', () => {
    setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
    )
    const first = renderHook(() => useInstallPrompt())
    act(() => first.result.current.dismiss())
    expect(first.result.current.kind).toBe('none')

    // A fresh mount reads the persisted dismissal and offers nothing.
    const second = renderHook(() => useInstallPrompt())
    expect(second.result.current.kind).toBe('none')
    expect(localStorage.getItem(STORAGE_KEYS.INSTALL_DISMISSED)).toBe('true')
  })
})
