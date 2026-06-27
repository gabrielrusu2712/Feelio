import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { useColorMode } from '@/core/providers/theme-provider/color-mode-context'
import { writePendingClaim } from '@/shared/data-access/utils/pending-claim'
import {
  loadLocationsThunk,
  selectActiveCategory,
  selectFilteredObjectives,
  selectMapStatus,
  setCategory,
  setSearchQuery,
  setSelectedLocation,
} from '@/map/data-access/store'
import type { MapObjective } from '@/map/data-access/store'
import {
  CATEGORY_LABEL_KEYS,
  CHECKIN_DISTANCE_METERS,
  MAP_CATEGORIES,
} from '@/map/data-access/constants/map.constants'
import type { MapCategory } from '@/map/data-access/constants/map.constants'
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

  const containerRef = useRef<HTMLDivElement>(null)
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [checkinMessage, setCheckinMessage] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [rawSearch, setRawSearch] = useState('')

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadLocationsThunk())
    }
  }, [dispatch, status])

  // Clear any in-flight check-in message timer if the page unmounts first.
  useEffect(() => () => clearTimeout(messageTimerRef.current ?? undefined), [])

  const handleCheckin = useCallback(
    (obj: MapObjective, distance: number) => {
      dispatch(setSelectedLocation(obj))
      clearTimeout(messageTimerRef.current ?? undefined)

      if (distance < CHECKIN_DISTANCE_METERS) {
        writePendingClaim({
          placeKey: obj.id,
          placeName: i18n.language === 'ro' ? obj.name.ro : obj.name.en,
          stars: obj.stars || 20,
        })
        setShowConfetti(true)
        setCheckinMessage(`${t('map.distCheck')} (${Math.round(distance)}m)`)
        messageTimerRef.current = setTimeout(() => {
          setShowConfetti(false)
          setCheckinMessage(null)
        }, 3500)
      } else {
        setCheckinMessage(`${t('map.distFail')} (${Math.round(distance)}m)`)
        messageTimerRef.current = setTimeout(() => setCheckinMessage(null), 3000)
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

  const categoryLabels = MAP_CATEGORIES.reduce(
    (labels, category) => {
      labels[category] = t(CATEGORY_LABEL_KEYS[category])
      return labels
    },
    {} as Record<MapCategory, string>,
  )

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
