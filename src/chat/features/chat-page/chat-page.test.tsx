import { describe, expect, it, vi } from 'vitest'
import i18n from 'i18next'

vi.mock('@/chat/data-access/api/chat.api', () => ({
  fetchAssistantReply: vi.fn(),
}))

import { fetchAssistantReply } from '@/chat/data-access/api/chat.api'
import { renderWithProviders, screen } from '@/test/test-utils'
import ChatPage from '@/chat/features/chat-page/chat-page'

const mockReply = vi.mocked(fetchAssistantReply)

describe('ChatPage', () => {
  it('opens with the greeting bubble', () => {
    renderWithProviders(<ChatPage />)

    expect(screen.getByText(i18n.t('chat.greeting'))).toBeInTheDocument()
  })

  it('shows the sent message, forwards history, and renders the assistant reply', async () => {
    mockReply.mockResolvedValue('Salut! Cum te simți?')
    const { user } = renderWithProviders(<ChatPage />)

    await user.type(screen.getByRole('textbox'), 'salut')
    await user.keyboard('{Enter}')

    expect(screen.getByText('salut')).toBeInTheDocument()
    expect(await screen.findByText('Salut! Cum te simți?')).toBeInTheDocument()
    // The history is a single mutable array (the assistant turn is appended to it
    // after the call), so assert the first turn rather than the whole array.
    expect(mockReply).toHaveBeenCalledTimes(1)
    expect(mockReply.mock.calls[0][0][0]).toEqual({ role: 'user', content: 'salut' })
  })

  it('shows an error bubble when the assistant call fails', async () => {
    mockReply.mockRejectedValue(new Error('offline'))
    const { user } = renderWithProviders(<ChatPage />)

    await user.type(screen.getByRole('textbox'), 'salut')
    await user.keyboard('{Enter}')

    expect(screen.getByText('salut')).toBeInTheDocument()
    expect(await screen.findByText(i18n.t('chat.error'))).toBeInTheDocument()
  })
})
