import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../features/game/gameSlice'
import adventureReducer from '../features/adventure/adventureSlice'
import npcReducer from '../features/npc/npcSlice'
import craftingReducer from '../features/crafting/craftingSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    adventure: adventureReducer,
    npc: npcReducer,
    crafting: craftingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
