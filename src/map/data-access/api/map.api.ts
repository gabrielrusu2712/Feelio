import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/core/services/firebase'
import { LOCATIONS_COLLECTION } from '@/map/data-access/constants/map.constants'
import type { MapObjective } from '@/map/data-access/store/map.types'

export const fetchLocations = async (): Promise<MapObjective[]> => {
  const snapshot = await getDocs(collection(db, LOCATIONS_COLLECTION))
  const results: MapObjective[] = []

  snapshot.forEach((docSnap) => {
    const data = docSnap.data()
    if (!data.coords || !Array.isArray(data.coords) || data.coords.length !== 2) return

    const lat = parseFloat(data.coords[0])
    const lng = parseFloat(data.coords[1])
    if (isNaN(lat) || isNaN(lng)) return

    results.push({
      id: docSnap.id,
      name: data.name ?? { ro: 'Locație fără nume', en: 'Unnamed location' },
      coords: [lat, lng],
      category: data.category ?? 'all',
      desc: data.desc ?? { ro: '', en: '' },
      stars: parseInt(data.stars, 10) || 10,
      image: data.image ?? '/assets/character/neutral.png',
    })
  })

  return results
}
