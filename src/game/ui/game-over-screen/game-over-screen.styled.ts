import styled from 'styled-components'

export const OverRoot = styled.div`
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

export const ResultLine = styled.p`
  ${({ theme: { colors } }) => `
    margin: 0;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`

export const PlayAgainButton = styled.button`
  ${({ theme: { primitives, radius, typography } }) => `
    padding: 0.75rem 2rem;
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${primitives.palette.brand['500'].cssVar};
    color: ${primitives.palette.peach['50'].cssVar};
    font-size: ${typography.fontSize.text.md.cssVar};
    font-weight: 700;
    cursor: pointer;
  `}
`
