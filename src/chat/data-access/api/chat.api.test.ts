import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// The API layer reads the signed-in user from the firebase barrel; mock it so we
// can toggle the current user per test without touching real Firebase.
vi.mock('@/core/services/firebase', () => ({ auth: { currentUser: null } }))

import { auth } from '@/core/services/firebase'
import { fetchAssistantReply } from '@/chat/data-access/api/chat.api'
import type { ChatTurn } from '@/chat/data-access/constants/chat.constants'

const history: ChatTurn[] = [{ role: 'user', content: 'salut' }]

const authMock = auth as unknown as {
  currentUser: null | { getIdToken: () => Promise<string> }
}
const fetchMock = vi.fn()

describe('fetchAssistantReply', () => {
  beforeEach(() => {
    authMock.currentUser = { getIdToken: vi.fn().mockResolvedValue('id-token') }
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('throws when no user is signed in', async () => {
    authMock.currentUser = null

    await expect(fetchAssistantReply(history)).rejects.toThrow(/signed in/i)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts the history with the id token and returns the trimmed reply', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ reply: '  Salut! Cum te simți?  ' }),
    })

    const reply = await fetchAssistantReply(history)

    expect(reply).toBe('Salut! Cum te simți?')
    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer id-token')
    expect(JSON.parse(init.body)).toEqual({ history })
  })

  it('throws on a non-ok response', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401, json: async () => ({}) })

    await expect(fetchAssistantReply(history)).rejects.toThrow(/failed/i)
  })

  it('throws when the assistant returns an empty reply', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ reply: '   ' }) })

    await expect(fetchAssistantReply(history)).rejects.toThrow(/empty/i)
  })
})
