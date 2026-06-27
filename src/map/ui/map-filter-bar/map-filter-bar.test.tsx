import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import MapFilterBar from '@/map/ui/map-filter-bar/map-filter-bar'
import type { MapCategory } from '@/map/data-access/constants/map.constants'

const labels: Record<MapCategory, string> = {
  all: 'All',
  nature: 'Parks',
  water: 'Waterscapes',
  culture: 'Tourist Attractions',
}

describe('MapFilterBar', () => {
  it('renders a pill per category and marks the active one pressed', () => {
    renderWithProviders(<MapFilterBar active="water" labels={labels} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Waterscapes' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports the selected category on click', async () => {
    const onSelect = vi.fn()
    const { user } = renderWithProviders(
      <MapFilterBar active="all" labels={labels} onSelect={onSelect} />,
    )

    await user.click(screen.getByRole('button', { name: 'Tourist Attractions' }))

    expect(onSelect).toHaveBeenCalledWith('culture')
  })
})
