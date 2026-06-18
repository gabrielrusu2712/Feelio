import { describe, expect, it } from 'vitest'
import { Mood, avgPercent, percentToMood } from '@/user/data-access/utils/mood'
import type { Stats } from '@/user/data-access/store/user.types'

const targets: Stats = { sleep: 8, water: 8, food: 3, sport: 1, wellbeing: 5 }

describe('avgPercent', () => {
  it('is 0 when all stats are 0', () => {
    expect(avgPercent({ sleep: 0, water: 0, food: 0, sport: 0, wellbeing: 0 }, targets)).toBe(0)
  })

  it('is 100 when every stat meets its target', () => {
    expect(avgPercent({ ...targets }, targets)).toBe(100)
  })

  it('clamps overshoot to 100', () => {
    expect(avgPercent({ sleep: 99, water: 99, food: 99, sport: 99, wellbeing: 99 }, targets)).toBe(
      100,
    )
  })
})

describe('percentToMood', () => {
  it('buckets at the 20/50/80 boundaries', () => {
    expect(percentToMood(0)).toBe(Mood.SAD)
    expect(percentToMood(20)).toBe(Mood.SAD)
    expect(percentToMood(21)).toBe(Mood.NORMAL)
    expect(percentToMood(50)).toBe(Mood.NORMAL)
    expect(percentToMood(51)).toBe(Mood.GOOD)
    expect(percentToMood(80)).toBe(Mood.GOOD)
    expect(percentToMood(81)).toBe(Mood.GREAT)
    expect(percentToMood(100)).toBe(Mood.GREAT)
  })
})
