import styled from 'styled-components'

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.45);
`

export const Card = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    width: min(28rem, 100%);
    display: flex;
    flex-direction: column;
    gap: ${spacing.xl.cssVar};
    padding: ${spacing['3xl'].cssVar};
    border-radius: ${radius['2xl'].cssVar};
    border: 3px solid ${colors.layouts.default.enabled.border.primary.cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    text-align: center;
  `}
`

export const Title = styled.h2`
  ${({ theme: { typography } }) => `
    margin: 0;
    font-family: inherit;
    font-size: ${typography.fontSize.text.lg.cssVar};
    font-weight: 800;
  `}
`

export const Body = styled.p`
  ${({ theme: { typography, colors } }) => `
    margin: 0;
    font-size: ${typography.fontSize.text.md.cssVar};
    line-height: 1.5;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`

export const Actions = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
  `}
`

export const PrimaryButton = styled.button`
  ${({ theme: { colors, radius, typography } }) => `
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: ${radius.full.cssVar};
    background: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    color: ${colors.layouts.default.enabled.surface.primary.cssVar};
    font-size: ${typography.fontSize.text.md.cssVar};
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  `}
`

export const SecondaryButton = styled.button`
  ${({ theme: { colors, radius, typography } }) => `
    padding: 0.6rem 1.2rem;
    border: 3px solid ${colors.layouts.default.enabled.border.secondary.cssVar};
    border-radius: ${radius.full.cssVar};
    background: transparent;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 700;
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    }
  `}
`
