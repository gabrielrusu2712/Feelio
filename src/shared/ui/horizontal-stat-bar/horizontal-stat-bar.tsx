import {
  BarRow,
  Fill,
  Icon,
  Label,
  Leading,
  Track,
  Value,
} from '@/shared/ui/horizontal-stat-bar/horizontal-stat-bar.styled'

interface HorizontalStatBarProps {
  value: number
  max: number
  /** Emoji/icon shown at the start of the row. */
  icon: string
  label: string
  /** Fill colour (a theme cssVar string). */
  accent: string
}

// Dumb: a single horizontal, left-to-right progress bar with a leading icon +
// label and a trailing value. Fully fluid — no fixed widths.
const HorizontalStatBar = (props: HorizontalStatBarProps) => {
  const { value, max, icon, label, accent } = props
  const fill = Math.max(0, Math.min(100, (value / (max || 1)) * 100))

  return (
    <BarRow>
      <Leading>
        <Icon aria-hidden="true">{icon}</Icon>
        <Label>{label}</Label>
      </Leading>
      <Track title={`${label}: ${Math.round(fill)}%`}>
        <Fill $fill={fill} $accent={accent} />
      </Track>
      <Value>
        {value}/{max}
      </Value>
    </BarRow>
  )
}

export default HorizontalStatBar
