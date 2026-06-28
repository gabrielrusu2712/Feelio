import { useState } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Overlay, TooltipBubble } from '@/shared/ui/cursor-tooltip/cursor-tooltip.styled'

const OFFSET_X = 14
const OFFSET_Y = 18

interface CursorTooltipProps {
  text: string
}

// Dumb: a hover hint that follows the cursor. Render inside a position:relative
// parent — it overlays the parent to catch the hover, and the bubble is portaled
// to <body> so the parent's overflow can't clip it.
const CursorTooltip = (props: CursorTooltipProps) => {
  const { text } = props
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const track = (event: MouseEvent) => setPos({ x: event.clientX, y: event.clientY })

  return (
    <>
      <Overlay onMouseMove={track} onMouseLeave={() => setPos(null)} />
      {pos &&
        createPortal(
          <TooltipBubble style={{ left: pos.x + OFFSET_X, top: pos.y + OFFSET_Y }}>
            {text}
          </TooltipBubble>,
          document.body,
        )}
    </>
  )
}

export default CursorTooltip
