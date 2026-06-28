import styled from 'styled-components'

// Transparent layer over a position:relative parent that catches the hover.
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
`

// Brand-styled hover bubble positioned at the cursor (left/top set inline).
// pointer-events: none so it never intercepts the hover it describes.
export const TooltipBubble = styled.div`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    position: fixed;
    z-index: 3000;
    pointer-events: none;
    max-width: 15rem;
    padding: ${spacing.sm.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 600;
    line-height: 1.35;
  `}
`
