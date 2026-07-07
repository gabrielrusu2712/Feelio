import type { KeyboardEvent, ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PanelFrame } from '@/shared/features/app-layout/sortable-panel.styled'

interface SortablePanelProps {
  id: string
  /** CSS `flex` shorthand so each panel keeps its proportion regardless of position. */
  flex: string
  children: ReactNode
}

// Keys typed into a form control must not reach the keyboard drag-sensor. Its
// activation keys are Space/Enter, so without this a Space in a text field "picks
// up" the panel (and a second Space drops it) instead of typing a space.
const isFormControl = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    tag === 'BUTTON' ||
    target.isContentEditable
  )
}

// The entire panel surface is draggable (listeners spread on the frame). A small
// movement threshold on the sensor keeps clicks/taps on panel content working.
const SortablePanel = (props: SortablePanelProps) => {
  const { id, flex, children } = props
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  // Delegate to the sensor's own handler, but only when the keystroke didn't come
  // from a text field inside the panel — the panel frame itself stays keyboard-draggable.
  const handleKeyDown = (event: KeyboardEvent) => {
    if (isFormControl(event.target)) return
    listeners?.onKeyDown?.(event)
  }

  return (
    <PanelFrame
      ref={setNodeRef}
      $flex={flex}
      $dragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      onKeyDown={handleKeyDown}
    >
      {children}
    </PanelFrame>
  )
}

export default SortablePanel
