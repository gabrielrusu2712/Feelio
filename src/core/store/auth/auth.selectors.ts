import type { RootState } from '@/core/store/store'

const selectAuth = (state: RootState) => state.auth

export const selectUser = (state: RootState) => selectAuth(state).user

export const selectIsAuthenticated = (state: RootState) => selectAuth(state).user !== null

export const selectAuthInitialized = (state: RootState) => selectAuth(state).initialized
