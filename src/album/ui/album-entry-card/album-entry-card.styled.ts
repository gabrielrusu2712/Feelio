import styled from 'styled-components'

export const CardRoot = styled.article`
  ${({ theme: { colors, radius, spacing } }) => `
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    border-radius: ${radius.xl.cssVar};
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
    transition: transform 0.15s, box-shadow 0.15s;
    border: 2px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    padding-bottom: ${spacing.md.cssVar};

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    }
  `}
`

export const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
`

export const CardMeta = styled.div`
  ${({ theme: { colors, spacing, typography } }) => `
    padding: ${spacing.md.cssVar} ${spacing.lg.cssVar} 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs.cssVar};

    strong {
      font-size: ${typography.fontSize.text.sm.cssVar};
      font-weight: 700;
      color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span {
      font-size: 0.7rem;
      color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    }
  `}
`

export const StarsBadge = styled.span`
  ${({ theme: { colors } }) => `
    font-size: 0.7rem;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-weight: 600;
  `}
`
