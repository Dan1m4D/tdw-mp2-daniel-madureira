import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { getRouteWithStops, type Coordinate, type RouteResponse } from '../../services/routingAPI'

export interface RouteData {
  mainRoute: RouteResponse
  stopPoints: Coordinate[]
  totalDistance: number // in meters
  totalDuration: number // in seconds
}

export interface AdventureState {
  startLocation: Coordinate | null
  endLocation: Coordinate | null
  routeData: RouteData | null
  loading: boolean
  error: string | null
  status: 'idle' | 'planning' | 'active' | 'completed'
}

const initialState: AdventureState = {
  startLocation: null,
  endLocation: null,
  routeData: null,
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
    resetAdventure: state => {
      state.startLocation = null
      state.endLocation = null
      state.routeData = null
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
  },
})

export const { setStartLocation, setEndLocation, setStatus, resetAdventure, clearError } =
  adventureSlice.actions
export default adventureSlice.reducer
