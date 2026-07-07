import { getFunctions } from 'firebase/functions'
import { firebaseApp } from '@/core/services/firebase/app'

// Cloud Functions client, pinned to the region the functions are deployed in
// (v2 default). The Gemini proxy (feelioChat) lives here so the API key stays
// server-side and never reaches the browser bundle.
export const functions = getFunctions(firebaseApp, 'us-central1')
