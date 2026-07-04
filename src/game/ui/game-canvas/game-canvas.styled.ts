import styled from 'styled-components'

export const CanvasRoot = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const Canvas = styled.canvas`
  display: block;
  width: 100%;
  max-width: 800px;
  height: auto;
  aspect-ratio: 2 / 1;
  margin: 0 auto;
  flex: 1;
  min-height: 0;
  touch-action: none;
  background: #000;
`
