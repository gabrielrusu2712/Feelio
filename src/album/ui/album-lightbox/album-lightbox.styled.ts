import styled from 'styled-components'

export const LightboxOverlay = styled.div<{ $visible: boolean }>`
  ${({ $visible }) => `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.88);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9000;
    opacity: ${$visible ? 1 : 0};
    pointer-events: ${$visible ? 'auto' : 'none'};
    transition: opacity 0.2s;
  `}
`

export const LightboxImage = styled.img`
  max-width: 92vw;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
`

export const CloseButton = styled.button`
  ${({ theme: { colors, radius, spacing } }) => `
    position: absolute;
    top: ${spacing['2xl'].cssVar};
    right: ${spacing['2xl'].cssVar};
    background: ${colors.layouts.default.enabled.surface.primary.cssVar};
    color: ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    border: none;
    border-radius: ${radius.full.cssVar};
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  `}
`
