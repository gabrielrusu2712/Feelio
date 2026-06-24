import styled from 'styled-components'

export const UploadRoot = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    border: 2px dashed ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border-radius: ${radius.xl.cssVar};
    padding: ${spacing['3xl'].cssVar} ${spacing['2xl'].cssVar};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing.lg.cssVar};
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    }
  `}
`

export const PlusIcon = styled.span`
  ${({ theme: { colors } }) => `
    font-size: 2.5rem;
    line-height: 1;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-weight: 700;
  `}
`

export const UploadHint = styled.p`
  ${({ theme: { colors, typography } }) => `
    margin: 0;
    font-size: ${typography.fontSize.text.md.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-weight: 600;
    text-align: center;
  `}
`

export const PlaceName = styled.strong`
  font-weight: 800;
`

export const SavingOverlay = styled.span`
  ${({ theme: { colors, typography } }) => `
    font-size: ${typography.fontSize.text.sm.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
  `}
`
