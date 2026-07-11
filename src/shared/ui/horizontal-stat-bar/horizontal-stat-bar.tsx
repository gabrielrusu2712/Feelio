import type { FillTexture } from '@/shared/data-access/constants/stat-config'
import StepButton from '@/shared/ui/step-button/step-button'
import CursorTooltip from '@/shared/ui/cursor-tooltip/cursor-tooltip'
import {
  BarRow,
  Fill,
  RidingIcon,
  Sky,
  SkyTexture,
  Track,
  TrackWrap,
  Value,
} from '@/shared/ui/horizontal-stat-bar/horizontal-stat-bar.styled'

interface HorizontalStatBarProps {
  value: number
  max: number
  /** Icon texture (public path) that rides the fill edge — the only identifier. */
  icon: string
  /** Fill colour (a theme cssVar string). */
  accent: string
  /** Optional scrolling fill texture (overrides the flat accent). */
  fillTexture?: FillTexture
  /** Icon size multiplier (default 1); vibe rides slightly larger. */
  iconScale?: number
  /** Adjust mode: +/- controls. Omit for a navigate bar. */
  onIncrement?: () => void
  onDecrement?: () => void
  increaseLabel?: string
  decreaseLabel?: string
  /** Navigate mode (vibe): whole bar is clickable + shows a hover hint. */
  onNavigate?: () => void
  navigateHint?: string
}

// Dumb: a horizontal bar with the icon riding the fill edge and a trailing
// value. Normal stats show +/- step controls; the vibe bar has none — it spans
// the full width and links to challenges with a cursor hint instead.
const HorizontalStatBar = (props: HorizontalStatBarProps) => {
  const { value, max, icon, accent, fillTexture, iconScale = 1 } = props
  const { onIncrement, onDecrement, increaseLabel, decreaseLabel } = props
  const { onNavigate, navigateHint } = props
  const fill = Math.max(0, Math.min(100, (value / (max || 1)) * 100))

  const navProps = onNavigate
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': navigateHint,
        onClick: onNavigate,
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onNavigate()
          }
        },
      }
    : {}

  return (
    <BarRow>
      {!onNavigate && (
        <StepButton label={decreaseLabel ?? ''} disabled={value <= 0} onClick={onDecrement!}>
          −
        </StepButton>
      )}

      <TrackWrap $clickable={!!onNavigate} {...navProps}>
        <Track>
          {fillTexture ? (
            <Sky $fill={fill}>
              <SkyTexture
                $texture={fillTexture.src}
                $ratio={fillTexture.ratio}
                $scale={fillTexture.scale ?? 1}
              />
            </Sky>
          ) : (
            <Fill $fill={fill} $accent={accent} />
          )}
        </Track>
        <RidingIcon
          $fill={fill}
          $scale={iconScale}
          $inset={!onNavigate}
          src={icon}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
        {onNavigate && navigateHint && <CursorTooltip text={navigateHint} />}
      </TrackWrap>

      {!onNavigate && (
        <StepButton label={increaseLabel ?? ''} disabled={value >= max} onClick={onIncrement!}>
          +
        </StepButton>
      )}

      <Value>
        {value}/{max}
      </Value>
    </BarRow>
  )
}

export default HorizontalStatBar
