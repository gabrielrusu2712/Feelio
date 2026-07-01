import { useEffect, useRef, useState } from 'react'
import {
  fetchDailyEntry,
  fetchLoginDayKeys,
  fetchUserCreatedAt,
} from '@/statistics/data-access/api/statistics.api'
import {
  formatDateKey,
  getChartRange,
  getDatesBetween,
  parseDateKey,
  stripTime,
} from '@/statistics/data-access/utils/date-range'
import {
  formatAxisLabel,
  formatMonthShort,
  formatRangeLabel,
} from '@/statistics/data-access/utils/format'
import { normalizeMood } from '@/statistics/data-access/utils/mood-stats'
import type {
  ChartData,
  ChartPeriod,
  DailyEntry,
} from '@/statistics/data-access/store/statistics.types'

const EMPTY: ChartData = { labels: [], values: [], moods: [] }

export interface UseChartDataResult {
  period: ChartPeriod
  offset: number
  data: ChartData
  rangeLabel: string
  loading: boolean
  canGoOlder: boolean
  canGoNewer: boolean
  setPeriod: (period: ChartPeriod) => void
  goOlder: () => void
  goNewer: () => void
}

// Drives the evolution chart: period/offset navigation + the per-range Firestore
// fan-out. A requestId ref drops stale results when the user switches fast, and a
// per-mount cache avoids re-fetching a day already seen this session.
export const useChartData = (uid: string | null, language: string): UseChartDataResult => {
  const [period, setPeriodState] = useState<ChartPeriod>('week')
  const [offset, setOffset] = useState(0)
  const [data, setData] = useState<ChartData>(EMPTY)
  const [rangeLabel, setRangeLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [earliest, setEarliest] = useState<Date | null>(null)

  const cacheRef = useRef<Record<string, DailyEntry>>({})
  const requestIdRef = useRef(0)

  // Earliest reachable day = min(today, createdAt, any login day). Loaded once per user.
  useEffect(() => {
    if (!uid) return
    let active = true
    void (async () => {
      const [createdAt, loginKeys] = await Promise.all([
        fetchUserCreatedAt(uid),
        fetchLoginDayKeys(uid),
      ])
      const candidates = [stripTime(new Date())]
      if (createdAt) candidates.push(createdAt)
      loginKeys.forEach((key) => {
        const date = parseDateKey(key)
        if (date) candidates.push(date)
      })
      const min = new Date(Math.min(...candidates.map((date) => date.getTime())))
      if (active) setEarliest(min)
    })()
    return () => {
      active = false
    }
  }, [uid])

  useEffect(() => {
    if (!uid) return
    const requestId = ++requestIdRef.current
    let active = true

    const getCachedEntry = async (date: Date): Promise<DailyEntry> => {
      const key = formatDateKey(date)
      const cached = cacheRef.current[key]
      if (cached) return cached
      const entry = await fetchDailyEntry(uid, key)
      cacheRef.current[key] = entry
      return entry
    }

    const buildRange = async (start: Date, end: Date): Promise<ChartData> => {
      const dates = getDatesBetween(start, end)
      const entries = await Promise.all(dates.map(getCachedEntry))
      const result: ChartData = { labels: [], values: [], moods: [] }
      dates.forEach((date, index) => {
        const entry = entries[index]
        result.labels.push(formatAxisLabel(date, period, language))
        result.values.push(entry.percent)
        result.moods.push(normalizeMood(entry.mood, entry.percent, entry.exists))
      })
      return result
    }

    // Full-month-normalized score per month (missing days count as 0) for fair
    // month-vs-month comparison; future months in the selected year stay empty.
    const buildYear = async (year: number): Promise<ChartData> => {
      const today = stripTime(new Date())
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth()
      const result: ChartData = { labels: [], values: [], moods: [] }

      await Promise.all(
        Array.from({ length: 12 }, (_, month) =>
          (async () => {
            const monthStart = new Date(year, month, 1)
            result.labels[month] = formatMonthShort(monthStart, language)
            if (year > currentYear || (year === currentYear && month > currentMonth)) {
              result.values[month] = 0
              result.moods[month] = null
              return
            }
            const monthEnd = new Date(year, month + 1, 0)
            const effectiveEnd = year === currentYear && month === currentMonth ? today : monthEnd
            const daysInMonth = monthEnd.getDate()
            const dates = getDatesBetween(monthStart, effectiveEnd)
            const entries = await Promise.all(dates.map(getCachedEntry))
            let sum = 0
            entries.forEach((entry, index) => {
              if (dates[index].getTime() > effectiveEnd.getTime()) return
              sum += entry.exists ? entry.percent : 0
            })
            const avg = daysInMonth > 0 ? Math.round((sum / daysInMonth) * 10) / 10 : 0
            result.values[month] = avg
            result.moods[month] = entries.length > 0 ? normalizeMood(null, avg, true) : null
          })(),
        ),
      )
      return result
    }

    void (async () => {
      setLoading(true)
      const range = getChartRange(period, offset)
      const boundedStart = earliest && range.start < earliest ? new Date(earliest) : range.start
      const chart =
        period === 'year'
          ? await buildYear(range.start.getFullYear())
          : await buildRange(boundedStart, range.end)
      if (!active || requestId !== requestIdRef.current) return
      setData(chart)
      setRangeLabel(formatRangeLabel(boundedStart, range.end, period, language))
      setLoading(false)
    })()

    return () => {
      active = false
    }
  }, [uid, period, offset, earliest, language])

  const nextOlderRange = getChartRange(period, offset + 1)
  const canGoOlder = !earliest || nextOlderRange.end >= earliest
  const canGoNewer = offset > 0

  const setPeriod = (next: ChartPeriod) => {
    if (next === period) return
    setPeriodState(next)
    setOffset(0)
  }
  const goOlder = () => {
    if (canGoOlder) setOffset((current) => current + 1)
  }
  const goNewer = () => {
    if (canGoNewer) setOffset((current) => current - 1)
  }

  return {
    period,
    offset,
    data,
    rangeLabel,
    loading,
    canGoOlder,
    canGoNewer,
    setPeriod,
    goOlder,
    goNewer,
  }
}
