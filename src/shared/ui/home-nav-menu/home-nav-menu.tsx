import {
  BoardItem,
  BoardList,
  BoardRoot,
  BoardTitle,
  ItemChevron,
  ItemIcon,
  ItemLabel,
} from '@/shared/ui/home-nav-menu/home-nav-menu.styled'

interface HomeNavMenuItem {
  key: string
  label: string
  icon: string
}

interface HomeNavMenuProps {
  title: string
  items: HomeNavMenuItem[]
  onSelect: (key: string) => void
}

// Dumb: the big "pick a destination" board that fills the landscape-home
// content panel, forcing the user to choose where to go. The parent owns the
// items, labels and navigation.
const HomeNavMenu = (props: HomeNavMenuProps) => {
  const { title, items, onSelect } = props

  return (
    <BoardRoot>
      <BoardTitle>{title}</BoardTitle>

      <BoardList role="menu">
        {items.map((item) => (
          <BoardItem
            key={item.key}
            type="button"
            role="menuitem"
            onClick={() => onSelect(item.key)}
          >
            <ItemIcon aria-hidden="true">{item.icon}</ItemIcon>
            <ItemLabel>{item.label}</ItemLabel>
            <ItemChevron aria-hidden="true">›</ItemChevron>
          </BoardItem>
        ))}
      </BoardList>
    </BoardRoot>
  )
}

export default HomeNavMenu
