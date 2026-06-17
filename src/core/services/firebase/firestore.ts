import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from '@/core/services/firebase/app'

export const db = getFirestore(firebaseApp)
