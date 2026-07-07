import { useCallback, useLayoutEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { InputBar, SendButton, Textarea } from '@/chat/ui/chat-input/chat-input.styled'

interface ChatInputProps {
  value: string
  placeholder: string
  sendLabel: string
  disabled: boolean
  onChange: (value: string) => void
  onSend: () => void
}

const ChatInput = (props: ChatInputProps) => {
  const { value, placeholder, sendLabel, disabled, onChange, onSend } = props
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow with content, capped by the textarea's own max-height/scroll.
  useLayoutEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${node.scrollHeight}px`
  }, [value])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        onSend()
      }
    },
    [onSend],
  )

  return (
    <InputBar>
      <Textarea
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        rows={1}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <SendButton
        type="button"
        aria-label={sendLabel}
        disabled={disabled || !value.trim()}
        onClick={onSend}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 20V4M12 4L5 11M12 4L19 11"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SendButton>
    </InputBar>
  )
}

export default ChatInput
