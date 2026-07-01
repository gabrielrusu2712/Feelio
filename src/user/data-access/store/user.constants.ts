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

// Canonical daily goals + per-tap step, ported from Feelio-Judeteana's
// `targets`/`increments`. Static constants — never stored in Redux state.
export const STAT_TARGETS: Stats = { sleep: 8, water: 10, food: 3, sport: 30, wellbeing: 5 }

export const STAT_INCREMENTS: Stats = { sleep: 1, water: 1, food: 1, sport: 10, wellbeing: 1 }

// XP needed to advance one player level. The level ring fills with xp/XP_PER_LEVEL.
export const XP_PER_LEVEL = 100

// Stars granted on each level-up — the game currency (game spend lands in Phase 4).
// A batch per level so a level grants several plays; tune this single constant.
export const STARS_PER_LEVEL_UP = 5
