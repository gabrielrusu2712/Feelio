import styled from 'styled-components'

export const CanvasRoot = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

// Claims the space between the HUD and the mobile controls, and centers the
// canvas inside it. The canvas must NOT be a flex child itself — flex-grow in a
// column would stretch its height and break the fixed aspect ratio.
export const CanvasArea = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

// Two modes, chosen at runtime from the panel's own shape (see use-game-loop):
// - $fill=false (wide/landscape panel): keep the designed 2:1 window, scaled to
//   fit the area — never distorted, small letterbox on the long edge at most.
// - $fill=true (tall/portrait panel): fill the whole panel. The backing store is
//   resized to match this box (so no bitmap stretch), the background is drawn to
//   cover, and gameplay objects keep their fixed pixel sizes.
export const Canvas = styled.canvas<{ $fill: boolean }>`
  display: block;
  touch-action: none;
  background: #000;
  ${({ $fill }) =>
    $fill
      ? `
        width: 100%;
        height: 100%;
      `
      : `
        max-width: 100%;
        max-height: 100%;
        aspect-ratio: 2 / 1;
      `}
`
