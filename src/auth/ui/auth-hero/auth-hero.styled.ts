import styled from 'styled-components'

export const Hero = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${spacing.sm.cssVar};
  `}
`

export const HeroImage = styled.img`
  width: clamp(9rem, 42cqi, 16rem);
  height: auto;
  object-fit: contain;
`

export const Title = styled.h1`
  ${({ theme: { colors } }) => `
    margin: 0;
    font-family: inherit;
    font-weight: 800;
    font-size: clamp(1.75rem, 8cqi, 2.75rem);
    line-height: 1.1;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`

export const Subtitle = styled.p`
  ${({ theme: { colors, typography } }) => `
    margin: 0;
    font-size: clamp(0.95rem, 3.5cqi, ${typography.fontSize.text.lg.cssVar});
    line-height: 1.45;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`
