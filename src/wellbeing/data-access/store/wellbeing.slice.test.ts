import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/wellbeing/data-access/api/wellbeing.api', () => ({
  saveChallengeProgress: vi.fn().mockResolvedValue(undefined),
  normalizeProgress: (raw: Record<string, number>) => raw,
}))

import { setupStore } from '@/core/store'
import { saveChallengeProgress } from '@/wellbeing/data-access/api/wellbeing.api'
import { setUserData } from '@/user/data-access/store/user.slice'
import { STARS_PER_LEVEL_UP } from '@/user/data-access/store/user.constants'
import wellbeingReducer, {
  advanceCategory,
  resetWellbeing,
  setCategory,
} from '@/wellbeing/data-access/store/wellbeing.slice'
import {
  awardChallengeThunk,
  loadChallengeProgressThunk,
} from '@/wellbeing/data-access/store/wellbeing.thunks'
import {
  CATEGORY_XP,
  DAILY_LEVELS,
  zeroProgress,
} from '@/wellbeing/data-access/constants/wellbeing.constants'
import type { Stats } from '@/user/data-access/store/user.types'
import type { WellbeingState } from '@/wellbeing/data-access/store/wellbeing.types'

const initialState: WellbeingState = {
  selectedCategory: 'fizic',
  completedLevels: zeroProgress(),
  status: 'idle',
  error: null,
}

const mockSave = vi.mocked(saveChallengeProgress)

const seedUser = (
  store: ReturnType<typeof setupStore>,
  over: { stats?: Partial<Stats>; xp?: number; playerLevel?: number; totalStars?: number } = {},
) => {
  store.dispatch(
    setUserData({
      username: 'ana',
      stats: { sleep: 0, water: 0, food: 0, sport: 0, wellbeing: 0, ...over.stats },
      totalDays: 1,
      xp: over.xp ?? 0,
      playerLevel: over.playerLevel ?? 1,
      totalStars: over.totalStars ?? 0,
    }),
  )
}

const seedProgress = (
  store: ReturnType<typeof setupStore>,
  progress: Partial<Record<keyof typeof CATEGORY_XP, number>> = {},
) => {
  store.dispatch(
    loadChallengeProgressThunk.fulfilled({ ...zeroProgress(), ...progress }, 'req', { uid: 'u1' }),
  )
}

describe('wellbeing slice (reducers)', () => {
  it('starts on the first category with zero progress', () => {
    expect(wellbeingReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('switches the selected category', () => {
    const state = wellbeingReducer(initialState, setCategory('social'))
    expect(state.selectedCategory).toBe('social')
  })

  it('advances a category by one level', () => {
    const state = wellbeingReducer(initialState, advanceCategory({ category: 'relaxare' }))
    expect(state.completedLevels.relaxare).toBe(1)
    expect(state.completedLevels.fizic).toBe(0)
  })

  it('caps progress at the daily total after the final level (no wrap)', () => {
    const atLast: WellbeingState = {
      ...initialState,
      completedLevels: { ...zeroProgress(), creativ: 9 },
    }
    const once = wellbeingReducer(atLast, advanceCategory({ category: 'creativ' }))
    expect(once.completedLevels.creativ).toBe(DAILY_LEVELS)
    const twice = wellbeingReducer(once, advanceCategory({ category: 'creativ' }))
    expect(twice.completedLevels.creativ).toBe(DAILY_LEVELS)
  })

  it('stores loaded progress and marks itself ready', () => {
    const action = loadChallengeProgressThunk.fulfilled(
      { fizic: 2, relaxare: 0, creativ: 0, social: 0 },
      'req',
      { uid: 'u1' },
    )
    const state = wellbeingReducer({ ...initialState, status: 'loading' }, action)
    expect(state.completedLevels.fizic).toBe(2)
    expect(state.status).toBe('ready')
  })

  it('clears back to defaults on resetWellbeing', () => {
    const populated = wellbeingReducer(initialState, advanceCategory({ category: 'fizic' }))
    expect(wellbeingReducer(populated, resetWellbeing())).toEqual(initialState)
  })
})

describe('awardChallenge economy', () => {
  beforeEach(() => {
    mockSave.mockClear()
  })

  it('awards XP, bumps the vibe stat, and advances the active level', async () => {
    const store = setupStore()
    seedUser(store)
    seedProgress(store)

    await store.dispatch(awardChallengeThunk({ uid: 'u1', category: 'fizic', level: 1 }))

    const state = store.getState()
    expect(state.user.stats.wellbeing).toBe(1)
    expect(state.user.xp).toBe(CATEGORY_XP.fizic)
    expect(state.wellbeing.completedLevels.fizic).toBe(1)
    expect(mockSave).toHaveBeenCalledTimes(1)
  })

  it('is a no-op for a non-active (locked or replayed) level', async () => {
    const store = setupStore()
    seedUser(store)
    seedProgress(store, { fizic: 0 })

    await store.dispatch(awardChallengeThunk({ uid: 'u1', category: 'fizic', level: 3 }))

    const state = store.getState()
    expect(state.user.xp).toBe(0)
    expect(state.user.stats.wellbeing).toBe(0)
    expect(state.wellbeing.completedLevels.fizic).toBe(0)
    expect(mockSave).not.toHaveBeenCalled()
  })

  it('still awards XP once the vibe stat is maxed (award-both rule)', async () => {
    const store = setupStore()
    seedUser(store, { stats: { wellbeing: 5 } })
    seedProgress(store)

    await store.dispatch(awardChallengeThunk({ uid: 'u1', category: 'relaxare', level: 1 }))

    const state = store.getState()
    expect(state.user.stats.wellbeing).toBe(5)
    expect(state.user.xp).toBe(CATEGORY_XP.relaxare)
  })

  it('rolls a level-up over and grants a batch of stars', async () => {
    const store = setupStore()
    seedUser(store, { stats: { wellbeing: 5 }, xp: 90 })
    seedProgress(store)

    await store.dispatch(awardChallengeThunk({ uid: 'u1', category: 'social', level: 1 }))

    const state = store.getState()
    expect(state.user.playerLevel).toBe(2)
    expect(state.user.xp).toBe(90 + CATEGORY_XP.social - 100)
    expect(state.user.totalStars).toBe(STARS_PER_LEVEL_UP)
  })
})
