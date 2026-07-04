import { describe, expect, it } from 'vitest'
import userReducer, {
  adjustStars,
  adjustStat,
  awardXp,
  resetUserData,
  setUserData,
} from '@/user/data-access/store/user.slice'
import { loadUserDataThunk } from '@/user/data-access/store/user.thunks'
import {
  DEFAULT_STATS,
  STARS_PER_LEVEL_UP,
  STAT_TARGETS,
} from '@/user/data-access/store/user.constants'
import type { UserProfile, UserState } from '@/user/data-access/store/user.types'

const initialState: UserState = {
  username: null,
  stats: DEFAULT_STATS,
  totalDays: 1,
  xp: 0,
  playerLevel: 1,
  totalStars: 0,
  status: 'idle',
  error: null,
}

const profile: UserProfile = {
  username: 'ana',
  stats: { sleep: 3, water: 2, food: 1, sport: 0, wellbeing: 4 },
  totalDays: 7,
  xp: 40,
  playerLevel: 2,
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

  it('increments a stat by its delta', () => {
    const state = userReducer(initialState, adjustStat({ key: 'water', delta: 1 }))

    expect(state.stats.water).toBe(1)
  })

  it('clamps an increment to the daily target', () => {
    const atTarget: UserState = {
      ...initialState,
      stats: { ...DEFAULT_STATS, water: STAT_TARGETS.water },
    }
    const state = userReducer(atTarget, adjustStat({ key: 'water', delta: 1 }))

    expect(state.stats.water).toBe(STAT_TARGETS.water)
  })

  it('clamps a decrement at zero', () => {
    const state = userReducer(initialState, adjustStat({ key: 'sport', delta: -10 }))

    expect(state.stats.sport).toBe(0)
  })

  it('accumulates xp below a level threshold without leveling up', () => {
    const state = userReducer(initialState, awardXp({ amount: 30 }))

    expect(state.xp).toBe(30)
    expect(state.playerLevel).toBe(1)
    expect(state.totalStars).toBe(0)
  })

  it('rolls xp over into a level-up and grants a batch of stars', () => {
    const near = userReducer({ ...initialState, xp: 80 }, awardXp({ amount: 30 }))

    expect(near.xp).toBe(10)
    expect(near.playerLevel).toBe(2)
    expect(near.totalStars).toBe(STARS_PER_LEVEL_UP)
  })

  it('clears multiple levels for an oversized xp gain', () => {
    const state = userReducer(initialState, awardXp({ amount: 250 }))

    expect(state.playerLevel).toBe(3)
    expect(state.xp).toBe(50)
    expect(state.totalStars).toBe(STARS_PER_LEVEL_UP * 2)
  })

  it('adds stars directly without touching xp/level', () => {
    const state = userReducer(initialState, adjustStars({ delta: 10 }))

    expect(state.totalStars).toBe(10)
    expect(state.xp).toBe(0)
    expect(state.playerLevel).toBe(1)
  })

  it('spends stars via a negative delta', () => {
    const state = userReducer({ ...initialState, totalStars: 10 }, adjustStars({ delta: -10 }))

    expect(state.totalStars).toBe(0)
  })

  it('clamps stars at zero', () => {
    const state = userReducer({ ...initialState, totalStars: 5 }, adjustStars({ delta: -10 }))

    expect(state.totalStars).toBe(0)
  })

  it('clears back to defaults on resetUserData', () => {
    const populated = userReducer(initialState, setUserData(profile))

    expect(userReducer(populated, resetUserData())).toEqual(initialState)
  })
})
