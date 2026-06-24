import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { useColorMode } from '@/core/providers/theme-provider/color-mode-context'
import {
  selectActiveCategory,
  selectFilteredObjectives,
  selectMapStatus,
  selectSearchQuery,
} from '@/map/data-access/store/map.selectors'
import { loadLocationsThunk } from '@/map/data-access/store/map.thunks'
import { setCategory, setSearchQuery, setSelectedLocation } from '@/map/data-access/store/map.slice'
import type { MapCategory } from '@/map/data-access/constants/map.constants'
import type { MapObjective } from '@/map/data-access/store/map.types'
import { useLeafletMap } from '@/map/data-access/hooks/use-leaflet-map'
import MapSearchBar from '@/map/ui/map-search-bar/map-search-bar'
import MapFilterBar from '@/map/ui/map-filter-bar/map-filter-bar'
import MapFrame from '@/map/ui/map-frame/map-frame'
import Confetti from '@/map/ui/confetti/confetti'
import { MapPageRoot, CheckinMessage } from '@/map/features/map-page/map-page.styled'
import 'leaflet/dist/leaflet.css'

const MapPage = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { colorMode } = useColorMode()

  const status = useAppSelector(selectMapStatus)
  const filteredObjectives = useAppSelector(selectFilteredObjectives)
  const activeCategory = useAppSelector(selectActiveCategory)
  useAppSelector(selectSearchQuery)

  const containerRef = useRef<HTMLDivElement>(null)

  const [checkinMessage, setCheckinMessage] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [rawSearch, setRawSearch] = useState('')

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadLocationsThunk())
    }
  }, [dispatch, status])

  const handleCheckin = useCallback(
    (obj: MapObjective, distance: number) => {
      dispatch(setSelectedLocation(obj))
      if (distance < 200) {
        const claim = {
          placeKey: obj.id,
          placeName: i18n.language === 'ro' ? obj.name.ro : obj.name.en,
          stars: obj.stars || 20,
        }
        localStorage.setItem('feelio_pending_location_claim', JSON.stringify(claim))
        setShowConfetti(true)
        setCheckinMessage(`${t('map.distCheck')} (${Math.round(distance)}m)`)
        setTimeout(() => {
          setShowConfetti(false)
          setCheckinMessage(null)
        }, 3500)
      } else {
        setCheckinMessage(`${t('map.distFail')} (${Math.round(distance)}m)`)
        setTimeout(() => setCheckinMessage(null), 3000)
      }
    },
    [dispatch, t, i18n.language],
  )

  const handleSelect = useCallback(
    (obj: MapObjective) => {
      dispatch(setSelectedLocation(obj))
    },
    [dispatch],
  )

  const { centerOnUser } = useLeafletMap(containerRef, {
    objectives: filteredObjectives,
    lang: i18n.language,
    onSelectLocation: handleSelect,
    onCheckin: handleCheckin,
    isDark: colorMode === 'dark',
  })

  const handleSearchChange = useCallback(
    (value: string) => {
      setRawSearch(value)
      dispatch(setSearchQuery(value))
    },
    [dispatch],
  )

  const categoryLabels = {
    all: t('map.filter.all'),
    nature: t('map.filter.nature'),
    water: t('map.filter.water'),
    culture: t('map.filter.culture'),
  }

  return (
    <MapPageRoot>
      <MapSearchBar
        value={rawSearch}
        placeholder={t('map.searchPlaceholder')}
        onChange={handleSearchChange}
      />

      <MapFilterBar
        active={activeCategory}
        labels={categoryLabels}
        onSelect={(cat: MapCategory) => dispatch(setCategory(cat))}
      />

      <MapFrame
        containerRef={containerRef}
        gpsAriaLabel={t('map.gpsAlt')}
        onCenterUser={centerOnUser}
      />

      {checkinMessage && <CheckinMessage>{checkinMessage}</CheckinMessage>}

      <Confetti active={showConfetti} />
    </MapPageRoot>
  )
}

export default MapPage
