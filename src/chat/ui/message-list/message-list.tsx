import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/chat/data-access/constants/chat.constants'
import MessageBubble from '@/chat/ui/message-bubble/message-bubble'
import { ListRoot } from '@/chat/ui/message-list/message-list.styled'

interface MessageListProps {
  messages: ChatMessage[]
  avatarEmoji: string
}

const MessageList = (props: MessageListProps) => {
  const { messages, avatarEmoji } = props
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  return (
    <ListRoot>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} avatarEmoji={avatarEmoji} />
      ))}
      <div ref={bottomRef} />
    </ListRoot>
  )
}

export default MessageList
