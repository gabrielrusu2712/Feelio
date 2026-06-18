import { STAT_KEYS } from '@/user/data-access/store/user.constants'
import type { Stats } from '@/user/data-access/store/user.types'

export const Mood = {
  SAD: 0,
  NORMAL: 1,
  GOOD: 2,
  GREAT: 3,
} as const

export type MoodValue = (typeof Mood)[keyof typeof Mood]

// Average completion across all stats, clamped to 100.
export const avgPercent = (stats: Stats, targets: Stats): number => {
  const total = STAT_KEYS.reduce((sum, key) => {
    const target = targets[key] || 1
    return sum + (stats[key] / target) * 100
  }, 0)

  return Math.min(Math.round(total / STAT_KEYS.length), 100)
}

// Buckets matching the source: >80 great, >50 good, >20 normal, else sad.
export const percentToMood = (percent: number): MoodValue => {
  if (percent > 80) return Mood.GREAT
  if (percent > 50) return Mood.GOOD
  if (percent > 20) return Mood.NORMAL
  return Mood.SAD
}
