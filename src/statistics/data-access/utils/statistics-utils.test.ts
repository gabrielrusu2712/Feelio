import { describe, expect, it } from 'vitest'
import {
  addDays,
  addMonths,
  getChartRange,
  getDatesBetween,
  getMondayBasedWeekday,
  getMonthStart,
  parseDateKey,
  stripTime,
} from '@/statistics/data-access/utils/date-range'
import {
  clampPercent,
  formatPercent,
  getProgressColor,
  getReadableTextColor,
} from '@/statistics/data-access/utils/calendar-color'
import { normalizeMood, summarizeMoods } from '@/statistics/data-access/utils/mood-stats'

describe('date-range', () => {
  const wed = new Date(2026, 4, 13) // Wed 13 May 2026

  it('strips time to local midnight', () => {
    const stamped = new Date(2026, 4, 13, 17, 42, 9)
    expect(stripTime(stamped).getHours()).toBe(0)
    expect(stripTime(stamped).getDate()).toBe(13)
  })

  it('builds an inclusive 7-day week range ending today at offset 0', () => {
    const { start, end } = getChartRange('week', 0, wed)
    expect(getDatesBetween(start, end)).toHaveLength(7)
    expect(end.getTime()).toBe(stripTime(wed).getTime())
  })

  it('shifts the week back one full week per offset', () => {
    const current = getChartRange('week', 0, wed)
    const older = getChartRange('week', 1, wed)
    expect(older.end.getTime()).toBe(addDays(current.end, -7).getTime())
  })

  it('spans the full calendar month for a month range', () => {
    const { start, end } = getChartRange('month', 0, wed)
    expect(start.getTime()).toBe(getMonthStart(wed).getTime())
    expect(end.getDate()).toBe(31) // May has 31 days
  })

  it('spans Jan 1 – Dec 31 for a year range', () => {
    const { start, end } = getChartRange('year', 0, wed)
    expect(start.getMonth()).toBe(0)
    expect(start.getDate()).toBe(1)
    expect(end.getMonth()).toBe(11)
    expect(end.getDate()).toBe(31)
  })

  it('gives a Monday-based weekday index', () => {
    // 11 May 2026 is a Monday.
    expect(getMondayBasedWeekday(2026, 4, 11)).toBe(0)
    // 17 May 2026 is a Sunday.
    expect(getMondayBasedWeekday(2026, 4, 17)).toBe(6)
  })

  it('round-trips a DD.MM.YYYY key and rejects malformed keys', () => {
    const parsed = parseDateKey('13.05.2026')
    expect(parsed?.getFullYear()).toBe(2026)
    expect(parsed?.getMonth()).toBe(4)
    expect(parsed?.getDate()).toBe(13)
    expect(parseDateKey('nope')).toBeNull()
  })

  it('addMonths keeps the first of the month', () => {
    expect(addMonths(wed, -2).getDate()).toBe(1)
    expect(addMonths(wed, -2).getMonth()).toBe(2) // March
  })
})

describe('calendar-color', () => {
  it('clamps percent into [0, 100] and treats NaN as 0', () => {
    expect(clampPercent(-5)).toBe(0)
    expect(clampPercent(140)).toBe(100)
    expect(clampPercent(Number.NaN)).toBe(0)
  })

  it('formats percent dropping a trailing .0', () => {
    expect(formatPercent(83)).toBe('83%')
    expect(formatPercent(42.5)).toBe('42.5%')
  })

  it('interpolates the gradient endpoints', () => {
    expect(getProgressColor(0)).toBe('rgb(196, 74, 58)')
    expect(getProgressColor(100)).toBe('rgb(255, 240, 190)')
  })

  it('picks readable text color by luminance', () => {
    expect(getReadableTextColor('rgb(255, 240, 190)')).toBe('#173228') // light → dark text
    expect(getReadableTextColor('rgb(196, 74, 58)')).toBe('#ffffff') // dark → white text
  })
})

describe('mood-stats', () => {
  it('returns null for days with no snapshot', () => {
    expect(normalizeMood(null, 90, false)).toBeNull()
  })

  it('prefers the stored bucket, else derives from percent', () => {
    expect(normalizeMood(2, 5, true)).toBe(2)
    expect(normalizeMood(null, 90, true)).toBe(3)
    expect(normalizeMood(null, 55, true)).toBe(2)
    expect(normalizeMood(null, 25, true)).toBe(1)
    expect(normalizeMood(null, 10, true)).toBe(0)
  })

  it('tallies mood buckets, ignoring nulls', () => {
    expect(summarizeMoods([3, 3, 2, 1, 0, null, null])).toEqual({
      great: 2,
      good: 1,
      normal: 1,
      sad: 1,
    })
  })
})
