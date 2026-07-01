import { toDateKey } from '@/user/data-access/utils/date-key'
import type { ChartPeriod } from '@/statistics/data-access/store/statistics.types'

// Pure date math, ported 1:1 from the source's stats.ts. All ranges are
// inclusive and time-stripped so day comparisons never trip over hours/minutes.

export const stripTime = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const getMonthStart = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1)

export const addMonths = (date: Date, offset: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + offset, 1)

// Monday-based weekday index (0 = Monday … 6 = Sunday), matching the calendar grid.
export const getMondayBasedWeekday = (year: number, month: number, day: number): number =>
  (new Date(year, month, day).getDay() + 6) % 7

export const getDatesBetween = (start: Date, end: Date): Date[] => {
  const dates: Date[] = []
  const cursor = stripTime(start)
  const limit = stripTime(end)
  while (cursor.getTime() <= limit.getTime()) {
    dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

// The [start, end] window for a period at a given offset back from today
// (offset 0 = current week/month/year).
export const getChartRange = (
  period: ChartPeriod,
  offset: number,
  today: Date = new Date(),
): { start: Date; end: Date } => {
  if (period === 'week') {
    const end = stripTime(addDays(today, -offset * 7))
    const start = stripTime(addDays(end, -6))
    return { start, end }
  }

  if (period === 'month') {
    const base = addMonths(getMonthStart(today), -offset)
    const start = getMonthStart(base)
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0)
    return { start: stripTime(start), end: stripTime(end) }
  }

  const year = today.getFullYear() - offset
  return { start: stripTime(new Date(year, 0, 1)), end: stripTime(new Date(year, 11, 31)) }
}

// The canonical day-bucket key (DD.MM.YYYY via ro-RO), shared with loginDays and
// dailyMoods writers so readers and writers can never disagree.
export const formatDateKey = (date: Date): string => toDateKey(date)

// Parses a "DD.MM.YYYY" key back into a local Date (used for loginDays doc ids).
export const parseDateKey = (dateKey: string): Date | null => {
  const parts = dateKey.split('.')
  if (parts.length !== 3) return null
  const day = Number(parts[0])
  const month = Number(parts[1]) - 1
  const year = Number(parts[2])
  const date = new Date(year, month, day)
  if (Number.isNaN(date.getTime())) return null
  return stripTime(date)
}
