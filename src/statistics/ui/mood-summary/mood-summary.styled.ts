import styled from 'styled-components'

export const SummaryGrid = styled.div`
  ${({ theme: { spacing } }) => `
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${spacing.sm.cssVar};

    @container (max-width: 420px) {
      grid-template-columns: repeat(2, 1fr);
    }
  `}
`

export const MoodCard = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    padding: ${spacing.md.cssVar} ${spacing.sm.cssVar};
    border-radius: ${radius.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
  `}
`

export const MoodEmoji = styled.span`
  font-size: clamp(1.2rem, 6cqi, 1.75rem);
  line-height: 1;
`

export const MoodCount = styled.span`
  ${({ theme: { colors, typography } }) => `
    font-size: ${typography.fontSize.text.lg.cssVar};
    font-weight: 800;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`

export const MoodLabel = styled.span`
  ${({ theme: { colors, typography } }) => `
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 600;
    text-align: center;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`
