import { SearchIcon, SearchInput, SearchRoot } from '@/map/ui/map-search-bar/map-search-bar.styled'

interface MapSearchBarProps {
  value: string
  placeholder: string
  onChange: (value: string) => void
}

const MapSearchBar = (props: MapSearchBarProps) => {
  const { value, placeholder, onChange } = props

  return (
    <SearchRoot>
      <SearchIcon aria-hidden>🔍</SearchIcon>
      <SearchInput
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </SearchRoot>
  )
}

export default MapSearchBar
