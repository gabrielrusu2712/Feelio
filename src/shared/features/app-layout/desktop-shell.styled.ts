import styled from 'styled-components'

export const DesktopRow = styled.div<{ $expanded?: boolean }>`
  ${({ theme: { spacing }, $expanded }) => `
    flex: 1;
    min-height: 0;
    display: flex;
    /* Drop the gutters when a panel goes fullscreen so it fills edge-to-edge. */
    gap: ${$expanded ? '0px' : spacing.md.cssVar};
    padding: ${$expanded ? '0px' : spacing.md.cssVar};
    transition: gap 0.4s ease, padding 0.4s ease;
  `}
`
