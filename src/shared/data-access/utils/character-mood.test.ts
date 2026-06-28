import { describe, expect, it } from 'vitest'
import { getCharacterMood } from '@/shared/data-access/utils/character-mood'
import type { Stats } from '@/user/data-access/store'

const targets: Stats = { water: 8, sleep: 8, food: 3, sport: 1, wellbeing: 5 }

describe('getCharacterMood', () => {
  it('is happy when all four core targets are met', () => {
    const stats: Stats = { water: 8, sleep: 8, food: 3, sport: 1, wellbeing: 0 }

    expect(getCharacterMood(stats, targets, 10)).toBe('happy')
  })

  it('is sad in the afternoon with barely any water/sleep', () => {
    const stats: Stats = { water: 1, sleep: 0, food: 0, sport: 0, wellbeing: 0 }

    expect(getCharacterMood(stats, targets, 15)).toBe('sad')
  })

  it('is neutral in the morning even with low stats', () => {
    const stats: Stats = { water: 1, sleep: 0, food: 0, sport: 0, wellbeing: 0 }

    expect(getCharacterMood(stats, targets, 9)).toBe('base')
  })

  it('is neutral when targets are partially met', () => {
    const stats: Stats = { water: 8, sleep: 8, food: 0, sport: 0, wellbeing: 0 }

    expect(getCharacterMood(stats, targets, 16)).toBe('base')
  })
})
