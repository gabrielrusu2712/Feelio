import { combineReducers, configureStore } from '@reduxjs/toolkit'
import uiReducer from '@/core/store/ui/ui.slice'

const rootReducer = combineReducers({
  ui: uiReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  })

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
