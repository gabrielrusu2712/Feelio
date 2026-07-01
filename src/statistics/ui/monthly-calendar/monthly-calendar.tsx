import { useState } from 'react'
import { OFFLINE_DAY_RGB } from '@/statistics/data-access/constants/statistics.constants'
import {
  clampPercent,
  formatPercent,
  getProgressColor,
  getReadableTextColor,
} from '@/statistics/data-access/utils/calendar-color'
import { getMondayBasedWeekday } from '@/statistics/data-access/utils/date-range'
import {
  CalendarGrid,
  CalendarHeader,
  DayCell,
  DayHint,
  EmptyCell,
  MonthLabel,
  MonthNavButton,
  WeekdayRow,
} from '@/statistics/ui/monthly-calendar/monthly-calendar.styled'
import type { CalendarDayEntry } from '@/statistics/data-access/store/statistics.types'

const OFFLINE_COLOR = `rgb(${OFFLINE_DAY_RGB[0]}, ${OFFLINE_DAY_RGB[1]}, ${OFFLINE_DAY_RGB[2]})`

interface MonthlyCalendarProps {
  monthDate: Date
  monthLabel: string
  weekdayLabels: string[]
  progress: Record<number, CalendarDayEntry>
  hints: { progress: string; noActivity: string }
  prevAriaLabel: string
  nextAriaLabel: string
  onPrev: () => void
  onNext: () => void
}

// Dumb: the monthly progress calendar. Each cell is colored on the
// terracotta→mint completion gradient (grey when the user was inactive); tapping a
// day flashes its hint below the grid (the affordance mobile lacks via hover title).
const MonthlyCalendar = (props: MonthlyCalendarProps) => {
  const { monthDate, monthLabel, weekdayLabels, progress, hints } = props
  const { prevAriaLabel, nextAriaLabel, onPrev, onNext } = props

  const [hint, setHint] = useState('')

  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = getMondayBasedWeekday(year, month, 1)

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
  const leading = Array.from({ length: firstWeekday }, (_, index) => index)

  return (
    <div>
      <CalendarHeader>
        <MonthNavButton type="button" aria-label={prevAriaLabel} onClick={onPrev}>
          {'‹'}
        </MonthNavButton>
        <MonthLabel>{monthLabel}</MonthLabel>
        <MonthNavButton type="button" aria-label={nextAriaLabel} onClick={onNext}>
          {'›'}
        </MonthNavButton>
      </CalendarHeader>

      <WeekdayRow aria-hidden>
        {weekdayLabels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </WeekdayRow>

      <CalendarGrid role="grid">
        {leading.map((slot) => (
          <EmptyCell key={`empty-${slot}`} aria-hidden />
        ))}
        {days.map((day) => {
          const state = progress[day] ?? { percent: 0, loggedIn: false }
          const percent = clampPercent(state.percent)
          const background = state.loggedIn ? getProgressColor(percent) : OFFLINE_COLOR
          const label = state.loggedIn
            ? `${hints.progress}: ${formatPercent(percent)}`
            : hints.noActivity
          return (
            <DayCell
              key={day}
              type="button"
              $bg={background}
              $fg={getReadableTextColor(background)}
              $today={isCurrentMonth && today.getDate() === day}
              title={label}
              aria-label={`${day}: ${label}`}
              onClick={() => setHint(`${day} · ${label}`)}
            >
              {day}
            </DayCell>
          )
        })}
      </CalendarGrid>

      <DayHint aria-live="polite">{hint}</DayHint>
    </div>
  )
}

export default MonthlyCalendar
