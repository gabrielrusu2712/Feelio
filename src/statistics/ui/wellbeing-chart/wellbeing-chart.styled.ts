import styled from 'styled-components'

// A fixed-height canvas wrap — Chart.js fills it (maintainAspectRatio: false).
export const ChartCanvasWrap = styled.div`
  position: relative;
  width: 100%;
  height: clamp(12rem, 45cqi, 18rem);
`
