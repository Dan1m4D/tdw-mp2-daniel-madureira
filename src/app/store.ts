import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../features/game/gameSlice'
import adventureReducer from '../features/adventure/adventureSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    adventure: adventureReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
