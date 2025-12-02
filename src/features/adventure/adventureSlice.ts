import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getRouteWithStops, type Coordinate, type RouteResponse } from '../../services/routingAPI'
import {
  createDeck,
  drawCard,
  reshuffleDeck,
  cardToIngredient,
  type Card,
} from '../../services/cardsAPI'

export interface RouteData {
  mainRoute: RouteResponse
  stopPoints: Coordinate[]
  totalDistance: number // in meters
  totalDuration: number // in seconds
}

export interface DrawnCard {
  card: Card
  ingredient: string
  timestamp: number
}

export interface CompletedNPCRecord {
  npcId: string
  npcName: string
  stopIndex: number
  drinkCrafted: string
  ingredientsUsed: string[]
  craftedAt: number
}

export interface AdventureState {
  startLocation: Coordinate | null
  endLocation: Coordinate | null
  routeData: RouteData | null
  deckId: string | null
  currentStopIndex: number
  drawnCards: DrawnCard[]
  completedNPCs: CompletedNPCRecord[]
  loading: boolean
  error: string | null
  status: 'idle' | 'planning' | 'active' | 'completed'
}

const initialState: AdventureState = {
  startLocation: null,
  endLocation: null,
  routeData: null,
  deckId: null,
  currentStopIndex: 0,
  drawnCards: [],
  completedNPCs: [],
  loading: false,
  error: null,
  status: 'idle',
}

// Async thunk to calculate route
export const calculateRoute = createAsyncThunk(
  'adventure/calculateRoute',
  async (
    { start, end, numStops }: { start: Coordinate; end: Coordinate; numStops?: number },
    { rejectWithValue }
  ) => {
    try {
      const routeData = await getRouteWithStops(start, end, numStops || 3)
      return routeData
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to calculate route')
    }
  }
)

// Async thunk to initialize deck
export const initializeDeck = createAsyncThunk(
  'adventure/initializeDeck',
  async (_, { rejectWithValue }) => {
    try {
      const deckId = await createDeck()
      return deckId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create deck')
    }
  }
)

// Async thunk to draw a card
export const drawCardAndGetIngredient = createAsyncThunk(
  'adventure/drawCard',
  async (deckId: string, { rejectWithValue }) => {
    try {
      let card: Card
      try {
        card = await drawCard(deckId)
      } catch {
        // If deck is empty, reshuffle and try again
        await reshuffleDeck(deckId)
        card = await drawCard(deckId)
      }
      const ingredient = cardToIngredient(card)
      return { card, ingredient, timestamp: Date.now() }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to draw card')
    }
  }
)

const adventureSlice = createSlice({
  name: 'adventure',
  initialState,
  reducers: {
    setStartLocation: (state, action: PayloadAction<Coordinate>) => {
      state.startLocation = action.payload
      state.error = null
    },
    setEndLocation: (state, action: PayloadAction<Coordinate>) => {
      state.endLocation = action.payload
      state.error = null
    },
    setStatus: (state, action: PayloadAction<AdventureState['status']>) => {
      state.status = action.payload
    },
    completeNPC: (
      state,
      action: PayloadAction<{
        npcId: string
        npcName: string
        drinkCrafted: string
        ingredientsUsed: string[]
      }>
    ) => {
      state.completedNPCs.push({
        npcId: action.payload.npcId,
        npcName: action.payload.npcName,
        stopIndex: state.currentStopIndex,
        drinkCrafted: action.payload.drinkCrafted,
        ingredientsUsed: action.payload.ingredientsUsed,
        craftedAt: Date.now(),
      })
    },
    advanceToNextStop: state => {
      if (state.routeData && state.currentStopIndex < state.routeData.stopPoints.length) {
        state.currentStopIndex += 1
      }
    },
    resetAdventure: state => {
      state.startLocation = null
      state.endLocation = null
      state.routeData = null
      state.deckId = null
      state.currentStopIndex = 0
      state.drawnCards = []
      state.completedNPCs = []
      state.error = null
      state.status = 'idle'
      state.loading = false
    },
    clearError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // calculateRoute
      .addCase(calculateRoute.pending, state => {
        state.loading = true
        state.error = null
        state.status = 'planning'
      })
      .addCase(calculateRoute.fulfilled, (state, action) => {
        state.loading = false
        state.routeData = action.payload
        state.status = 'active'
        state.error = null
      })
      .addCase(calculateRoute.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.status = 'idle'
      })
      // initializeDeck
      .addCase(initializeDeck.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(initializeDeck.fulfilled, (state, action) => {
        state.loading = false
        state.deckId = action.payload
        state.error = null
      })
      .addCase(initializeDeck.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // drawCardAndGetIngredient
      .addCase(drawCardAndGetIngredient.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(drawCardAndGetIngredient.fulfilled, (state, action) => {
        state.loading = false
        state.drawnCards.push(action.payload)
        state.error = null
      })
      .addCase(drawCardAndGetIngredient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setStartLocation,
  setEndLocation,
  setStatus,
  completeNPC,
  advanceToNextStop,
  resetAdventure,
  clearError,
} = adventureSlice.actions
export default adventureSlice.reducer
