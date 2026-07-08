import styled from 'styled-components'

export const SwitcherButton = styled.button`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    display: inline-flex;
    align-items: center;
    gap: ${spacing.xxs.cssVar};
    padding: ${spacing.xs.cssVar} ${spacing.sm.cssVar};
    border-radius: ${radius.full.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-family: inherit;
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;

    &:hover {
      color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
      border-color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    }
  `}
`
