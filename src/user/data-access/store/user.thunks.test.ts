import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the whole user.api module (all named exports user.thunks imports at load).
vi.mock('@/user/data-access/api/user.api', () => ({
  updateUserDocument: vi.fn().mockResolvedValue(undefined),
  saveDailyMoodSnapshot: vi.fn().mockResolvedValue(undefined),
  fetchUserDocument: vi.fn(),
  normalizeStats: (stats: unknown) => stats,
  recordLoginDay: vi.fn().mockResolvedValue(undefined),
}))

import { setupStore } from '@/core/store'
import { setUserData } from '@/user/data-access/store/user.slice'
import { saveStatsThunk } from '@/user/data-access/store/user.thunks'
import { saveDailyMoodSnapshot, updateUserDocument } from '@/user/data-access/api/user.api'
import { STAT_TARGETS } from '@/user/data-access/store/user.constants'
import { avgPercent, percentToMood } from '@/user/data-access/utils/mood'
import { toDateKey } from '@/user/data-access/utils/date-key'

describe('saveStatsThunk', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('persists the stats doc and today’s dailyMoods snapshot (avgPercent + mood)', async () => {
    const store = setupStore()
    const stats = { sleep: 4, water: 5, food: 2, sport: 15, wellbeing: 3 }
    store.dispatch(
      setUserData({ username: 'ana', stats, totalDays: 1, xp: 0, playerLevel: 1, totalStars: 0 }),
    )

    await store.dispatch(saveStatsThunk({ uid: 'u1' }))

    const today = toDateKey()
    const percent = avgPercent(stats, STAT_TARGETS)
    expect(updateUserDocument).toHaveBeenCalledWith('u1', { stats, lastVisitDate: today })
    expect(saveDailyMoodSnapshot).toHaveBeenCalledWith('u1', today, percent, percentToMood(percent))
  })
})
