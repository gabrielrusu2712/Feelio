import styled from 'styled-components'

export const BarsRoot = styled.section`
  ${({ theme: { colors, radius, spacing } }) => `
    height: 100%;
    display: flex;
    gap: ${spacing.sm.cssVar};
    padding: ${spacing.md.cssVar} ${spacing.sm.cssVar};
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
  `}
`
