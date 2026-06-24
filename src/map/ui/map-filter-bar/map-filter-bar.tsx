import { MAP_CATEGORIES, CATEGORY_LABEL_KEYS } from '@/map/data-access/constants/map.constants'
import type { MapCategory } from '@/map/data-access/constants/map.constants'
import { FilterBar, FilterPill } from '@/map/ui/map-filter-bar/map-filter-bar.styled'

interface MapFilterBarProps {
  active: MapCategory
  labels: Record<MapCategory, string>
  onSelect: (category: MapCategory) => void
}

const MapFilterBar = (props: MapFilterBarProps) => {
  const { active, labels, onSelect } = props

  return (
    <FilterBar>
      {MAP_CATEGORIES.map((cat) => (
        <FilterPill
          key={cat}
          type="button"
          $active={active === cat}
          aria-pressed={active === cat}
          onClick={() => onSelect(cat)}
        >
          {labels[cat]}
        </FilterPill>
      ))}
    </FilterBar>
  )
}

export { CATEGORY_LABEL_KEYS }
export default MapFilterBar
