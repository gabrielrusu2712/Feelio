import { describe, expect, it, vi } from 'vitest'
import { fireEvent, renderWithProviders, screen } from '@/test/test-utils'
import ChatInput from '@/chat/ui/chat-input/chat-input'

const baseProps = {
  value: '',
  placeholder: 'Write a message…',
  sendLabel: 'Send message',
  disabled: false,
  onChange: vi.fn(),
  onSend: vi.fn(),
}

describe('ChatInput', () => {
  it('reports typed text through onChange', () => {
    const onChange = vi.fn()
    renderWithProviders(<ChatInput {...baseProps} onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'salut' } })

    expect(onChange).toHaveBeenCalledWith('salut')
  })

  it('sends on Enter but not on Shift+Enter', () => {
    const onSend = vi.fn()
    renderWithProviders(<ChatInput {...baseProps} value="salut" onSend={onSend} />)
    const box = screen.getByRole('textbox')

    fireEvent.keyDown(box, { key: 'Enter', shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()

    fireEvent.keyDown(box, { key: 'Enter' })
    expect(onSend).toHaveBeenCalledTimes(1)
  })

  it('never intercepts the spacebar, so it types normally', () => {
    const onSend = vi.fn()
    renderWithProviders(<ChatInput {...baseProps} value="salut" onSend={onSend} />)

    // fireEvent returns false only if a handler called preventDefault.
    const notPrevented = fireEvent.keyDown(screen.getByRole('textbox'), { key: ' ' })

    expect(onSend).not.toHaveBeenCalled()
    expect(notPrevented).toBe(true)
  })

  it('disables the send button for empty or whitespace-only input', () => {
    renderWithProviders(<ChatInput {...baseProps} value="   " />)

    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled()
  })

  it('enables the send button and reports the click', async () => {
    const onSend = vi.fn()
    const { user } = renderWithProviders(<ChatInput {...baseProps} value="salut" onSend={onSend} />)
    const button = screen.getByRole('button', { name: 'Send message' })

    expect(button).toBeEnabled()
    await user.click(button)
    expect(onSend).toHaveBeenCalledTimes(1)
  })

  it('keeps focus in the input when the send button is pressed', () => {
    renderWithProviders(<ChatInput {...baseProps} value="salut" />)

    // The button prevents mousedown default so focus stays in the textarea;
    // fireEvent returns false when preventDefault was called.
    const notPrevented = fireEvent.mouseDown(screen.getByRole('button', { name: 'Send message' }))

    expect(notPrevented).toBe(false)
  })
})
