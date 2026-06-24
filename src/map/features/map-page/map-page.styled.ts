import styled from 'styled-components'

export const MapPageRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export const CheckinMessage = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    position: absolute;
    bottom: ${spacing['5xl'].cssVar};
    left: 50%;
    transform: translateX(-50%);
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border: 2px solid ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border-radius: ${radius['2xl'].cssVar};
    padding: ${spacing.xl.cssVar} ${spacing['3xl'].cssVar};
    font-weight: 700;
    font-size: 0.9rem;
    z-index: 2000;
    white-space: nowrap;
    pointer-events: none;
  `}
`
