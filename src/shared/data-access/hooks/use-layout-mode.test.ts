import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLayoutMode } from '@/shared/data-access/hooks/use-layout-mode'

const mockOrientation = (portrait: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('portrait') ? portrait : !portrait,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('useLayoutMode', () => {
  afterEach(() => vi.restoreAllMocks())

  it('is desktop in landscape', () => {
    mockOrientation(false)
    const { result } = renderHook(() => useLayoutMode())
    expect(result.current).toBe('desktop')
  })

  it('is mobile in portrait', () => {
    mockOrientation(true)
    const { result } = renderHook(() => useLayoutMode())
    expect(result.current).toBe('mobile')
  })
})
