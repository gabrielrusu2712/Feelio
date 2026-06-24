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

export const RewardBanner = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    background: ${colors.layouts.default.enabled.surface.secondary.cssVar};
    border: 2px solid ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border-radius: ${radius.xl.cssVar};
    padding: ${spacing.xl.cssVar} ${spacing['2xl'].cssVar};
    text-align: center;
    font-weight: 700;
    font-size: 1rem;
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
  `}
`
