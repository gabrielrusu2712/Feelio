import styled from 'styled-components'

// Flat (no card) so the mood row, textarea and entries below all share the same
// width — the section is grouped by spacing, not by a background.
export const MoodSelectorRoot = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.lg.cssVar};
  `}
`

export const MoodLabel = styled.p`
  ${({ theme: { colors, typography } }) => `
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 600;
    text-align: center;
    margin: 0;
  `}
`

export const MoodRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
`

export const MoodEmoji = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`
