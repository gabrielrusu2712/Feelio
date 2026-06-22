import styled from 'styled-components'

// The whole panel surface is the drag activator. While dragging, the source is
// hidden (the opaque DragOverlay copy is shown on top instead), keeping its slot
// so neighbours shift around it. Height comes from flex stretch (row) or the
// flex basis (column) — no hard-coded height so it works in both shells.
export const PanelFrame = styled.div<{ $flex: string; $dragging: boolean }>`
  ${({ $flex, $dragging }) => `
    position: relative;
    flex: ${$flex};
    min-width: 0;
    min-height: 0;
    opacity: ${$dragging ? 0 : 1};
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  `}
`

// The floating copy rendered in the DragOverlay: opaque, full-size, on top.
export const OverlayPanel = styled.div`
  height: 100%;
  cursor: grabbing;
`
