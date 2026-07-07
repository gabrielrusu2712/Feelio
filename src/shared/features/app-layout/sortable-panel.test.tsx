import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, renderWithProviders, screen } from '@/test/test-utils'

// Stand in for the dnd-kit keyboard sensor's onKeyDown so we can assert exactly
// when the panel forwards a keystroke to it.
const onKeyDownSpy = vi.fn()

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: { onKeyDown: onKeyDownSpy },
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}))
vi.mock('@dnd-kit/utilities', () => ({ CSS: { Transform: { toString: () => undefined } } }))

import SortablePanel from '@/shared/features/app-layout/sortable-panel'

describe('SortablePanel keyboard drag guard', () => {
  beforeEach(() => {
    onKeyDownSpy.mockReset()
  })

  it('does not forward keystrokes typed into a text field to the drag sensor', () => {
    renderWithProviders(
      <SortablePanel id="p1" flex="1">
        <textarea aria-label="message" />
      </SortablePanel>,
    )

    fireEvent.keyDown(screen.getByLabelText('message'), { key: ' ' })

    expect(onKeyDownSpy).not.toHaveBeenCalled()
  })

  it('does not forward keystrokes from a nested button either', () => {
    renderWithProviders(
      <SortablePanel id="p1" flex="1">
        <button type="button">tap</button>
      </SortablePanel>,
    )

    fireEvent.keyDown(screen.getByRole('button', { name: 'tap' }), { key: ' ' })

    expect(onKeyDownSpy).not.toHaveBeenCalled()
  })

  it('forwards keystrokes from non-form content to the drag sensor', () => {
    renderWithProviders(
      <SortablePanel id="p1" flex="1">
        <span>content</span>
      </SortablePanel>,
    )

    fireEvent.keyDown(screen.getByText('content'), { key: ' ' })

    expect(onKeyDownSpy).toHaveBeenCalledTimes(1)
  })
})
