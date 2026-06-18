import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth'
import { auth } from '@/core/services/firebase'
import { createUserDocument } from '@/user/data-access/api/user.api'

interface Credentials {
  email: string
  password: string
}

interface ChangePasswordArgs {
  currentPassword: string
  newPassword: string
}

// Firebase rejects with English `.message` strings; our own validation rejects
// with i18n keys (the UI resolves both via t(error, { defaultValue: error })).
const toMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'auth.error.unknown'

export const loginThunk = createAsyncThunk<void, Credentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    } catch (error) {
      return rejectWithValue(toMessage(error))
    }
  },
)

export const registerThunk = createAsyncThunk<void, Credentials, { rejectValue: string }>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      )
      const username = credentials.email.split('@')[0]
      await createUserDocument(credential.user.uid, username)
    } catch (error) {
      return rejectWithValue(toMessage(error))
    }
  },
)

export const logoutThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth)
    } catch (error) {
      return rejectWithValue(toMessage(error))
    }
  },
)

export const changePasswordThunk = createAsyncThunk<
  void,
  ChangePasswordArgs,
  { rejectValue: string }
>('auth/changePassword', async (args, { rejectWithValue }) => {
  const user = auth.currentUser

  if (!user || !user.email) {
    return rejectWithValue('auth.error.notLoggedIn')
  }
  if (!args.currentPassword) {
    return rejectWithValue('auth.error.currentPasswordRequired')
  }
  if (!args.newPassword || args.newPassword.length < 6) {
    return rejectWithValue('auth.error.passwordTooShort')
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, args.currentPassword)
    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, args.newPassword)
  } catch (error) {
    return rejectWithValue(toMessage(error))
  }
})
