import styled from 'styled-components'

export const ControlsRow = styled.div`
  ${({ theme: { spacing } }) => `
    display: flex;
    justify-content: center;
    gap: ${spacing.xl.cssVar};
    padding: ${spacing.sm.cssVar};
  `}
`

export const ControlButton = styled.button`
  ${({ theme: { primitives } }) => `
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid ${primitives.palette.brand['500'].cssVar};
    background: ${primitives.palette.peach['300'].cssVar};
    color: ${primitives.palette.brand['700'].cssVar};
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
    user-select: none;
    cursor: pointer;

    &:active {
      background: ${primitives.palette.peach['500'].cssVar};
    }
  `}
`
