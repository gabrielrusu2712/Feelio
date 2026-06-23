import styled from 'styled-components'

// The shell is locked to the viewport — the page itself never scrolls; content
// sub-pages scroll inside their own panel instead.
export const Shell = styled.div`
  ${({ theme: { colors } }) => `
    /* Query container so the top bar can size to the shell width and stay
       proportional under zoom instead of ballooning. */
    container-type: inline-size;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`
