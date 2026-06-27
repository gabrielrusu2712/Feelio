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

export const EntryText = styled.p<{ $expanded: boolean }>`
  ${({ theme: { colors }, $expanded }) => `
    margin: 0;
    font-size: 0.85rem;
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    white-space: pre-wrap;
    overflow: hidden;
    ${
      $expanded
        ? ''
        : `
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    `
    }
  `}
`

export const ToggleButton = styled.button`
  ${({ theme: { colors } }) => `
    align-self: flex-start;
    margin-top: 0.15rem;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 700;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    text-decoration: underline;
  `}
`
