import { ChatSender } from '@/chat/data-access/constants/chat.constants'
import type { ChatMessage } from '@/chat/data-access/constants/chat.constants'
import { Avatar, Bubble, BubbleRow } from '@/chat/ui/message-bubble/message-bubble.styled'

interface MessageBubbleProps {
  message: ChatMessage
  avatarEmoji: string
}

const MessageBubble = (props: MessageBubbleProps) => {
  const { message, avatarEmoji } = props
  const isUser = message.sender === ChatSender.USER

  return (
    <BubbleRow $isUser={isUser}>
      {isUser ? null : <Avatar aria-hidden="true">{avatarEmoji}</Avatar>}
      <Bubble $isUser={isUser}>{message.text}</Bubble>
    </BubbleRow>
  )
}

export default MessageBubble
