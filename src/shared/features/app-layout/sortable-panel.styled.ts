import styled from 'styled-components'

// The whole panel surface is the drag activator. While dragging, the source is
// hidden (the opaque DragOverlay copy is shown on top instead), keeping its slot
// so neighbours shift around it. Height comes from flex stretch (row) or the
// flex basis (column) — no hard-coded height so it works in both shells.
export const PanelFrame = styled.div<{
  $flex: string
  $dragging: boolean
  $elevated?: boolean
  $collapsed?: boolean
}>`
  ${({ $flex, $dragging, $elevated, $collapsed }) => `
    position: relative;
    /* Collapsed: no grow/basis so the panel shrinks to zero width and its
       fullscreen sibling takes the space. flex-grow animates the width change. */
    flex: ${$collapsed ? '0 0 0' : $flex};
    min-width: 0;
    min-height: 0;
    opacity: ${$dragging || $collapsed ? 0 : 1};
    overflow: ${$collapsed ? 'hidden' : 'visible'};
    pointer-events: ${$collapsed ? 'none' : 'auto'};
    /* Above the top bar (z-index 2) so a full vibe bar's balloon, which
       overflows the panel's top, floats over the header instead of being
       clipped behind it. Only the bars panel opts in — the others stay below
       the header so it keeps covering panel content like the map. */
    ${$elevated && !$collapsed ? 'z-index: 3;' : ''}
    cursor: grab;
    transition: flex-grow 0.4s ease, flex-basis 0.4s ease, opacity 0.35s ease;

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
