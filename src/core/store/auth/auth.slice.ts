import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser } from '@/core/store/auth/auth.types'

const initialState: AuthState = {
  user: null,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
      state.initialized = true
    },
  },
})

export const { setUser } = authSlice.actions

export default authSlice.reducer
