import { describe, expect, it } from 'vitest'
import uiReducer, { setLoading } from '@/core/store/ui/ui.slice'

describe('ui slice', () => {
  it('starts not loading', () => {
    const state = uiReducer(undefined, { type: '@@INIT' })

    expect(state.loading).toBe(false)
  })

  it('sets the loading flag', () => {
    const state = uiReducer({ loading: false }, setLoading(true))

    expect(state.loading).toBe(true)
  })
})
