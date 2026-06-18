export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}

export type AuthStatus = 'idle' | 'pending' | 'succeeded' | 'failed'

export interface AuthState {
  user: AuthUser | null
  // `initialized` flips true after the first onAuthStateChanged fires, i.e. the
  // async session restore has completed. Route guards render null until then.
  initialized: boolean
  // `status`/`error` track the in-flight auth form action (login/register/etc.),
  // kept separate from the session-restore `initialized` flag.
  status: AuthStatus
  error: string | null
}
