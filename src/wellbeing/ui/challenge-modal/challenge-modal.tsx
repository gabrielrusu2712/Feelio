import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Actions,
  Backdrop,
  Body,
  Card,
  PrimaryButton,
  SecondaryButton,
  Title,
} from '@/wellbeing/ui/challenge-modal/challenge-modal.styled'

interface ChallengeModalProps {
  open: boolean
  title: string
  /** The challenge prompt. */
  body: string
  completeLabel: string
  closeLabel: string
  onComplete: () => void
  onClose: () => void
}

// Dumb modal: portaled to the body to escape the panel's stacking/overflow,
// closes on Esc, backdrop click, or the close button.
const ChallengeModal = (props: ChallengeModalProps) => {
  const { open, title, body, completeLabel, closeLabel, onComplete, onClose } = props

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <Backdrop onClick={onClose}>
      <Card role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Body>{body}</Body>
        <Actions>
          <PrimaryButton type="button" onClick={onComplete}>
            {completeLabel}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onClose}>
            {closeLabel}
          </SecondaryButton>
        </Actions>
      </Card>
    </Backdrop>,
    document.body,
  )
}

export default ChallengeModal
