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
import storage from 'redux-persist/lib/storage'
import authReducer from '@/auth/data-access/store/auth.slice'
import userReducer from '@/user/data-access/store/user.slice'
import uiReducer from '@/core/store/ui/ui.slice'
import { STORAGE_KEYS } from '@/shared/data-access/utils/local-storage'

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
