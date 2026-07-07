import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/chat/data-access/constants/chat.constants'
import MessageBubble from '@/chat/ui/message-bubble/message-bubble'
import {
  Avatar,
  BubbleRow,
  Dot,
  TypingBubble,
} from '@/chat/ui/message-bubble/message-bubble.styled'
import { ListRoot } from '@/chat/ui/message-list/message-list.styled'

interface MessageListProps {
  messages: ChatMessage[]
  avatarSrc: string
  typing: boolean
  typingLabel: string
}

const MessageList = (props: MessageListProps) => {
  const { messages, avatarSrc, typing, typingLabel } = props
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, typing])

  return (
    <ListRoot>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} avatarSrc={avatarSrc} />
      ))}
      {typing ? (
        <BubbleRow $isUser={false}>
          <Avatar src={avatarSrc} alt="Feelio" />
          <TypingBubble role="status" aria-label={typingLabel}>
            <Dot />
            <Dot />
            <Dot />
          </TypingBubble>
        </BubbleRow>
      ) : null}
      <div ref={bottomRef} />
    </ListRoot>
  )
}

export default MessageList
