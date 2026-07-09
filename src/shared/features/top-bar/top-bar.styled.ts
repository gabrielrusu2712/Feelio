import styled from 'styled-components'

// Header size scales to the shell width (cqi) within bounds, so zoom keeps the
// bar proportional instead of letting it eat the screen.
export const Bar = styled.header`
  ${({ theme: { colors } }) => `
    flex: 0 0 auto;
    /* Sit above panel content (e.g. the map) so it never paints over the bar. */
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(0.25rem, 1.2cqi, 0.6rem) clamp(0.5rem, 2cqi, 1rem);
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    border-bottom: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
  `}
`

export const DayCounter = styled.span`
  ${({ theme: { colors } }) => `
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: clamp(0.7rem, 1.8cqi, 1rem);
  `}
`
