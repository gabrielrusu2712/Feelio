import { createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthUser } from '@/auth/data-access/store/auth.types'
import {
  changePasswordThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from '@/auth/data-access/store/auth.thunks'

const initialState: AuthState = {
  user: null,
  initialized: false,
  status: 'idle',
  error: null,
}

const actionThunks = [loginThunk, registerThunk, logoutThunk, changePasswordThunk] as const

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Dispatched by the auth listener on every onAuthStateChanged.
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
      state.initialized = true
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Logout succeeding resets the action status; the listener clears `user`.
      .addCase(logoutThunk.fulfilled, (state) => {
        state.status = 'idle'
        state.error = null
      })
      .addMatcher(isPending(...actionThunks), (state) => {
        state.status = 'pending'
        state.error = null
      })
      .addMatcher(isFulfilled(loginThunk, registerThunk, changePasswordThunk), (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(isRejected(...actionThunks), (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'auth.error.unknown'
      })
  },
})

export const { setUser, clearAuthError } = authSlice.actions

export default authSlice.reducer
