import { Link } from 'react-router'
import styled, { keyframes } from 'styled-components'

const floatTitle = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-0.5rem); }
`

const floatHero = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1rem); }
`

const floatCloud = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-1rem) rotate(2deg); }
`

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.18); }
  70% { box-shadow: 0 0 0 1rem rgba(0, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
`

// Outermost shell owns the viewport unit (locked rule: vh/vw only here).
export const Shell = styled.div`
  ${({ theme: { colors, spacing } }) => `
    container-type: inline-size;
    position: relative;
    overflow: hidden;
    min-height: 100dvh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.lg.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
  `}

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
    }
  }
`

export const Clouds = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`

export const Cloud = styled.img<{
  $top: string
  $side: 'left' | 'right'
  $offset: string
  $size: string
  $delay: string
  $opacity: number
  $desktopOnly?: boolean
}>`
  ${({ $top, $side, $offset, $size, $delay, $opacity, $desktopOnly }) => `
    position: absolute;
    top: ${$top};
    ${$side}: ${$offset};
    width: ${$size};
    height: auto;
    opacity: ${$opacity};
    animation: ${floatCloud.getName()} 6s ease-in-out infinite;
    animation-delay: ${$delay};
    ${$desktopOnly ? '@media (orientation: portrait) { display: none; }' : ''}
  `}
`

export const Header = styled.header`
  ${({ theme: { spacing } }) => `
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing.sm.cssVar};
    width: 100%;
  `}
`

export const HeaderControls = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    align-items: center;
    gap: ${spacing.xs.cssVar};
  `}
`

export const TutorialLink = styled(Link)`
  ${({ theme: { colors, radius, spacing, typography } }) => `
    display: inline-flex;
    align-items: center;
    padding: ${spacing.xs.cssVar} ${spacing.md.cssVar};
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    color: ${colors.layouts.default.enabled.surface.primary.cssVar};
    font-family: inherit;
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 800;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    transition: opacity 0.2s;

    &:hover { opacity: 0.9; }
  `}
`

export const Content = styled.div`
  ${({ theme: { spacing } }) => `
    position: relative;
    z-index: 1;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: ${spacing.sm.cssVar};
  `}
`

export const Title = styled.h1`
  ${({ theme: { colors } }) => `
    margin: 0;
    font-family: inherit;
    font-weight: 900;
    font-size: clamp(3rem, 18cqi, 6rem);
    letter-spacing: -0.03em;
    line-height: 1;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    text-shadow: 0.15rem 0.25rem 0 rgba(0, 0, 0, 0.12);
    animation: ${floatTitle.getName()} 3s ease-in-out infinite;
  `}
`

export const Tagline = styled.p`
  ${({ theme: { colors, typography } }) => `
    margin: 0;
    font-size: clamp(0.95rem, 3.5cqi, ${typography.fontSize.text.lg.cssVar});
    line-height: 1.45;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`

export const HeroImage = styled.img`
  max-width: 85%;
  /* Sized in dvh (a deliberate exception to the rem-only rule) so it can never
     force a page scroll: bigger in portrait/phone, smaller in landscape/desktop. */
  max-height: 44dvh;
  width: auto;
  height: auto;
  filter: brightness(1.32) saturate(1.08) drop-shadow(0 0.9rem 1.5rem rgba(0, 0, 0, 0.15));
  animation: ${floatHero.getName()} 4s ease-in-out infinite;

  @media (orientation: landscape) {
    max-height: 40dvh;
  }
`

export const Footer = styled.footer`
  ${({ theme: { spacing } }) => `
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    padding: ${spacing.sm.cssVar} 0 calc(${spacing.xl.cssVar} + ${spacing.xl.cssVar});
  `}
`

export const PlayButton = styled(Link)`
  ${({ theme: { colors, radius, spacing } }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${spacing.md.cssVar} ${spacing.xl.cssVar};
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    color: ${colors.layouts.default.enabled.surface.primary.cssVar};
    font-family: inherit;
    font-size: clamp(1.1rem, 5cqi, 1.6rem);
    font-weight: 900;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: transform 0.15s;
    animation: ${pulseGlow.getName()} 2.4s infinite;

    &:hover { transform: translateY(-0.125rem); }
    &:active { transform: translateY(0.0625rem); }
  `}
`
