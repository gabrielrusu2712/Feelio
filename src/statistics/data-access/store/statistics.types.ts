// Statistics has no Redux slice — it's a page-local domain (mirrors the source's
// page-scoped module state). These types are shared across its hooks/utils/api.

export type ChartPeriod = 'week' | 'month' | 'year'

// One day's wellbeing snapshot as read from users/{uid}/dailyMoods/{dateKey}.
export interface DailyEntry {
  exists: boolean
  percent: number
  mood: number | null
}

// One calendar cell: its completion % and whether the user was active that day
// (a login OR any saved snapshot).
export interface CalendarDayEntry {
  percent: number
  loggedIn: boolean
}

export interface ChartData {
  labels: string[]
  values: number[]
  moods: Array<number | null>
}

export interface MoodCounts {
  great: number
  good: number
  normal: number
  sad: number
}
