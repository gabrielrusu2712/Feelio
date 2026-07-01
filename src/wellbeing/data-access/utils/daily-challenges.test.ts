import { describe, expect, it } from 'vitest'
import { pickDailyChallengeKeys } from '@/wellbeing/data-access/utils/daily-challenges'
import {
  CHALLENGE_KEYS,
  CHALLENGE_POOL_SIZE,
} from '@/wellbeing/data-access/constants/challenge-pool'
import { DAILY_LEVELS } from '@/wellbeing/data-access/constants/wellbeing.constants'

describe('challenge pool', () => {
  it('has CHALLENGE_POOL_SIZE keys per category, larger than the daily levels', () => {
    expect(CHALLENGE_POOL_SIZE).toBeGreaterThan(DAILY_LEVELS)
    for (const keys of Object.values(CHALLENGE_KEYS)) {
      expect(keys).toHaveLength(CHALLENGE_POOL_SIZE)
    }
  })
})

describe('pickDailyChallengeKeys', () => {
  it('returns exactly the daily number of levels', () => {
    expect(pickDailyChallengeKeys('fizic', '28.06.2026')).toHaveLength(DAILY_LEVELS)
  })

  it('is deterministic for the same day + category', () => {
    const a = pickDailyChallengeKeys('relaxare', '28.06.2026')
    const b = pickDailyChallengeKeys('relaxare', '28.06.2026')
    expect(a).toEqual(b)
  })

  it('rotates across days (not identical day to day)', () => {
    const today = pickDailyChallengeKeys('social', '28.06.2026')
    const tomorrow = pickDailyChallengeKeys('social', '29.06.2026')
    expect(today).not.toEqual(tomorrow)
  })

  it('picks distinct challenges drawn from the category pool', () => {
    const picks = pickDailyChallengeKeys('creativ', '28.06.2026')
    expect(new Set(picks).size).toBe(picks.length)
    for (const key of picks) {
      expect(CHALLENGE_KEYS.creativ).toContain(key)
    }
  })
})
