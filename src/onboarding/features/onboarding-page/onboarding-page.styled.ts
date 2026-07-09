import styled from 'styled-components'

// Outermost shell owns the viewport unit (locked rule: vh/vw only here).
export const Shell = styled.div`
  ${({ theme: { colors, spacing } }) => `
    min-height: 100dvh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${spacing.xl.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
  `}
`

export const TopControls = styled.div`
  ${({ theme: { spacing } }) => `
    position: absolute;
    top: ${spacing.md.cssVar};
    right: ${spacing.md.cssVar};
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
  `}
`

export const CloseButton = styled.button`
  ${({ theme: { colors, radius, spacing } }) => `
    position: absolute;
    top: ${spacing.md.cssVar};
    left: ${spacing.md.cssVar};
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`

// Card-like, unlike AuthPage's bare panel — the tutorial reads as an overlay
// you can dismiss, so it keeps the source's bordered-card feel.
export const Card = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    container-type: inline-size;
    position: relative;
    width: 100%;
    max-width: 26rem;
    min-height: 32rem;
    max-height: 85dvh;
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.xl.cssVar} ${spacing.lg.cssVar};
    border-radius: ${radius.xl.cssVar};
    border: 2px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
  `}
`
