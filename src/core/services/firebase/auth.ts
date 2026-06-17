import { getAuth } from 'firebase/auth'
import { firebaseApp } from '@/core/services/firebase/app'

export const auth = getAuth(firebaseApp)
