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
