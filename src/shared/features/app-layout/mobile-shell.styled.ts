import styled from 'styled-components'

// Portrait is a single panel under the fixed top bar — adaptive, never a fixed
// phone frame. The "…" page menu in the header drives full-screen page swaps.
export const MobilePanel = styled.section`
  ${({ theme: { colors, radius, spacing } }) => `
    flex: 1;
    min-height: 0;
    margin: ${spacing.sm.cssVar};
    display: flex;
    flex-direction: column;
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    overflow: hidden;
  `}
`

export const MobileHeader = styled.div`
  ${({ theme: { colors, spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.sm.cssVar};
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

export const MobileBody = styled.div<{ $fullHeight?: boolean }>`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: ${({ $fullHeight }) => ($fullHeight ? 'hidden' : 'visible')};
`

// Non-home views are placeholders for now; they scroll inside the panel.
export const Placeholder = styled.div`
  ${({ theme: { colors, spacing, typography } }) => `
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: ${spacing.lg.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: ${typography.fontSize.text.md.cssVar};
  `}
`
