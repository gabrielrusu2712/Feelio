import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatSender } from '@/chat/data-access/constants/chat.constants'
import type { ChatMessage } from '@/chat/data-access/constants/chat.constants'
import MessageList from '@/chat/ui/message-list/message-list'
import ChatInput from '@/chat/ui/chat-input/chat-input'
import { ChatPageRoot } from '@/chat/features/chat-page/chat-page.styled'

const AVATAR_EMOJI = '🐼'

// Design-only screen: the layout/visuals for the Feelio AI conversation.
// Sending only appends the user's own bubble locally — no assistant reply is
// wired up yet, since the AI integration itself is out of scope here.
const ChatPage = () => {
  const { t } = useTranslation()
  const nextId = useRef(1)

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 'seed-greeting', sender: ChatSender.ASSISTANT, text: t('chat.greeting') },
  ])
  const [draft, setDraft] = useState('')

  const handleSend = useCallback(() => {
    const text = draft.trim()
    if (!text) return

    nextId.current += 1
    setMessages((prev) => [...prev, { id: `msg-${nextId.current}`, sender: ChatSender.USER, text }])
    setDraft('')
  }, [draft])

  return (
    <ChatPageRoot>
      <MessageList messages={messages} avatarEmoji={AVATAR_EMOJI} />
      <ChatInput
        value={draft}
        placeholder={t('chat.placeholder')}
        sendLabel={t('chat.send')}
        onChange={setDraft}
        onSend={handleSend}
      />
    </ChatPageRoot>
  )
}

export default ChatPage
