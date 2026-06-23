import styled from 'styled-components'

export const DesktopRow = styled.div`
  ${({ theme: { spacing } }) => `
    flex: 1;
    min-height: 0;
    display: flex;
    gap: ${spacing.md.cssVar};
    padding: ${spacing.md.cssVar};
  `}
`
