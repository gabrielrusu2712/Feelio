import { afterEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePanelOrder } from '@/shared/data-access/hooks/use-panel-order'
import { STORAGE_KEYS } from '@/shared/data-access/utils/local-storage'

const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PANEL_ORDER) ?? '{}')

describe('usePanelOrder', () => {
  afterEach(() => localStorage.clear())

  it('defaults the desktop order', () => {
    const { result } = renderHook(() => usePanelOrder())
    expect(result.current.desktopOrder).toEqual(['character', 'bars', 'content'])
  })

  it('reorders the desktop panels and persists', () => {
    const { result } = renderHook(() => usePanelOrder())

    act(() => result.current.reorderDesktop('character', 'content'))

    expect(result.current.desktopOrder).toEqual(['bars', 'content', 'character'])
    expect(stored().desktop).toEqual(['bars', 'content', 'character'])
  })

  it('falls back to defaults when stored data is malformed', () => {
    localStorage.setItem(
      STORAGE_KEYS.PANEL_ORDER,
      JSON.stringify({ desktop: ['character', 'oops'] }),
    )
    const { result } = renderHook(() => usePanelOrder())
    expect(result.current.desktopOrder).toEqual(['character', 'bars', 'content'])
  })
})
