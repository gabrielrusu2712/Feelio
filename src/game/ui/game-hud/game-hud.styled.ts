import styled from 'styled-components'

export const HudBar = styled.div`
  ${({ theme: { primitives, spacing, typography } }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing.sm.cssVar};
    padding: ${spacing.xs.cssVar} ${spacing.md.cssVar};
    background: ${primitives.palette.brand['700'].cssVar};
    color: ${primitives.palette.peach['50'].cssVar};
    font-weight: 700;
    font-size: ${typography.fontSize.text.sm.cssVar};
  `}
`

export const Lives = styled.span`
  letter-spacing: 0.1rem;
`

export const Score = styled.span``

export const Stars = styled.span``
