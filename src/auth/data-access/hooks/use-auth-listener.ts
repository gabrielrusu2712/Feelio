import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/core/services/firebase'
import { useAppDispatch } from '@/core/store'
import { setUser } from '@/auth/data-access/store'
import { loadUserDataThunk, resetUserData } from '@/user/data-access/store'

// Single source of truth for the Firebase session. Collapses the source app's
// two competing onAuthStateChanged handlers into one: it records the session
// identity in the auth slice and kicks off the per-user data load.
export const useAuthListener = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || null

        dispatch(setUser({ uid: firebaseUser.uid, email: firebaseUser.email, displayName }))
        void dispatch(loadUserDataThunk({ uid: firebaseUser.uid, email: firebaseUser.email }))
      } else {
        dispatch(setUser(null))
        dispatch(resetUserData())
      }
    })

    return unsubscribe
  }, [dispatch])
}
