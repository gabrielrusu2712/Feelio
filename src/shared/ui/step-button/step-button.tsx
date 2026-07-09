import type { ReactNode } from 'react'
import { StepRoot } from '@/shared/ui/step-button/step-button.styled'

interface StepButtonProps {
  label: string
  disabled?: boolean
  onClick: () => void
  /** The glyph to show (e.g. '+', '−', '›'). */
  children: ReactNode
}

// Dumb: a small round control used for stat +/- steps and the vibe → challenges
// shortcut. The caller supplies the glyph.
const StepButton = (props: StepButtonProps) => {
  const { label, disabled = false, onClick, children } = props

  return (
    <StepRoot
      type="button"
      aria-label={label}
      disabled={disabled}
      data-skip-click-sound
      onClick={onClick}
    >
      {children}
    </StepRoot>
  )
}

export default StepButton
