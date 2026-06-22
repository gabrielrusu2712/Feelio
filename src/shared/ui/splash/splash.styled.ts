import styled from 'styled-components'

export const SplashRoot = styled.div`
  ${({ theme: { colors, spacing, typography } }) => `
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${spacing.sm.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: ${typography.fontSize.text.md.cssVar};
  `}
`
