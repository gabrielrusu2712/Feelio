import { useEffect, useRef, useState } from 'react'
import { MenuButton, MenuItem, MenuList, MenuRoot } from '@/shared/ui/page-menu/page-menu.styled'

export interface PageMenuItem {
  key: string
  label: string
}

interface PageMenuProps {
  items: PageMenuItem[]
  active: string
  onSelect: (key: string) => void
  /** Accessible label for the toggle button. */
  ariaLabel: string
}

// Dumb: a "…" toggle that opens a dropdown of destinations. Closes on select,
// click-outside, or Escape. The parent owns the active state and translation.
const PageMenu = (props: PageMenuProps) => {
  const { items, active, onSelect, ariaLabel } = props
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleSelect = (key: string) => {
    onSelect(key)
    setOpen(false)
  }

  return (
    <MenuRoot ref={rootRef}>
      <MenuButton
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((previous) => !previous)}
      >
        …
      </MenuButton>

      {open && (
        <MenuList role="menu">
          {items.map((item) => (
            <li key={item.key} role="none">
              <MenuItem
                type="button"
                role="menuitem"
                $active={item.key === active}
                aria-current={item.key === active ? 'true' : undefined}
                onClick={() => handleSelect(item.key)}
              >
                {item.label}
              </MenuItem>
            </li>
          ))}
        </MenuList>
      )}
    </MenuRoot>
  )
}

export default PageMenu
