import styled from 'styled-components'

export const Banner = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    position: fixed;
    left: 50%;
    bottom: ${spacing.md.cssVar};
    transform: translateX(-50%);
    z-index: 900;
    width: min(92vw, 30rem);
    display: flex;
    align-items: center;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.md.cssVar} ${spacing.lg.cssVar};
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  `}
`

export const Icon = styled.img`
  ${({ theme: { radius } }) => `
    width: 2.75rem;
    height: 2.75rem;
    flex: none;
    border-radius: ${radius.md.cssVar};
  `}
`

export const Text = styled.div`
  ${({ theme: { colors, typography } }) => `
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    flex: 1;
    min-width: 0;

    strong {
      font-family: inherit;
      font-size: ${typography.fontSize.text.sm.cssVar};
    }

    span {
      font-size: ${typography.fontSize.text.xs.cssVar};
      color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    }
  `}
`

// The iOS Share glyph, sized to the surrounding text via em.
export const ShareGlyph = styled.svg`
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  margin: 0 0.15em;
`

export const Actions = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    flex: none;
  `}
`

export const InstallButton = styled.button`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    padding: ${spacing.xs.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.md.cssVar};
    border: 1px solid ${colors.layouts.brand.enabled.border.primary.cssVar};
    background: ${colors.layouts.brand.enabled.surface.secondary.cssVar};
    color: ${colors.layouts.brand.enabled.onSurface.primary.cssVar};
    font-family: inherit;
    font-size: ${typography.fontSize.text.sm.cssVar};
    white-space: nowrap;
    cursor: pointer;
  `}
`

export const DismissButton = styled.button`
  ${({ theme: { colors, radius } }) => `
    width: 1.75rem;
    height: 1.75rem;
    flex: none;
    border-radius: ${radius.full.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    background: transparent;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    cursor: pointer;
  `}
`
