import { GpsButton, GpsIcon, MapContainer, MapFrameRoot } from '@/map/ui/map-frame/map-frame.styled'

interface MapFrameProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  gpsAriaLabel: string
  onCenterUser: () => void
}

const MapFrame = (props: MapFrameProps) => {
  const { containerRef, gpsAriaLabel, onCenterUser } = props

  return (
    <MapFrameRoot>
      <MapContainer ref={containerRef} aria-label="Interactive map" />
      <GpsButton type="button" aria-label={gpsAriaLabel} onClick={onCenterUser}>
        <GpsIcon src="/nivel.png" alt={gpsAriaLabel} />
      </GpsButton>
    </MapFrameRoot>
  )
}

export default MapFrame
