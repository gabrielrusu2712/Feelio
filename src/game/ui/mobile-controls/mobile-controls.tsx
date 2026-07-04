import { ControlButton, ControlsRow } from '@/game/ui/mobile-controls/mobile-controls.styled'

interface MobileControlsProps {
  upLabel: string
  downLabel: string
  onPress: (direction: 'up' | 'down', pressed: boolean) => void
}

// Pointer events cover mouse + touch in one handler set, mirroring the source's
// separate mobileControl(direction, pressed) toggle but without duplicating
// touch/mouse listeners.
const MobileControls = (props: MobileControlsProps) => {
  const { upLabel, downLabel, onPress } = props

  return (
    <ControlsRow>
      <ControlButton
        type="button"
        aria-label={upLabel}
        onPointerDown={() => onPress('up', true)}
        onPointerUp={() => onPress('up', false)}
        onPointerLeave={() => onPress('up', false)}
      >
        ▲
      </ControlButton>
      <ControlButton
        type="button"
        aria-label={downLabel}
        onPointerDown={() => onPress('down', true)}
        onPointerUp={() => onPress('down', false)}
        onPointerLeave={() => onPress('down', false)}
      >
        ▼
      </ControlButton>
    </ControlsRow>
  )
}

export default MobileControls
