// The four challenge categories, ported from Feelio-Judeteana's `nivel.ts`.
// Challenge text itself lives in i18n (`wellbeing.challenge.<cat>.<1..10>`); only
// the economy metadata (icon, per-completion XP) lives here.

export const CATEGORY_KEYS = ['fizic', 'relaxare', 'creativ', 'social'] as const

export type CategoryKey = (typeof CATEGORY_KEYS)[number]

export interface CategoryConfig {
  key: CategoryKey
  /** Emoji shown on the category card. */
  icon: string
  /** XP granted per completed challenge in this category. */
  xp: number
  labelKey: string
}

// `as const satisfies` keeps labelKey as a literal i18n key (so the typed `t()`
// accepts it) while still checking the shape — same idiom as the map domain.
export const CATEGORIES = [
  { key: 'fizic', icon: '💪', xp: 15, labelKey: 'wellbeing.category.fizic' },
  { key: 'relaxare', icon: '🧘', xp: 20, labelKey: 'wellbeing.category.relaxare' },
  { key: 'creativ', icon: '🎨', xp: 25, labelKey: 'wellbeing.category.creativ' },
  { key: 'social', icon: '🤝', xp: 30, labelKey: 'wellbeing.category.social' },
] as const satisfies readonly CategoryConfig[]

export const CATEGORY_XP = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.key] = category.xp
    return acc
  },
  {} as Record<CategoryKey, number>,
)

// Each category is a daily climb of DAILY_LEVELS levels. Progress runs 0..N:
// completing the last level leaves it at N (the whole climb done — locked until
// the next day's reset). No wrap/replay.
export const DAILY_LEVELS = 10

// A fresh, all-zero progress map. Returns a new object each call so callers never
// share/mutate one instance.
export const zeroProgress = (): Record<CategoryKey, number> =>
  CATEGORY_KEYS.reduce(
    (acc, key) => {
      acc[key] = 0
      return acc
    },
    {} as Record<CategoryKey, number>,
  )
