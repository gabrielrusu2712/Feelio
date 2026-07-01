import type { ChartPeriod } from '@/statistics/data-access/store/statistics.types'

// Locale-aware label formatting. The locale is derived from the active i18n
// language by the caller ('en' → 'en-US', anything else → 'ro-RO') so the charts
// and calendar read naturally in either language.
export const localeFor = (language: string): string => (language === 'en' ? 'en-US' : 'ro-RO')

// The x-axis label for a single date, per period: weekday for week, day/month for
// month. (Year labels are month names, produced directly in the aggregator.)
export const formatAxisLabel = (date: Date, period: ChartPeriod, locale: string): string =>
  period === 'week'
    ? date.toLocaleDateString(locale, { weekday: 'short' })
    : date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' })

export const formatMonthShort = (date: Date, locale: string): string =>
  date.toLocaleDateString(locale, { month: 'short' })

export const formatMonthLong = (date: Date, locale: string): string =>
  date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })

// The "12.05.2026 - 18.05.2026" range caption under the chart (year → just the year).
export const formatRangeLabel = (
  start: Date,
  end: Date,
  period: ChartPeriod,
  locale: string,
): string => {
  if (period === 'year') return start.getFullYear().toString()
  return `${start.toLocaleDateString(locale)} - ${end.toLocaleDateString(locale)}`
}

// Monday-based short weekday headers for the calendar (2024-01-01 is a Monday).
export const mondayWeekdayLabels = (locale: string): string[] =>
  Array.from({ length: 7 }, (_, index) =>
    new Date(2024, 0, 1 + index).toLocaleDateString(locale, { weekday: 'short' }),
  )
