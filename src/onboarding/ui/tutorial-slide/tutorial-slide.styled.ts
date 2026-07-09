import styled from 'styled-components'

export const SlideRoot = styled.div`
  ${({ theme: { spacing } }) => `
    min-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: ${spacing.sm.cssVar};
    padding: 0 ${spacing.xs.cssVar};
  `}
`

export const Title = styled.h2`
  ${({ theme: { colors } }) => `
    margin: 0;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: clamp(1.1rem, 7cqi, 1.6rem);
    font-weight: 800;
    line-height: 1.2;
  `}
`

export const Description = styled.p`
  ${({ theme: { colors } }) => `
    margin: 0;
    max-width: 22rem;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: clamp(0.85rem, 4cqi, 1rem);
    line-height: 1.4;
  `}
`

export const HeroImage = styled.img`
  width: 7rem;
  height: auto;
  filter: brightness(1.32) saturate(1.08);
`

export const StartButton = styled.button`
  ${({ theme: { colors, radius, spacing } }) => `
    margin-top: ${spacing.sm.cssVar};
    padding: ${spacing.sm.cssVar} ${spacing.xl.cssVar};
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    color: ${colors.layouts.default.enabled.surface.primary.cssVar};
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    cursor: pointer;
    box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.2);
    transition: transform 0.15s;

    &:hover { transform: translateY(-0.0625rem); }
    &:active { transform: translateY(0.0625rem); }
  `}
`

export const ScreenshotImage = styled.img`
  ${({ theme: { colors, radius } }) => `
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 13rem;
    border: 3px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    border-radius: ${radius.lg.cssVar};
    box-shadow: 0 0.6rem 1.5rem rgba(0, 0, 0, 0.15);
    object-fit: contain;
  `}
`
