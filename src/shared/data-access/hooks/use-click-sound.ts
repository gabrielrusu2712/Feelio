import { useEffect } from 'react'
import { playClickSound } from '@/shared/data-access/audio/sound-service'

const CLICKABLE_SELECTOR = [
  'button',
  'a[href]',
  '[role="button"]',
  '[role="menuitem"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
].join(',')

const findClickableControl = (target: EventTarget | null): Element | null => {
  if (!(target instanceof Element)) return null
  return target.closest(CLICKABLE_SELECTOR)
}

const isDisabled = (control: Element): boolean =>
  control.matches(':disabled, [aria-disabled="true"]')

// Controls that already play their own sound (stat +/- buttons, the
// character) opt out with this attribute instead of a click-sound blip. Checked
// from the actual click target, not the matched control — the skip-marked
// element (e.g. the character sprite) can sit *inside* a control matched by
// CLICKABLE_SELECTOR (e.g. dnd-kit's draggable `role="button"` panel wrapper).
const isOptedOut = (target: Element): boolean => !!target.closest('[data-skip-click-sound]')

// App-wide feedback blip on every button/link click, capture-phase so it fires
// regardless of where the click is handled. Registers on both `pointerdown`
// (snappier for mouse/touch) and `click` (covers keyboard activation) — the
// debounce in the sound service keeps a single mouse click from double-firing.
export const useClickSound = (): void => {
  useEffect(() => {
    const handlePointerOrClick = (event: PointerEvent | MouseEvent) => {
      if (event.button !== 0) return
      if (!(event.target instanceof Element) || isOptedOut(event.target)) return

      const control = findClickableControl(event.target)
      if (!control || isDisabled(control)) return

      playClickSound()
    }

    document.addEventListener('pointerdown', handlePointerOrClick, true)
    document.addEventListener('click', handlePointerOrClick, true)
    return () => {
      document.removeEventListener('pointerdown', handlePointerOrClick, true)
      document.removeEventListener('click', handlePointerOrClick, true)
    }
  }, [])
}
