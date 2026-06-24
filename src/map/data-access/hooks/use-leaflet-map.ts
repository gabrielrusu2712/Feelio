import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { MapObjective } from '@/map/data-access/store/map.types'
import {
  CHECKIN_DISTANCE_METERS,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
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
  const userMarkerStableRef = useRef(userMarkerRef)

  useEffect(() => {
    onSelectRef.current = onSelectLocation
  }, [onSelectLocation])
  useEffect(() => {
    onCheckinRef.current = onCheckin
  }, [onCheckin])

  // Mount map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { zoomControl: false }).setView(
      DEFAULT_MAP_CENTER,
      DEFAULT_MAP_ZOOM,
    )

    L.tileLayer(TILE_URL, { attribution: '' }).addTo(map)
    markerLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    setTimeout(() => map.invalidateSize(), 300)

    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current)

        userMarkerRef.current = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: '#3498db',
          color: '#fff',
          weight: 2,
          fillOpacity: 1,
        }).addTo(map)

        map.setView([lat, lng], 15)
      })
    }

    return () => {
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
        fillColor: '#C44A3A',
        color: '#ffffff',
        weight: 3,
        fillOpacity: 0.8,
      }).addTo(layer)

      const popupContent = document.createElement('div')
      popupContent.className = 'map-popup-card'
      popupContent.innerHTML = `
        <img src="${obj.image}" class="popup-img" alt="${name}">
        <div class="popup-info">
          <h3>${name}</h3>
          <p>${desc}</p>
          <button class="popup-checkin-btn" type="button">🗺️ ${obj.stars}⭐</button>
        </div>
      `

      popupContent.querySelector('.popup-checkin-btn')?.addEventListener('click', () => {
        onSelectRef.current(obj)
        const userMarker = userMarkerStableRef.current.current
        if (!userMarker) {
          onCheckinRef.current(obj, Infinity)
          return
        }
        const dist = (userMarker.getLatLng() as L.LatLng).distanceTo(L.latLng(obj.coords))
        onCheckinRef.current(obj, dist)
      })

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
