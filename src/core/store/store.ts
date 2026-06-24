import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import type { WebStorage } from 'redux-persist'
import authReducer from '@/auth/data-access/store/auth.slice'
import userReducer from '@/user/data-access/store/user.slice'
import uiReducer from '@/core/store/ui/ui.slice'
import diaryReducer from '@/diary/data-access/store/diary.slice'
import mapReducer from '@/map/data-access/store/map.slice'
import albumReducer from '@/album/data-access/store/album.slice'
import { STORAGE_KEYS } from '@/shared/data-access/utils/local-storage'

// redux-persist's `redux-persist/lib/storage` subpath breaks Vite's dependency
// optimizer, so we provide the equivalent localStorage engine inline (fail-safe).
const storage: WebStorage = {
  getItem: (key) => {
    try {
      return Promise.resolve(localStorage.getItem(key))
    } catch {
      return Promise.resolve(null)
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // storage unavailable / over quota — non-fatal
    }
    return Promise.resolve()
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // non-fatal
    }
    return Promise.resolve()
  },
}

// Persist only the durable per-user fields so they paint instantly on reload,
// before loadUserDataThunk refreshes from Firestore. Transient status/error are
// intentionally excluded; auth/ui stay in-memory (Firebase is the auth source).
const userPersistConfig = {
  key: STORAGE_KEYS.USER,
  storage,
  whitelist: ['username', 'stats', 'totalDays', 'totalStars'],
}

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  user: persistReducer(userPersistConfig, userReducer),
  diary: diaryReducer,
  map: mapReducer,
  album: albumReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // redux-persist dispatches these with non-serializable payloads.
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })

export const store = setupStore()

export const persistor = persistStore(store)

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
