import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type Coordinate, type RouteResponse } from '../../services/routingAPI'
import { type Card } from '../../services/cardsAPI'

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
  status: 'idle',
}

const adventureSlice = createSlice({
  name: 'adventure',
  initialState,
  reducers: {
    setStartLocation: (state, action: PayloadAction<Coordinate>) => {
      state.startLocation = action.payload
    },
    setEndLocation: (state, action: PayloadAction<Coordinate>) => {
      state.endLocation = action.payload
    },
    setRouteData: (state, action: PayloadAction<RouteData>) => {
      state.routeData = action.payload
      state.status = 'active'
    },
    setDeckId: (state, action: PayloadAction<string>) => {
      state.deckId = action.payload
    },
    addDrawnCard: (state, action: PayloadAction<DrawnCard>) => {
      state.drawnCards.push(action.payload)
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
      state.status = 'idle'
    },
  },
})

export const {
  setStartLocation,
  setEndLocation,
  setRouteData,
  setDeckId,
  addDrawnCard,
  setStatus,
  completeNPC,
  advanceToNextStop,
  resetAdventure,
} = adventureSlice.actions
export default adventureSlice.reducer
