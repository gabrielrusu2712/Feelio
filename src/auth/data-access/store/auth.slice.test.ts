import { describe, expect, it } from 'vitest'
import authReducer, { clearAuthError, setUser } from '@/auth/data-access/store/auth.slice'
import { loginThunk, logoutThunk } from '@/auth/data-access/store/auth.thunks'
import type { AuthState } from '@/auth/data-access/store/auth.types'

const baseState: AuthState = {
  user: null,
  initialized: false,
  status: 'idle',
  error: null,
}

const credentials = { email: 'a@b.com', password: 'secret' }

describe('auth slice', () => {
  it('starts uninitialized and logged out', () => {
    const state = authReducer(undefined, { type: '@@INIT' })

    expect(state).toEqual(baseState)
  })

  it('records the session and marks itself initialized on setUser', () => {
    const user = { uid: 'u1', email: 'a@b.com', displayName: 'a' }
    const state = authReducer(baseState, setUser(user))

    expect(state.user).toEqual(user)
    expect(state.initialized).toBe(true)
  })

  it('stays initialized but clears the user on a null setUser', () => {
    const loggedIn: AuthState = {
      ...baseState,
      user: { uid: 'u1', email: null, displayName: null },
    }
    const state = authReducer(loggedIn, setUser(null))

    expect(state.user).toBeNull()
    expect(state.initialized).toBe(true)
  })

  it('marks pending and clears any prior error when an action starts', () => {
    const failed: AuthState = { ...baseState, status: 'failed', error: 'auth.error.unknown' }
    const state = authReducer(failed, loginThunk.pending('req', credentials))

    expect(state.status).toBe('pending')
    expect(state.error).toBeNull()
  })

  it('captures the rejected payload as the error message', () => {
    const action = loginThunk.rejected(null, 'req', credentials, 'auth.error.unknown')
    const state = authReducer(baseState, action)

    expect(state.status).toBe('failed')
    expect(state.error).toBe('auth.error.unknown')
  })

  it('clears the error explicitly', () => {
    const failed: AuthState = { ...baseState, error: 'auth.error.unknown' }

    expect(authReducer(failed, clearAuthError()).error).toBeNull()
  })

  it('resets status to idle after logout succeeds', () => {
    const succeeded: AuthState = { ...baseState, status: 'succeeded' }
    const state = authReducer(succeeded, logoutThunk.fulfilled(undefined, 'req'))

    expect(state.status).toBe('idle')
  })
})
