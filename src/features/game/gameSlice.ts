import { createSlice } from '@reduxjs/toolkit';

interface GameState {
  status: 'idle' | 'playing' | 'finished';
  inventory: string[]; // List of ingredient names player has
}

const initialState: GameState = {
  status: 'idle',
  inventory: [
    'Rum', 'Gin', 'Tequila', 'Whiskey', 'Vodka', // Common spirits
    'Lime Juice', 'Lemon Juice', 'Orange Juice', // Juices
    'Simple Syrup', 'Sugar', 'Honey', // Syrups
    'Fresh Mint', 'Fresh Basil', // Herbs
    'Bitters', 'Vermouth', // Fortified
    'Olive', 'Lemon Peel', 'Orange Peel', // Garnishes
  ],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.status = 'playing';
    },
    addIngredient: (state, action) => {
      if (!state.inventory.includes(action.payload)) {
        state.inventory.push(action.payload);
      }
    },
    removeIngredient: (state, action) => {
      state.inventory = state.inventory.filter((ing) => ing !== action.payload);
    },
  },
});

export const { startGame, addIngredient, removeIngredient } = gameSlice.actions;
export default gameSlice.reducer;

