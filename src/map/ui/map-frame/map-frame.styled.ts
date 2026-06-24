import styled from 'styled-components'

export const MapFrameRoot = styled.div`
  ${({ theme: { colors, radius, spacing } }) => `
    position: relative;
    flex: 1;
    margin: 0 ${spacing['3xl'].cssVar} ${spacing['3xl'].cssVar};
    border-radius: ${radius['4xl'].cssVar};
    overflow: hidden;
    border: 5px solid ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    min-height: 0;
  `}
`

export const MapContainer = styled.div`
  height: 100%;
  width: 100%;

  /* Dark mode tile inversion */
  &[data-dark='true'] .leaflet-tile-container {
    filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
  }
`

export const GpsButton = styled.button`
  ${({ theme: { colors, radius } }) => `
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 50px;
    height: 50px;
    background: ${colors.layouts.default.enabled.border.primary.cssVar};
    border-radius: ${radius.full.cssVar};
    border: 3px solid ${colors.layouts.default.enabled.onSurface.primary.cssVar};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
    transition: transform 0.2s;
    &:active {
      transform: scale(0.9);
    }
  `}
`

export const GpsIcon = styled.img`
  width: 75%;
  height: auto;
`
