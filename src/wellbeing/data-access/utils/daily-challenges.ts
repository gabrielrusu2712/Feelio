import { CHALLENGE_KEYS } from '@/wellbeing/data-access/constants/challenge-pool'
import { DAILY_LEVELS } from '@/wellbeing/data-access/constants/wellbeing.constants'
import type { CategoryKey } from '@/wellbeing/data-access/constants/wellbeing.constants'

// Deterministic per (date, category): the same day always yields the same set,
// but it rotates day to day so the climb never feels repetitive.

const seedFrom = (input: string): number => {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

// mulberry32 — tiny seeded PRNG (no Date/Math.random dependency on call).
const makeRng = (seed: number): (() => number) => {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// The day's ordered challenge i18n keys for a category — a seeded shuffle of the
// pool, truncated to the number of daily levels. Index 0 = level 1.
export const pickDailyChallengeKeys = (category: CategoryKey, dateKey: string) => {
  const pool = [...CHALLENGE_KEYS[category]]
  const rng = makeRng(seedFrom(`${dateKey}:${category}`))
  // Fisher–Yates
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, DAILY_LEVELS)
}
