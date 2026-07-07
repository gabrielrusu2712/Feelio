export const ChatSender = {
  ASSISTANT: 'assistant',
  USER: 'user',
} as const

export type ChatSenderType = (typeof ChatSender)[keyof typeof ChatSender]

export interface ChatMessage {
  id: string
  sender: ChatSenderType
  text: string
}

// A single turn kept for conversational context, in the shape the model expects
// (role + content). The UI-only opening greeting and error bubbles are NOT part
// of this history — only real user/assistant exchanges, matching the source.
// The Gemini model/endpoint and the Feelio system prompt live server-side in the
// Cloudflare chat Worker (worker/src/index.ts).
export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}
