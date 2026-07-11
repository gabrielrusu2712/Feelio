import styled from 'styled-components'

export const ContentRoot = styled.section<{ $expanded?: boolean }>`
  ${({ theme: { colors, radius }, $expanded }) => `
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    /* Fullscreen game: drop the rounded frame so it fills edge-to-edge. */
    border-radius: ${$expanded ? '0' : radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border: ${$expanded ? '0' : '1px'} solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    overflow: hidden;
    transition: border-radius 0.4s ease;
  `}
`

export const ContentHeader = styled.div<{ $hidden?: boolean }>`
  ${({ theme: { colors, spacing }, $hidden }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    flex-wrap: wrap;
    overflow: hidden;
    /* Collapse the header away when the game is fullscreen. */
    max-height: ${$hidden ? '0' : '6rem'};
    padding: ${$hidden ? `0 ${spacing.sm.cssVar}` : spacing.sm.cssVar};
    opacity: ${$hidden ? 0 : 1};
    /* Keep the header (and its "…" dropdown) above the map in the body. */
    position: relative;
    z-index: 1;
    border-bottom: ${$hidden ? '0' : '1px'} solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    transition: max-height 0.4s ease, opacity 0.3s ease, padding 0.4s ease;
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

export const ContentBody = styled.div<{ $noPadding?: boolean }>`
  ${({ theme: { colors, spacing, typography }, $noPadding }) => `
    flex: 1;
    min-height: 0;
    overflow: ${$noPadding ? 'hidden' : 'auto'};
    padding: ${$noPadding ? '0' : spacing.lg.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: ${typography.fontSize.text.md.cssVar};
  `}
`
