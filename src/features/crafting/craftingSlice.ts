import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CraftingState {
  isCraftingForNPC: boolean
  currentNPCId: string | null
  currentNPCName: string | null
  selectedDrink: string | null // drink ID
  selectedDrinkName: string | null
  ingredientsUsed: string[]
}

const initialState: CraftingState = {
  isCraftingForNPC: false,
  currentNPCId: null,
  currentNPCName: null,
  selectedDrink: null,
  selectedDrinkName: null,
  ingredientsUsed: [],
}

const craftingSlice = createSlice({
  name: 'crafting',
  initialState,
  reducers: {
    startCraftingForNPC: (state, action: PayloadAction<{ npcId: string; npcName: string }>) => {
      state.isCraftingForNPC = true
      state.currentNPCId = action.payload.npcId
      state.currentNPCName = action.payload.npcName
    },
    selectDrink: (
      state,
      action: PayloadAction<{
        drinkId: string
        drinkName: string
        ingredients: string[]
      }>
    ) => {
      state.selectedDrink = action.payload.drinkId
      state.selectedDrinkName = action.payload.drinkName
      state.ingredientsUsed = action.payload.ingredients
    },
    completeCrafting: state => {
      // This will be reset by navigation or explicit action
      state.isCraftingForNPC = false
      state.currentNPCId = null
      state.currentNPCName = null
      state.selectedDrink = null
      state.selectedDrinkName = null
      state.ingredientsUsed = []
    },
    resetCrafting: state => {
      state.isCraftingForNPC = false
      state.currentNPCId = null
      state.currentNPCName = null
      state.selectedDrink = null
      state.selectedDrinkName = null
      state.ingredientsUsed = []
    },
  },
})

export const { startCraftingForNPC, selectDrink, completeCrafting, resetCrafting } =
  craftingSlice.actions
export default craftingSlice.reducer
