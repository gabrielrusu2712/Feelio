import styled, { css } from 'styled-components'

// Fills the container with object-fit: contain so the rendered box is identical
// for every pose regardless of the asset's aspect ratio (no size jump). The
// filter brightens the bear (matches the old project's brightness/saturate).
const media = css`
  flex: 1;
  min-height: 0;
  width: 100%;
  object-fit: contain;
  filter: brightness(1.32) saturate(1.08);
  background: transparent;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
`

export const Sprite = styled.img`
  ${media}
`

export const Video = styled.video`
  ${media}
`
