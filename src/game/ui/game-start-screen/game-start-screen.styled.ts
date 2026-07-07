import styled from 'styled-components'

export const StartRoot = styled.div`
  ${({ theme: { spacing } }) => `
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.xl.cssVar};
    text-align: center;
  `}
`

export const Title = styled.h2`
  ${({ theme: { primitives, typography } }) => `
    margin: 0;
    font-size: ${typography.fontSize.text.lg.cssVar};
    font-weight: 800;
    color: ${primitives.palette.brand['500'].cssVar};
  `}
`

export const CostText = styled.p`
  ${({ theme: { colors } }) => `
    margin: 0;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`

export const TutorialBox = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing.xs.cssVar};
    padding: ${spacing.md.cssVar};
    border-radius: ${radius.lg.cssVar};
    border: 1px solid ${colors.layouts.default.enabled.border.tertiary.cssVar};
    background: ${colors.layouts.default.enabled.surface.tertiary.cssVar};
  `}
`

export const TutorialRow = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.sm.cssVar};
  `}
`

export const TutorialIcon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`

export const PlayButton = styled.button`
  ${({ theme: { primitives, radius, typography } }) => `
    padding: 0.75rem 2rem;
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${primitives.palette.brand['500'].cssVar};
    color: ${primitives.palette.peach['50'].cssVar};
    font-size: ${typography.fontSize.text.md.cssVar};
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  `}
`

export const ErrorText = styled.p`
  ${({ theme: { primitives, typography } }) => `
    margin: 0;
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 700;
    color: ${primitives.palette.red['500'].cssVar};
  `}
`
