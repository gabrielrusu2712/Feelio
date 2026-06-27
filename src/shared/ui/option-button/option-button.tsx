import type { ReactNode } from 'react'
import { OptionButton as StyledOptionButton } from '@/shared/ui/option-button/option-button.styled'

interface OptionButtonProps {
  active: boolean
  onSelect: () => void
  /** Accessible name when the content is non-textual (e.g. an emoji). */
  ariaLabel?: string
  children: ReactNode
}

const OptionButton = (props: OptionButtonProps) => {
  const { active, onSelect, ariaLabel, children } = props

  return (
    <StyledOptionButton
      type="button"
      $active={active}
      aria-pressed={active}
      aria-label={ariaLabel}
      onClick={onSelect}
    >
      {children}
    </StyledOptionButton>
  )
}

export default OptionButton
