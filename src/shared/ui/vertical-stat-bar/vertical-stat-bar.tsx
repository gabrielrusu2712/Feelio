import type { FillTexture } from '@/shared/data-access/constants/stat-config'
import StepButton from '@/shared/ui/step-button/step-button'
import CursorTooltip from '@/shared/ui/cursor-tooltip/cursor-tooltip'
import {
  BarColumn,
  Fill,
  RidingIcon,
  Sky,
  SkyTexture,
  Track,
  TrackWrap,
} from '@/shared/ui/vertical-stat-bar/vertical-stat-bar.styled'

interface VerticalStatBarProps {
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

// Dumb: a vertical bottom-up bar with the icon riding the fill edge. Normal
// stats show +/- step controls; the vibe bar has none — it fills the full
// column and links to challenges with a cursor hint instead.
const VerticalStatBar = (props: VerticalStatBarProps) => {
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
    <BarColumn>
      {!onNavigate && (
        <StepButton label={increaseLabel ?? ''} disabled={value >= max} onClick={onIncrement!}>
          +
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
          src={icon}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
        {onNavigate && navigateHint && <CursorTooltip text={navigateHint} />}
      </TrackWrap>

      {!onNavigate && (
        <StepButton label={decreaseLabel ?? ''} disabled={value <= 0} onClick={onDecrement!}>
          −
        </StepButton>
      )}
    </BarColumn>
  )
}

export default VerticalStatBar
