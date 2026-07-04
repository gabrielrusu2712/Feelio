import styled from 'styled-components'

export const ListRoot = styled.div`
  ${({ theme: { primitives, spacing } }) => `
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: ${spacing.sm.cssVar};
    padding: ${spacing.lg.cssVar};

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: ${primitives.palette.brand['500'].cssVar};
      border-radius: 10px;
    }
  `}
`
