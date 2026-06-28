import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CharacterAction } from '@/shared/data-access/constants/character'
import type { RootState } from '@/core/store/store'

// A transient signal so a stat increment in one panel can make the character (in
// another panel) play its matching animation. The nonce re-fires the consumer
// even when the same action repeats.
interface CharacterActionSignal {
  action: CharacterAction
  nonce: number
}

const characterActionSlice = createSlice({
  name: 'characterAction',
  initialState: null as CharacterActionSignal | null,
  reducers: {
    triggerCharacterAction: (state, action: PayloadAction<CharacterAction>) => ({
      action: action.payload,
      nonce: (state?.nonce ?? 0) + 1,
    }),
    clearCharacterAction: () => null,
  },
})

export const { triggerCharacterAction, clearCharacterAction } = characterActionSlice.actions

export const selectCharacterAction = (state: RootState) => state.characterAction

export default characterActionSlice.reducer
