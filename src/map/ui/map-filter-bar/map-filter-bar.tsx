import { MAP_CATEGORIES } from '@/map/data-access/constants/map.constants'
import type { MapCategory } from '@/map/data-access/constants/map.constants'
import OptionButton from '@/shared/ui/option-button/option-button'
import { FilterBar } from '@/map/ui/map-filter-bar/map-filter-bar.styled'

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
        <OptionButton key={cat} active={active === cat} onSelect={() => onSelect(cat)}>
          {labels[cat]}
        </OptionButton>
      ))}
    </FilterBar>
  )
}

export default MapFilterBar
