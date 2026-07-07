import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { InputBar, SendButton, Textarea } from '@/chat/ui/chat-input/chat-input.styled'

// The box grows with the text up to this height, then stops and scrolls.
const MAX_HEIGHT = 160

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

  // Auto-grow with content: reset to measure, grow up to MAX_HEIGHT, and only
  // then reveal the scrollbar. This keeps a single line borderless-clean and only
  // scrolls once the message is genuinely long.
  useLayoutEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.style.height = 'auto'
    const next = Math.min(node.scrollHeight, MAX_HEIGHT)
    node.style.height = `${next}px`
    node.style.overflowY = node.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden'
  }, [value])

  // Focus the box when the chat opens so the first keystroke (and Space) lands in
  // the textarea rather than the document body.
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const submit = useCallback(() => {
    onSend()
    textareaRef.current?.focus()
  }, [onSend])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        submit()
      }
    },
    [submit],
  )

  // Keep focus in the textarea when the send button is clicked. Without this the
  // click moves focus to the button, so the next Space keypress "clicks" send
  // again (flipping the draft into the list) instead of typing a space.
  const keepFocus = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }, [])

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
        onMouseDown={keepFocus}
        onClick={submit}
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
