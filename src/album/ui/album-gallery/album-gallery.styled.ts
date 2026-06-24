import styled from 'styled-components'

export const GalleryRoot = styled.div`
  ${({ theme: { spacing } }) => `
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing.xl.cssVar};

    @media (min-width: 600px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 900px) {
      grid-template-columns: repeat(4, 1fr);
    }
  `}
`

export const EmptyState = styled.p`
  ${({ theme: { colors, typography } }) => `
    text-align: center;
    font-size: ${typography.fontSize.text.md.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    padding: 2rem 0;
    grid-column: 1 / -1;
  `}
`
