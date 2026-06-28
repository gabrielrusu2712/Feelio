import { describe, expect, it } from 'vitest'
import characterActionReducer, {
  clearCharacterAction,
  triggerCharacterAction,
} from '@/shared/data-access/store/character-action.slice'

describe('character-action slice', () => {
  it('starts empty', () => {
    expect(characterActionReducer(undefined, { type: '@@INIT' })).toBeNull()
  })

  it('triggers an action with an incrementing nonce', () => {
    const first = characterActionReducer(null, triggerCharacterAction('water'))
    expect(first).toEqual({ action: 'water', nonce: 1 })

    const second = characterActionReducer(first, triggerCharacterAction('water'))
    expect(second).toEqual({ action: 'water', nonce: 2 })
  })

  it('clears the action', () => {
    const triggered = characterActionReducer(null, triggerCharacterAction('sport'))

    expect(characterActionReducer(triggered, clearCharacterAction())).toBeNull()
  })
})
