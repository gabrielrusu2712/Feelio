import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { MapObjective } from '@/map/data-access/store/map.types'
import {
  CHECKIN_DISTANCE_METERS,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MARKER_COLORS,
  TILE_URL,
} from '@/map/data-access/constants/map.constants'

interface UseLeafletMapOptions {
  objectives: MapObjective[]
  lang: string
  onSelectLocation: (obj: MapObjective) => void
  onCheckin: (obj: MapObjective, distance: number) => void
  isDark: boolean
}

export const useLeafletMap = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseLeafletMapOptions,
) => {
  const { objectives, lang, onSelectLocation, onCheckin, isDark } = options

  const mapRef = useRef<L.Map | null>(null)
  const markerLayerRef = useRef<L.LayerGroup | null>(null)
  const userMarkerRef = useRef<L.CircleMarker | null>(null)
  // stable refs so markers' click handlers always see current values
  const onSelectRef = useRef(onSelectLocation)
  const onCheckinRef = useRef(onCheckin)

  useEffect(() => {
    onSelectRef.current = onSelectLocation
  }, [onSelectLocation])
  useEffect(() => {
    onCheckinRef.current = onCheckin
  }, [onCheckin])

  // Mount map once
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    const map = L.map(container, { zoomControl: false }).setView(
      DEFAULT_MAP_CENTER,
      DEFAULT_MAP_ZOOM,
    )

    L.tileLayer(TILE_URL, { attribution: '' }).addTo(map)
    markerLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    // The map mounts inside a panel that may still be animating; recompute its
    // size once the layout settles.
    const invalidateTimer = setTimeout(() => map.invalidateSize(), 300)

    // Keep the map correctly sized whenever its panel changes size (layout
    // settle, panel reorder, orientation) — a stale size mis-projects the very
    // first marker click, which is what made a popup take two clicks to open.
    const resizeObserver = new ResizeObserver(() => map.invalidateSize())
    resizeObserver.observe(container)

    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current)

        userMarkerRef.current = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: MARKER_COLORS.userFill,
          color: MARKER_COLORS.userStroke,
          weight: 2,
          fillOpacity: 1,
        }).addTo(map)

        map.setView([lat, lng], 15)
      })
    }

    return () => {
      clearTimeout(invalidateTimer)
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      markerLayerRef.current = null
      userMarkerRef.current = null
    }
  }, [containerRef])

  // Re-render markers whenever objectives, lang, or dark mode changes
  useEffect(() => {
    const layer = markerLayerRef.current
    if (!layer) return
    layer.clearLayers()

    objectives.forEach((obj) => {
      const name = lang === 'en' ? obj.name.en || obj.name.ro : obj.name.ro || obj.name.en
      const desc = lang === 'en' ? obj.desc.en || obj.desc.ro : obj.desc.ro || obj.desc.en

      const marker = L.circleMarker(obj.coords, {
        radius: 12,
        fillColor: MARKER_COLORS.objectiveFill,
        color: MARKER_COLORS.objectiveStroke,
        weight: 3,
        fillOpacity: 0.8,
      }).addTo(layer)

      // Build the popup as DOM nodes (not innerHTML) so Firestore-sourced
      // strings can never inject markup.
      const popupContent = document.createElement('div')
      popupContent.className = 'map-popup-card'

      const img = document.createElement('img')
      img.className = 'popup-img'
      img.src = obj.image
      img.alt = name

      const info = document.createElement('div')
      info.className = 'popup-info'

      const heading = document.createElement('h3')
      heading.textContent = name

      const paragraph = document.createElement('p')
      paragraph.textContent = desc

      const checkinBtn = document.createElement('button')
      checkinBtn.className = 'popup-checkin-btn'
      checkinBtn.type = 'button'
      checkinBtn.textContent = `🗺️ ${obj.stars}⭐`
      checkinBtn.addEventListener('click', () => {
        onSelectRef.current(obj)
        const userMarker = userMarkerRef.current
        if (!userMarker) {
          onCheckinRef.current(obj, Infinity)
          return
        }
        const dist = userMarker.getLatLng().distanceTo(L.latLng(obj.coords))
        onCheckinRef.current(obj, dist)
      })

      info.append(heading, paragraph, checkinBtn)
      popupContent.append(img, info)

      // Default auto-pan gently brings the popup into view on click. This is
      // safe now that selecting a location no longer rebuilds the markers (see
      // selectFilteredObjectives) — that rebuild, not the pan, was what
      // previously required a second click.
      marker.bindPopup(popupContent, { maxWidth: 250, className: 'feelio-map-popup' })
      marker.on('popupopen', () => onSelectRef.current(obj))
    })
  }, [objectives, lang])

  // Dark mode tile inversion via CSS — applied to the container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.setAttribute('data-dark', isDark ? 'true' : 'false')
  }, [isDark, containerRef])

  const centerOnUser = () => {
    if (userMarkerRef.current && mapRef.current) {
      mapRef.current.setView(userMarkerRef.current.getLatLng(), 16)
    }
  }

  return { centerOnUser, checkinDistance: CHECKIN_DISTANCE_METERS }
}
