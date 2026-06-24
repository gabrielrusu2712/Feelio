import styled from 'styled-components'

export const MoodSelectorRoot = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border-radius: ${radius['2xl'].cssVar};
    padding: ${spacing['3xl'].cssVar};
  `}
`

export const MoodLabel = styled.p`
  ${({ theme: { colors, typography } }) => `
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-size: ${typography.fontSize.text.sm.cssVar};
    font-weight: 600;
    margin: 0 0 0.75rem;
  `}
`

export const MoodRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`

export const MoodButton = styled.button<{ $active: boolean }>`
  ${({ theme: { colors, radius }, $active }) => `
    flex: 1;
    font-size: 1.5rem;
    padding: 0.5rem;
    border-radius: ${radius['2xl'].cssVar};
    border: 2px solid ${$active ? colors.layouts.default.enabled.onSurface.primary.cssVar : 'transparent'};
    background: ${$active ? colors.layouts.default.enabled.surface.primary.cssVar : 'transparent'};
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    line-height: 1;
  `}
`
