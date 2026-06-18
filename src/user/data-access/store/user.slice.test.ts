import { describe, expect, it } from 'vitest'
import userReducer, { resetUserData, setUserData } from '@/user/data-access/store/user.slice'
import { loadUserDataThunk } from '@/user/data-access/store/user.thunks'
import { DEFAULT_STATS } from '@/user/data-access/store/user.constants'
import type { UserProfile, UserState } from '@/user/data-access/store/user.types'

const initialState: UserState = {
  username: null,
  stats: DEFAULT_STATS,
  totalDays: 1,
  totalStars: 0,
  status: 'idle',
  error: null,
}

const profile: UserProfile = {
  username: 'ana',
  stats: { sleep: 3, water: 2, food: 1, sport: 0, wellbeing: 4 },
  totalDays: 7,
  totalStars: 25,
}

const loadArgs = { uid: 'u1', email: 'ana@b.com' }

describe('user slice', () => {
  it('starts idle with default stats', () => {
    const state = userReducer(undefined, { type: '@@INIT' })

    expect(state).toEqual(initialState)
  })

  it('stores a profile via setUserData', () => {
    const state = userReducer(initialState, setUserData(profile))

    expect(state.username).toBe('ana')
    expect(state.totalStars).toBe(25)
    expect(state.status).toBe('ready')
  })

  it('hydrates from a fulfilled load and marks itself ready', () => {
    const action = loadUserDataThunk.fulfilled(profile, 'req', loadArgs)
    const state = userReducer({ ...initialState, status: 'loading' }, action)

    expect(state.stats).toEqual(profile.stats)
    expect(state.totalDays).toBe(7)
    expect(state.status).toBe('ready')
  })

  it('records the error on a rejected load', () => {
    const action = loadUserDataThunk.rejected(null, 'req', loadArgs, 'user.error.loadFailed')
    const state = userReducer({ ...initialState, status: 'loading' }, action)

    expect(state.status).toBe('error')
    expect(state.error).toBe('user.error.loadFailed')
  })

  it('clears back to defaults on resetUserData', () => {
    const populated = userReducer(initialState, setUserData(profile))

    expect(userReducer(populated, resetUserData())).toEqual(initialState)
  })
})
