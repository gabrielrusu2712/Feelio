import { httpsCallable } from 'firebase/functions'
import { functions } from '@/core/services/firebase'
import type { ChatTurn } from '@/chat/data-access/constants/chat.constants'

interface ChatReply {
  reply: string
}

// Calls the `feelioChat` Cloud Function, which holds the Gemini key server-side
// and forwards the conversation to the model. The key never reaches the browser.
// Throws (callable errors, or an empty reply) so the caller shows one error bubble.
const callFeelioChat = httpsCallable<{ history: ChatTurn[] }, ChatReply>(functions, 'feelioChat')

export const fetchAssistantReply = async (history: ChatTurn[]): Promise<string> => {
  const result = await callFeelioChat({ history })
  const reply = result.data?.reply?.trim()
  if (!reply) throw new Error('feelioChat returned an empty reply')

  return reply
}
