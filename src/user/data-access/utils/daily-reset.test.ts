import { describe, expect, it } from 'vitest'
import { applyNewDayReset } from '@/user/data-access/utils/daily-reset'
import { DEFAULT_STATS } from '@/user/data-access/store/user.constants'
import type { Stats } from '@/user/data-access/store/user.types'

const filledStats: Stats = { sleep: 5, water: 3, food: 2, sport: 1, wellbeing: 4 }

describe('applyNewDayReset', () => {
  it('zeroes stats and advances the day counter on a new day', () => {
    const result = applyNewDayReset(
      { stats: filledStats, totalDays: 4, lastVisitDate: '14.05.2026' },
      '15.05.2026',
    )

    expect(result.didReset).toBe(true)
    expect(result.stats).toEqual(DEFAULT_STATS)
    expect(result.totalDays).toBe(5)
  })

  it('leaves state untouched when the visit is the same day', () => {
    const result = applyNewDayReset(
      { stats: filledStats, totalDays: 4, lastVisitDate: '15.05.2026' },
      '15.05.2026',
    )

    expect(result.didReset).toBe(false)
    expect(result.stats).toBe(filledStats)
    expect(result.totalDays).toBe(4)
  })

  it('does not treat a first-ever visit (no lastVisitDate) as a reset', () => {
    const result = applyNewDayReset({ stats: filledStats, totalDays: 1 }, '15.05.2026')

    expect(result.didReset).toBe(false)
    expect(result.totalDays).toBe(1)
  })
})
