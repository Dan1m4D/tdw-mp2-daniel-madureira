import { configureStore, combineReducers } from '@reduxjs/toolkit'
import gameReducer from '../features/game/gameSlice'
import adventureReducer from '../features/adventure/adventureSlice'
import npcReducer from '../features/npc/npcSlice'
import craftingReducer from '../features/crafting/craftingSlice'

const rootReducer = combineReducers({
  game: gameReducer,
  adventure: adventureReducer,
  npc: npcReducer,
  crafting: craftingReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('reduxState')
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch {
    return undefined
  }
}

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state)
    sessionStorage.setItem('reduxState', serializedState)
  } catch {
    // ignore write errors
  }
}

const preloadedState = loadState()

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
})

store.subscribe(() => {
  saveState(store.getState())
})

export type AppDispatch = typeof store.dispatch
