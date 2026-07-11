import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { usePanelOrder } from '@/shared/data-access/hooks/use-panel-order'
import type { PanelKey } from '@/shared/data-access/hooks/use-panel-order'
import SortablePanel from '@/shared/features/app-layout/sortable-panel'
import { SmartPointerSensor } from '@/shared/features/app-layout/smart-pointer-sensor'
import { OverlayPanel } from '@/shared/features/app-layout/sortable-panel.styled'
import CharacterPanel from '@/shared/features/app-layout/panels/character-panel'
import ProgressBarsPanel from '@/shared/features/app-layout/panels/progress-bars-panel'
import ContentPanel from '@/shared/features/app-layout/panels/content-panel'
import type { ActiveView } from '@/shared/data-access/constants/content-views'
import { DesktopRow } from '@/shared/features/app-layout/desktop-shell.styled'

// Each panel keeps its proportion regardless of its position. The bars panel
// gets extra room (taken from the character) so the vertical bars aren't cramped.
const PANEL_FLEX: Record<PanelKey, string> = {
  character: '38 1 0',
  bars: '22 1 0',
  content: '40 1 0',
}

interface DesktopShellProps {
  active: ActiveView
  onSelect: (target: ActiveView) => void
  onOpenSettings: () => void
  /** Fullscreen game: content panel fills the shell, the others collapse away. */
  expanded: boolean
  onToggleExpand: () => void
}

const DesktopShell = (props: DesktopShellProps) => {
  const { active, onSelect, onOpenSettings, expanded, onToggleExpand } = props
  const { desktopOrder, reorderDesktop } = usePanelOrder()
  const [activeKey, setActiveKey] = useState<PanelKey | null>(null)

  const sensors = useSensors(
    // Small distance threshold so clicks/taps on panel content still work; the
    // smart sensor also refuses to drag from interactive content (buttons, the
    // map, …) so those gestures aren't hijacked by panel reordering.
    useSensor(SmartPointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveKey(event.active.id as PanelKey)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveKey(null)
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderDesktop(active.id as PanelKey, over.id as PanelKey)
    }
  }

  const renderPanel = (key: PanelKey) => {
    if (key === 'character') return <CharacterPanel />
    if (key === 'bars') return <ProgressBarsPanel />
    return (
      <ContentPanel
        active={active}
        onSelect={onSelect}
        onOpenSettings={onOpenSettings}
        expanded={expanded}
        onToggleExpand={onToggleExpand}
      />
    )
  }

  return (
    <DesktopRow $expanded={expanded}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveKey(null)}
      >
        <SortableContext items={desktopOrder} strategy={horizontalListSortingStrategy}>
          {desktopOrder.map((key) => (
            <SortablePanel
              key={key}
              id={key}
              flex={PANEL_FLEX[key]}
              elevated={key === 'bars'}
              collapsed={expanded && key !== 'content'}
            >
              {renderPanel(key)}
            </SortablePanel>
          ))}
        </SortableContext>

        {/* Opaque, full-size copy rendered on top while dragging. */}
        <DragOverlay>
          {activeKey ? <OverlayPanel>{renderPanel(activeKey)}</OverlayPanel> : null}
        </DragOverlay>
      </DndContext>
    </DesktopRow>
  )
}

export default DesktopShell
