import {
  BarColumn,
  BarLabel,
  Fill,
  RidingIcon,
  Track,
} from '@/shared/ui/vertical-stat-bar/vertical-stat-bar.styled'

interface VerticalStatBarProps {
  value: number
  max: number
  /** Emoji/icon that rides the top of the fill and rises with the value. */
  icon: string
  label: string
  /** Fill colour (a theme cssVar string). */
  accent: string
}

// Dumb: a single vertical, bottom-up progress bar with an icon riding its fill.
const VerticalStatBar = (props: VerticalStatBarProps) => {
  const { value, max, icon, label, accent } = props
  const fill = Math.max(0, Math.min(100, (value / (max || 1)) * 100))

  return (
    <BarColumn>
      <Track title={`${label}: ${Math.round(fill)}%`}>
        <Fill $fill={fill} $accent={accent} />
        <RidingIcon $fill={fill} aria-hidden="true">
          {icon}
        </RidingIcon>
      </Track>
      <BarLabel>{label}</BarLabel>
    </BarColumn>
  )
}

export default VerticalStatBar
