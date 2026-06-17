import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/core/services/firebase'
import { useAppDispatch } from '@/core/store'
import { setUser } from '@/core/store/auth'

export const useAuthListener = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const fallbackName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || null

        let displayName = fallbackName

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            if (data.username) {
              displayName = data.username
            }
          }
        } catch {
          // Firestore unavailable — use fallback
        }

        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName,
          }),
        )
      } else {
        dispatch(setUser(null))
      }
    })

    return unsubscribe
  }, [dispatch])
}
