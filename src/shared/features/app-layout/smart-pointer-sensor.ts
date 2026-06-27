import { PointerSensor } from '@dnd-kit/core'
import type { PointerSensorOptions } from '@dnd-kit/core'
import type { PointerEvent as ReactPointerEvent } from 'react'

// Tags that are inherently "interactive" — a pointer-down on them is a click/
// drag aimed at the control itself, never at reordering the panel.
const INTERACTIVE_TAGS = new Set(['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'A', 'LABEL'])

// Walks up from the event target: a drag is blocked if it started on an
// interactive control or anywhere inside a `[data-no-dnd]` subtree (e.g. the
// Leaflet map, which uses pointer-drag to pan).
const isInteractiveElement = (element: Element | null): boolean => {
  let node: Element | null = element
  while (node) {
    if (node instanceof HTMLElement && node.dataset.noDnd === 'true') return true
    if (INTERACTIVE_TAGS.has(node.tagName)) return true
    node = node.parentElement
  }
  return false
}

// A PointerSensor that refuses to start a panel drag when the gesture begins on
// interactive content, so buttons, inputs and the map keep their own behaviour
// while the rest of the panel surface stays draggable.
export class SmartPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: (
        { nativeEvent: event }: ReactPointerEvent,
        { onActivation }: PointerSensorOptions,
      ) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          isInteractiveElement(event.target as Element)
        ) {
          return false
        }
        onActivation?.({ event })
        return true
      },
    },
  ]
}
