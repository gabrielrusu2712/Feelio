import { ChatSender } from '@/chat/data-access/constants/chat.constants'
import type { ChatMessage } from '@/chat/data-access/constants/chat.constants'
import { Avatar, Bubble, BubbleRow } from '@/chat/ui/message-bubble/message-bubble.styled'

interface MessageBubbleProps {
  message: ChatMessage
  avatarSrc: string
}

const MessageBubble = (props: MessageBubbleProps) => {
  const { message, avatarSrc } = props
  const isUser = message.sender === ChatSender.USER

  return (
    <BubbleRow $isUser={isUser}>
      {isUser ? null : <Avatar src={avatarSrc} alt="Feelio" />}
      <Bubble $isUser={isUser}>{message.text}</Bubble>
    </BubbleRow>
  )
}

export default MessageBubble
