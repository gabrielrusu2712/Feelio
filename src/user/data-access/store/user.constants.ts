import type { Stats } from '@/user/data-access/store/user.types'

export const STAT_KEYS = ['sleep', 'water', 'food', 'sport', 'wellbeing'] as const

// The single canonical default stats object. Every reset / new-account / new-day
// path must use this — do not redefine zeroed stats inline elsewhere.
export const DEFAULT_STATS: Stats = {
  sleep: 0,
  water: 0,
  food: 0,
  sport: 0,
  wellbeing: 0,
}
