import { auth } from '@/core/services/firebase'
import type { ChatTurn } from '@/chat/data-access/constants/chat.constants'

interface ChatReply {
  reply: string
}

const CHAT_WORKER_URL = import.meta.env.VITE_CHAT_WORKER_URL

// Calls the Feelio chat Worker (Cloudflare), which holds the Gemini key server-side
// and forwards the conversation to the model. The key never reaches the browser.
// The caller's Firebase ID token is sent so the Worker can enforce signed-in-only
// access. Throws (non-2xx, or an empty reply) so the caller shows one error bubble.
export const fetchAssistantReply = async (history: ChatTurn[]): Promise<string> => {
  const user = auth.currentUser
  if (!user) throw new Error('You must be signed in to chat with Feelio.')
  if (!CHAT_WORKER_URL) throw new Error('Chat endpoint is not configured (VITE_CHAT_WORKER_URL).')

  const token = await user.getIdToken()
  const response = await fetch(CHAT_WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ history }),
  })
  if (!response.ok) throw new Error(`Chat request failed (${response.status})`)

  const data = (await response.json()) as ChatReply
  const reply = data.reply?.trim()
  if (!reply) throw new Error('The assistant returned an empty reply')

  return reply
}
