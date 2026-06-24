import styled from 'styled-components'

export const HistoryTitle = styled.h3`
  ${({ theme: { colors, spacing } }) => `
    color: ${colors.layouts.default.enabled.onSurface.secondary.cssVar};
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 ${spacing.xl.cssVar};
  `}
`

export const EntryListRoot = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    flex-direction: column;
    gap: ${spacing.xl.cssVar};
  `}
`

export const EmptyMessage = styled.p`
  ${({ theme: { colors } }) => `
    color: ${colors.layouts.default.enabled.onSurface.quaternary.cssVar};
    font-size: 0.9rem;
    margin: 0;
    text-align: center;
  `}
`
