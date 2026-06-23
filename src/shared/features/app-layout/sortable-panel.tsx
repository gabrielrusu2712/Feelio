import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PanelFrame } from '@/shared/features/app-layout/sortable-panel.styled'

interface SortablePanelProps {
  id: string
  /** CSS `flex` shorthand so each panel keeps its proportion regardless of position. */
  flex: string
  children: ReactNode
}

// The entire panel surface is draggable (listeners spread on the frame). A small
// movement threshold on the sensor keeps clicks/taps on panel content working.
const SortablePanel = (props: SortablePanelProps) => {
  const { id, flex, children } = props
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  return (
    <PanelFrame
      ref={setNodeRef}
      $flex={flex}
      $dragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      {children}
    </PanelFrame>
  )
}

export default SortablePanel
