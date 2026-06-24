import styled from 'styled-components'

export const EntryRoot = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    background: ${colors.layouts.default.enabled.border.primary.cssVar};
    border-radius: ${radius.xl.cssVar};
    padding: ${spacing.xl.cssVar};
    display: flex;
    flex-direction: column;
    gap: ${spacing.md.cssVar};
  `}
`

export const EntryMoodIcon = styled.span`
  font-size: 1.4rem;
  line-height: 1;
`

export const EntryDate = styled.span`
  ${({ theme: { colors } }) => `
    font-size: 0.7rem;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    font-weight: 600;
  `}
`

export const EntryQuestion = styled.p`
  ${({ theme: { colors } }) => `
    margin: 0;
    font-size: 0.8rem;
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`

export const EntryText = styled.p`
  ${({ theme: { colors } }) => `
    margin: 0;
    font-size: 0.85rem;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    white-space: pre-wrap;
  `}
`
