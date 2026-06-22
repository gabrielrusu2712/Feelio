import { useCallback, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { STORAGE_KEYS, getItem, setItem } from '@/shared/data-access/utils/local-storage'

// Desktop: the 3 panels reorder freely. (Portrait has a single panel with no
// reordering, so only the desktop order is persisted.)
export type PanelKey = 'character' | 'bars' | 'content'

interface PanelOrder {
  desktop: PanelKey[]
}

const DEFAULTS: PanelOrder = {
  desktop: ['character', 'bars', 'content'],
}

// A stored list is only trusted if it holds exactly the expected members.
const sanitizeList = <T extends string>(stored: unknown, expected: T[]): T[] => {
  if (!Array.isArray(stored) || stored.length !== expected.length) return expected
  return expected.every((item) => stored.includes(item)) ? (stored as T[]) : expected
}

const sanitize = (stored: Partial<PanelOrder> | null): PanelOrder => ({
  desktop: sanitizeList(stored?.desktop, DEFAULTS.desktop),
})

export const usePanelOrder = () => {
  const [orders, setOrders] = useState<PanelOrder>(() =>
    sanitize(getItem<Partial<PanelOrder>>(STORAGE_KEYS.PANEL_ORDER)),
  )

  const reorderDesktop = useCallback((activeId: PanelKey, overId: PanelKey) => {
    setOrders((current) => {
      const desktop = arrayMove(
        current.desktop,
        current.desktop.indexOf(activeId),
        current.desktop.indexOf(overId),
      )
      const next = { ...current, desktop }
      setItem(STORAGE_KEYS.PANEL_ORDER, next)
      return next
    })
  }, [])

  return {
    desktopOrder: orders.desktop,
    reorderDesktop,
  }
}
