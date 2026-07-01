import styled from 'styled-components'
import { NavButton } from '@/statistics/ui/chart-range-controls/chart-range-controls.styled'

// Reuse the chart nav button so the month arrows match the range arrows.
export const MonthNavButton = NavButton

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`

export const MonthLabel = styled.p`
  ${({ theme: { colors, typography } }) => `
    margin: 0;
    min-width: 9rem;
    text-align: center;
    font-size: ${typography.fontSize.text.md.cssVar};
    font-weight: 800;
    text-transform: capitalize;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`

export const WeekdayRow = styled.div`
  ${({ theme: { colors, spacing } }) => `
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: ${spacing.xs.cssVar};
    margin: ${spacing.sm.cssVar} auto 0;
    width: 100%;
    max-width: 22rem;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: 0.7rem;
    font-weight: 700;
    text-align: center;
  `}
`

// Capped + centered so the day cells stay a comfortable size on wide panels
// (a full-width 7-column grid would blow the squares up); shrinks on narrow ones.
export const CalendarGrid = styled.div`
  ${({ theme: { spacing } }) => `
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: ${spacing.xs.cssVar};
    margin: ${spacing.xs.cssVar} auto 0;
    width: 100%;
    max-width: 22rem;
  `}
`

export const DayCell = styled.button<{ $bg: string; $fg: string; $today: boolean }>`
  ${({ $bg, $fg, $today, theme: { colors } }) => `
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: ${$today ? `2px solid ${colors.layouts.default.enabled.onSurface.primary.cssVar}` : '2px solid transparent'};
    background: ${$bg};
    color: ${$fg};
    font-size: clamp(0.65rem, 3.2cqi, 0.9rem);
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  `}
`

export const EmptyCell = styled.div`
  aspect-ratio: 1 / 1;
`

export const DayHint = styled.p`
  ${({ theme: { colors, typography } }) => `
    margin: ${typography.fontSize.text.xs.cssVar} 0 0;
    min-height: 1.1em;
    text-align: center;
    font-size: ${typography.fontSize.text.xs.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`
