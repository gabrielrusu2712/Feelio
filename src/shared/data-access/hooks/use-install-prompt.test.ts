import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useInstallPrompt } from '@/shared/data-access/hooks/use-install-prompt'

const setUserAgent = (ua: string) => {
  Object.defineProperty(window.navigator, 'userAgent', { value: ua, configurable: true })
}

// jsdom's default matchMedia reports standalone=false; make it explicit/toggleable.
const mockDisplayMode = (standalone: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('standalone') ? standalone : false,
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
    window.__feelioBIP = null
    mockDisplayMode(false)
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

  it('offers the install button when an install event was captured', () => {
    setUserAgent('Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile Safari/537.36')
    window.__feelioBIP = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    } as never
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.kind).toBe('prompt')
  })

  it('offers nothing when already installed (standalone)', () => {
    setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
    )
    mockDisplayMode(true)
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.kind).toBe('none')
  })
})
