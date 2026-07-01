import type { ChartPeriod } from '@/statistics/data-access/store/statistics.types'

// Calendar day-cell gradient (ported from the source): low completion is warm
// terracotta, high completion is mint-cream; days with no activity are grey.
export const ORANGE_START_RGB: readonly [number, number, number] = [196, 74, 58]
export const MINT_END_RGB: readonly [number, number, number] = [255, 240, 190]
export const OFFLINE_DAY_RGB: readonly [number, number, number] = [196, 201, 208]

// The four mood buckets shown as summary cards. `mood` matches the coarse bucket
// stored per day (3 great … 0 sad); labelKey/emoji drive the card.
export const MOOD_SUMMARY = [
  { key: 'great', mood: 3, emoji: '🤩', labelKey: 'stats.mood.great' },
  { key: 'good', mood: 2, emoji: '🙂', labelKey: 'stats.mood.good' },
  { key: 'normal', mood: 1, emoji: '😐', labelKey: 'stats.mood.normal' },
  { key: 'sad', mood: 0, emoji: '😔', labelKey: 'stats.mood.sad' },
] as const

// The chart range tabs, in display order.
export const CHART_PERIODS = [
  { key: 'week', labelKey: 'stats.period.week' },
  { key: 'month', labelKey: 'stats.period.month' },
  { key: 'year', labelKey: 'stats.period.year' },
] as const satisfies readonly { key: ChartPeriod; labelKey: string }[]
