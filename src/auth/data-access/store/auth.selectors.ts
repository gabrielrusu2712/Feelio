import type { RootState } from '@/core/store/store'

const selectAuth = (state: RootState) => state.auth

export const selectIsAuthenticated = (state: RootState) => selectAuth(state).user !== null

export const selectAuthInitialized = (state: RootState) => selectAuth(state).initialized

export const selectAuthStatus = (state: RootState) => selectAuth(state).status

export const selectAuthError = (state: RootState) => selectAuth(state).error

export const selectAuthUser = (state: RootState) => selectAuth(state).user
