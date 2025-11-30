import { createSlice } from '@reduxjs/toolkit'

interface GameState {
  status: 'idle' | 'playing' | 'finished'
}

const initialState: GameState = {
  status: 'idle',
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: state => {
      state.status = 'playing'
    },
  },
})

export const { startGame } = gameSlice.actions
export default gameSlice.reducer
