import OptionButton from '@/shared/ui/option-button/option-button'
import {
  CategoryIcon,
  CategoryLabel,
  CategoryRow,
  CategoryWrap,
  SelectedTitle,
} from '@/wellbeing/ui/category-bar/category-bar.styled'

interface CategoryItem {
  key: string
  icon: string
  label: string
}

interface CategoryBarProps {
  categories: CategoryItem[]
  selected: string
  onSelect: (key: string) => void
}

// Dumb pill row for picking the active challenge category. Reuses the shared
// OptionButton so it reads as the same family as the map filters / mood selector.
// When the row is too narrow for the labels (small windows / mobile) it collapses
// to emoji-only pills and shows the selected category's name as a caption below.
const CategoryBar = (props: CategoryBarProps) => {
  const { categories, selected, onSelect } = props

  const selectedLabel = categories.find((category) => category.key === selected)?.label ?? ''

  return (
    <CategoryWrap>
      <CategoryRow>
        {categories.map((category) => (
          <OptionButton
            key={category.key}
            active={category.key === selected}
            ariaLabel={category.label}
            onSelect={() => onSelect(category.key)}
          >
            <CategoryIcon aria-hidden>{category.icon}</CategoryIcon>
            <CategoryLabel>{category.label}</CategoryLabel>
          </OptionButton>
        ))}
      </CategoryRow>
      <SelectedTitle aria-hidden>{selectedLabel}</SelectedTitle>
    </CategoryWrap>
  )
}

export default CategoryBar
