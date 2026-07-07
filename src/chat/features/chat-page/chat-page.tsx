import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatSender } from '@/chat/data-access/constants/chat.constants'
import type { ChatMessage, ChatTurn } from '@/chat/data-access/constants/chat.constants'
import { fetchAssistantReply } from '@/chat/data-access/api/chat.api'
import MessageList from '@/chat/ui/message-list/message-list'
import ChatInput from '@/chat/ui/chat-input/chat-input'
import { ChatPageRoot } from '@/chat/features/chat-page/chat-page.styled'

const AVATAR_SRC = '/assets/chat/feelio-head.png'

// Smart screen for the Feelio AI conversation. Messages render locally; the
// assistant reply comes from Gemini (see chat.api). The opening greeting is
// display-only and is NOT part of the model history, mirroring the source.
const ChatPage = () => {
  const { t } = useTranslation()
  const nextId = useRef(1)
  const historyRef = useRef<ChatTurn[]>([])

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 'seed-greeting', sender: ChatSender.ASSISTANT, text: t('chat.greeting') },
  ])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)

  const appendMessage = useCallback((sender: ChatMessage['sender'], text: string) => {
    nextId.current += 1
    const id = `msg-${nextId.current}`
    setMessages((prev) => [...prev, { id, sender, text }])
  }, [])

  const handleSend = useCallback(() => {
    const text = draft.trim()
    if (!text || pending) return

    appendMessage(ChatSender.USER, text)
    historyRef.current.push({ role: 'user', content: text })
    setDraft('')
    setPending(true)

    void (async () => {
      try {
        const reply = await fetchAssistantReply(historyRef.current)
        historyRef.current.push({ role: 'assistant', content: reply })
        appendMessage(ChatSender.ASSISTANT, reply)
      } catch {
        // The failed turn stays in history so a retry keeps context; the user
        // just sees a friendly error bubble.
        appendMessage(ChatSender.ASSISTANT, t('chat.error'))
      } finally {
        setPending(false)
      }
    })()
  }, [draft, pending, appendMessage, t])

  return (
    <ChatPageRoot>
      <MessageList
        messages={messages}
        avatarSrc={AVATAR_SRC}
        typing={pending}
        typingLabel={t('chat.typing')}
      />
      <ChatInput
        value={draft}
        placeholder={t('chat.placeholder')}
        sendLabel={t('chat.send')}
        disabled={pending}
        onChange={setDraft}
        onSend={handleSend}
      />
    </ChatPageRoot>
  )
}

export default ChatPage
