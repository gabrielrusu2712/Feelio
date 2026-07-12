import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the whole user.api module (all named exports user.thunks imports at load).
vi.mock('@/user/data-access/api/user.api', () => ({
  updateUserDocument: vi.fn().mockResolvedValue(undefined),
  saveDailyMoodSnapshot: vi.fn().mockResolvedValue(undefined),
  fetchUserDocument: vi.fn(),
  normalizeStats: (stats: unknown) => stats,
  recordLoginDay: vi.fn().mockResolvedValue(undefined),
  changeUsername: vi.fn().mockResolvedValue(undefined),
  claimAvailableUsername: vi.fn(),
  USERNAME_TAKEN_ERROR: 'user.error.usernameTaken',
}))

import { setupStore } from '@/core/store'
import { setUser } from '@/auth/data-access/store/auth.slice'
import { setUserData } from '@/user/data-access/store/user.slice'
import { changeUsernameThunk, saveStatsThunk } from '@/user/data-access/store/user.thunks'
import {
  USERNAME_TAKEN_ERROR,
  changeUsername,
  saveDailyMoodSnapshot,
  updateUserDocument,
} from '@/user/data-access/api/user.api'
import { DEFAULT_STATS, STAT_TARGETS } from '@/user/data-access/store/user.constants'
import { avgPercent, percentToMood } from '@/user/data-access/utils/mood'
import { toDateKey } from '@/user/data-access/utils/date-key'

const seedUser = (store: ReturnType<typeof setupStore>, username: string) => {
  store.dispatch(setUser({ uid: 'u1', email: 'ana@b.com', displayName: null }))
  store.dispatch(
    setUserData({
      username,
      lastUsernameChange: null,
      stats: DEFAULT_STATS,
      totalDays: 1,
      xp: 0,
      playerLevel: 1,
      totalStars: 0,
    }),
  )
}

describe('saveStatsThunk', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('persists the stats doc and today’s dailyMoods snapshot (avgPercent + mood)', async () => {
    const store = setupStore()
    const stats = { sleep: 4, water: 5, food: 2, sport: 15, wellbeing: 3 }
    store.dispatch(
      setUserData({
        username: 'ana',
        lastUsernameChange: null,
        stats,
        totalDays: 1,
        xp: 0,
        playerLevel: 1,
        totalStars: 0,
      }),
    )

    await store.dispatch(saveStatsThunk({ uid: 'u1' }))

    const today = toDateKey()
    const percent = avgPercent(stats, STAT_TARGETS)
    expect(updateUserDocument).toHaveBeenCalledWith('u1', { stats, lastVisitDate: today })
    expect(saveDailyMoodSnapshot).toHaveBeenCalledWith('u1', today, percent, percentToMood(percent))
  })
})

describe('changeUsernameThunk', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reserves the new name and reflects it into state', async () => {
    const store = setupStore()
    seedUser(store, 'ana')

    await store.dispatch(changeUsernameThunk({ desired: 'anaMaria' }))

    expect(changeUsername).toHaveBeenCalledWith(
      expect.objectContaining({ uid: 'u1', usernameLower: 'anamaria', previousLower: 'ana' }),
    )
    expect(store.getState().user.username).toBe('anaMaria')
    expect(store.getState().user.lastUsernameChange).not.toBeNull()
  })

  it('rejects an invalid (too short) name without touching Firestore', async () => {
    const store = setupStore()
    seedUser(store, 'ana')

    const result = await store.dispatch(changeUsernameThunk({ desired: 'x' }))

    expect(result.type).toContain('rejected')
    expect(result.payload).toBe('user.error.usernameTooShort')
    expect(changeUsername).not.toHaveBeenCalled()
    expect(store.getState().user.username).toBe('ana')
  })

  it('rejects renaming to the current name', async () => {
    const store = setupStore()
    seedUser(store, 'ana')

    const result = await store.dispatch(changeUsernameThunk({ desired: 'ANA' }))

    expect(result.payload).toBe('user.error.usernameSame')
    expect(changeUsername).not.toHaveBeenCalled()
  })

  it('surfaces a taken name as its i18n error key', async () => {
    vi.mocked(changeUsername).mockRejectedValueOnce(new Error(USERNAME_TAKEN_ERROR))
    const store = setupStore()
    seedUser(store, 'ana')

    const result = await store.dispatch(changeUsernameThunk({ desired: 'taken' }))

    expect(result.payload).toBe(USERNAME_TAKEN_ERROR)
    expect(store.getState().user.username).toBe('ana')
  })
})
