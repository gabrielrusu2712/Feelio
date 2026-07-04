import styled from 'styled-components'

export const AlbumPageRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

export const AlbumScrollBody = styled.div`
  ${({ theme: { spacing } }) => `
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: ${spacing['3xl'].cssVar};
    padding: ${spacing['3xl'].cssVar} ${spacing['4xl'].cssVar} ${spacing['5xl'].cssVar};

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }
  `}
`
