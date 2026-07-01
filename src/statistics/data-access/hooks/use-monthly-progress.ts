import { useEffect, useRef, useState } from 'react'
import { fetchDailyEntry, fetchDayLoginState } from '@/statistics/data-access/api/statistics.api'
import { addMonths, formatDateKey, getMonthStart } from '@/statistics/data-access/utils/date-range'
import type { CalendarDayEntry } from '@/statistics/data-access/store/statistics.types'

type MonthProgress = Record<number, CalendarDayEntry>

const monthCacheKey = (monthDate: Date): string =>
  `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`

// One day-by-day fan-out for a month: each cell carries its completion % and
// whether the user was active (a login OR any saved snapshot).
const fetchMonthProgress = async (uid: string, monthDate: Date): Promise<MonthProgress> => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const progress: MonthProgress = {}

  await Promise.all(
    Array.from({ length: daysInMonth }, async (_, index) => {
      const day = index + 1
      const key = formatDateKey(new Date(year, month, day))
      const [entry, loggedIn] = await Promise.all([
        fetchDailyEntry(uid, key),
        fetchDayLoginState(uid, key),
      ])
      progress[day] = { percent: entry.percent, loggedIn: loggedIn || entry.exists }
    }),
  )
  return progress
}

// Month/promise caches: the result cache serves repeat views instantly; the
// in-flight promise cache dedupes concurrent requests for the same month.
const loadMonth = async (
  uid: string,
  monthDate: Date,
  cache: Record<string, MonthProgress | undefined>,
  promiseCache: Record<string, Promise<MonthProgress> | undefined>,
): Promise<MonthProgress> => {
  const key = monthCacheKey(monthDate)
  const cached = cache[key]
  if (cached) return cached
  const inFlight = promiseCache[key]
  if (inFlight) return inFlight

  // Store the in-flight promise before awaiting so concurrent callers dedupe onto
  // it; the try/finally caches the result and clears the in-flight entry.
  const promise = (async () => {
    try {
      const result = await fetchMonthProgress(uid, monthDate)
      cache[key] = result
      return result
    } finally {
      delete promiseCache[key]
    }
  })()
  promiseCache[key] = promise
  return promise
}

export interface UseMonthlyProgressResult {
  monthDate: Date
  progress: MonthProgress
  loading: boolean
  goPrev: () => void
  goNext: () => void
}

// Drives the monthly calendar. A requestId ref drops stale results when the user
// pages through months quickly, and adjacent months are prefetched so the next
// step renders instantly.
export const useMonthlyProgress = (uid: string | null): UseMonthlyProgressResult => {
  const [monthDate, setMonthDate] = useState(() => getMonthStart(new Date()))
  const [progress, setProgress] = useState<MonthProgress>({})
  const [loading, setLoading] = useState(false)

  const cacheRef = useRef<Record<string, MonthProgress | undefined>>({})
  const promiseRef = useRef<Record<string, Promise<MonthProgress> | undefined>>({})
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (!uid) return
    const requestId = ++requestIdRef.current
    let active = true

    const cache = cacheRef.current
    const promiseCache = promiseRef.current
    const prefetchAdjacent = () => {
      void Promise.all(
        [addMonths(monthDate, -1), addMonths(monthDate, 1)].map((adjacent) =>
          loadMonth(uid, adjacent, cache, promiseCache),
        ),
      )
    }

    void (async () => {
      const cached = cache[monthCacheKey(monthDate)]
      if (cached) {
        setProgress(cached)
        prefetchAdjacent()
        return
      }

      setLoading(true)
      const result = await loadMonth(uid, monthDate, cache, promiseCache)
      if (!active || requestId !== requestIdRef.current) return
      setProgress(result)
      setLoading(false)
      prefetchAdjacent()
    })()

    return () => {
      active = false
    }
  }, [uid, monthDate])

  const goPrev = () => setMonthDate((current) => addMonths(current, -1))
  const goNext = () => setMonthDate((current) => addMonths(current, 1))

  return { monthDate, progress, loading, goPrev, goNext }
}
