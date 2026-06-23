import styled from 'styled-components'

export const ContentRoot = styled.section`
  ${({ theme: { colors, radius } }) => `
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    overflow: hidden;
  `}
`

export const ContentHeader = styled.div`
  ${({ theme: { colors, spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    flex-wrap: wrap;
    padding: ${spacing.sm.cssVar};
    border-bottom: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
  `}
`

export const HeaderTitle = styled.span`
  ${({ theme: { colors, typography } }) => `
    font-size: ${typography.fontSize.text.md.cssVar};
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`

export const ContentBody = styled.div`
  ${({ theme: { colors, spacing, typography } }) => `
    flex: 1;
    min-height: 0;
    overflow: auto; /* sub-pages (e.g. AI convo) scroll here, never the shell */
    padding: ${spacing.lg.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: ${typography.fontSize.text.md.cssVar};
  `}
`
