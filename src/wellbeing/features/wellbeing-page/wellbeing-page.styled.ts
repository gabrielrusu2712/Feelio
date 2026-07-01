import styled from 'styled-components'

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

// The category menu is kept deliberately short — a single compact row (capped at
// 15% of the panel height) so the sky climb below gets almost all the space.
export const Header = styled.div`
  ${({ theme: { spacing } }) => `
    flex: 0 0 auto;
    max-height: 15%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${spacing.sm.cssVar} ${spacing.md.cssVar};
  `}
`

export const ScrollBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  /* No padding — the sky climb is full-bleed. The gradient is painted here too
     (mirrors Sky in sky-climb.styled) so the scrollbar gutter blends with the sky
     instead of exposing a thin strip of the panel surface on the right. */
  background: linear-gradient(180deg, #bfe9ff 0%, #8fd6ff 45%, #5ec1ff 100%);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.55);
    border-radius: 10px;
  }
`
