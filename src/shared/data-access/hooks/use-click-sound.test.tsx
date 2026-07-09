import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@/test/test-utils'
import { useClickSound } from '@/shared/data-access/hooks/use-click-sound'

// The real service constructs an <audio> and calls .play() (unimplemented in
// jsdom); mock it so we can assert *whether* a click blip is requested.
vi.mock('@/shared/data-access/audio/sound-service', () => ({
  playClickSound: vi.fn(),
}))
import { playClickSound } from '@/shared/data-access/audio/sound-service'

const playMock = vi.mocked(playClickSound)

// Minimal harness that just wires the app-wide listener.
const Harness = () => {
  useClickSound()
  return (
    <div>
      <button>plain</button>
      <a href="/somewhere">link</a>
      <button disabled>disabled</button>
      <button aria-disabled="true">aria-disabled</button>
      <button data-skip-click-sound>opted-out</button>
      <span>not-a-control</span>
      {/* dnd-kit shape: a skip-marked child inside a role="button" wrapper. */}
      <div role="button">
        <img data-skip-click-sound alt="sprite" width={4} height={4} />
      </div>
    </div>
  )
}

describe('useClickSound', () => {
  beforeEach(() => {
    render(<Harness />)
  })

  afterEach(() => {
    playMock.mockClear()
  })

  it('plays a blip on a primary-button click of a plain control', () => {
    fireEvent.pointerDown(screen.getByText('plain'), { button: 0 })
    expect(playMock).toHaveBeenCalledTimes(1)
  })

  it('plays for links with an href', () => {
    fireEvent.pointerDown(screen.getByText('link'), { button: 0 })
    expect(playMock).toHaveBeenCalled()
  })

  it('ignores non-primary (e.g. right-click) buttons', () => {
    fireEvent.pointerDown(screen.getByText('plain'), { button: 2 })
    expect(playMock).not.toHaveBeenCalled()
  })

  it('ignores disabled and aria-disabled controls', () => {
    fireEvent.pointerDown(screen.getByText('disabled'), { button: 0 })
    fireEvent.pointerDown(screen.getByText('aria-disabled'), { button: 0 })
    expect(playMock).not.toHaveBeenCalled()
  })

  it('ignores controls marked data-skip-click-sound', () => {
    fireEvent.pointerDown(screen.getByText('opted-out'), { button: 0 })
    expect(playMock).not.toHaveBeenCalled()
  })

  it('ignores a skip-marked element even inside a clickable wrapper', () => {
    fireEvent.pointerDown(screen.getByRole('img', { name: 'sprite' }), { button: 0 })
    expect(playMock).not.toHaveBeenCalled()
  })

  it('ignores clicks that miss any control', () => {
    fireEvent.pointerDown(screen.getByText('not-a-control'), { button: 0 })
    expect(playMock).not.toHaveBeenCalled()
  })

  it('also fires on keyboard-style click events (no pointerdown)', () => {
    fireEvent.click(screen.getByText('plain'), { button: 0 })
    expect(playMock).toHaveBeenCalledTimes(1)
  })
})
