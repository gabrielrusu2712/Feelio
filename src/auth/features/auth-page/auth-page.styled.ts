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

export const BackButton = styled.button`
  ${({ theme: { colors, radius, spacing } }) => `
    position: absolute;
    top: ${spacing.md.cssVar};
    left: ${spacing.md.cssVar};
    padding: ${spacing.xs.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.full.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;

    &:hover {
      color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    }
  `}
`

// No card/shadow so it reads as the page, not a popup. Query container so the
// hero + text scale to its width.
export const Panel = styled.div`
  ${({ theme: { spacing } }) => `
    container-type: inline-size;
    width: 100%;
    max-width: 32rem;
    display: flex;
    flex-direction: column;
    gap: ${spacing.xl.cssVar};
  `}
`
