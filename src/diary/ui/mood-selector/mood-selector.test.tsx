import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import MoodSelector from '@/diary/ui/mood-selector/mood-selector'
import type { MoodId } from '@/diary/data-access/constants/diary.constants'

const moodLabels: Record<MoodId, string> = {
  excelent: 'Excellent',
  bine: 'Good',
  neutru: 'Neutral',
  trist: 'Sad',
  stresat: 'Stressed',
}

describe('MoodSelector', () => {
  it('renders a button per mood with translated accessible labels', () => {
    renderWithProviders(
      <MoodSelector
        label="How are you?"
        moodLabels={moodLabels}
        selected="neutru"
        onSelect={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Excellent' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stressed' })).toBeInTheDocument()
  })

  it('marks the selected mood pressed', () => {
    renderWithProviders(
      <MoodSelector
        label="How are you?"
        moodLabels={moodLabels}
        selected="trist"
        onSelect={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Sad' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Good' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports the chosen mood id and emoji on click', async () => {
    const onSelect = vi.fn()
    const { user } = renderWithProviders(
      <MoodSelector
        label="How are you?"
        moodLabels={moodLabels}
        selected="neutru"
        onSelect={onSelect}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Excellent' }))

    expect(onSelect).toHaveBeenCalledWith('excelent', '🌟')
  })
})
