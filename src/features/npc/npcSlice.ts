import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { WeatherData, WeatherMoodModifier } from '../../services/weatherAPI'
import {
  calculateWeatherMoodModifier,
  applyWeatherModifierToIngredients,
} from '../../services/weatherAPI'

export interface NPC {
  id: string
  name: string
  description: string
  baseRequirements: string[]
  currentRequirements: string[]
  mood: WeatherMoodModifier['overall_mood']
  moodScore: number // -10 to 10
  locationWeather: WeatherData
  moodDescription: string
  isGenerated: boolean
}

interface NPCState {
  currentNPC: NPC | null
  generatedNPCs: NPC[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const NPC_NAMES = [
  'Marcus',
  'Sofia',
  'James',
  'Elena',
  'Samuel',
  'Isabella',
  'Lucas',
  'Olivia',
  'Gabriel',
  'Emma',
  'Vincent',
  'Charlotte',
  'Alexander',
  'Amelia',
  'Sebastian',
]

const NPC_DESCRIPTIONS: Record<string, string> = {
  Marcus: 'A seasoned traveler who loves exploring new cities',
  Sofia: 'A fashionable artist visiting the region',
  James: 'A businessman passing through on a trip',
  Elena: 'A local historian passionate about culture',
  Samuel: 'An adventurous chef searching for inspirations',
  Isabella: 'A romantic poet looking for muse',
  Lucas: 'A photography enthusiast capturing memories',
  Olivia: 'A student backpacking across Europe',
  Gabriel: 'A musician on tour between cities',
  Emma: 'A writer researching for her novel',
  Vincent: 'A retired sailor with stories to tell',
  Charlotte: 'A fashion designer on business',
  Alexander: 'A food critic evaluating local cuisine',
  Amelia: 'A nature photographer exploring landscapes',
  Sebastian: 'A student traveling on a budget',
}

// Base ingredient requirements for NPCs
const BASE_INGREDIENTS = [
  'Rum',
  'Gin',
  'Vodka',
  'Tequila',
  'Whiskey',
  'Lime Juice',
  'Lemon Juice',
  'Orange Juice',
  'Cranberry Juice',
  'Pineapple Juice',
  'Grenadine Syrup',
  'Simple Syrup',
  'Mint',
  'Basil',
  'Vermouth',
  'Cointreau',
  'Angostura Bitters',
  'Lime Peel',
  'Orange Peel',
]

function getRandomNPCName(): string {
  const usedNames = new Set<string>()
  const name = NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)]
  if (usedNames.has(name)) {
    return getRandomNPCName()
  }
  usedNames.add(name)
  return name
}

function generateNPCRequirements(availableIngredients: string[]): string[] {
  const numRequirements = Math.floor(Math.random() * 3) + 3 // 3-5 ingredients
  const requirements: string[] = []

  // Filter to only use available ingredients
  const filteredIngredients = availableIngredients.filter(ing => BASE_INGREDIENTS.includes(ing))

  // If not enough available ingredients, add some base ingredients
  const ingredientPool =
    filteredIngredients.length > 0
      ? [...filteredIngredients, ...BASE_INGREDIENTS]
      : BASE_INGREDIENTS

  while (requirements.length < numRequirements) {
    const ingredient = ingredientPool[Math.floor(Math.random() * ingredientPool.length)]
    if (!requirements.includes(ingredient)) {
      requirements.push(ingredient)
    }
  }

  return requirements
}

export function generateNPC(
  locationWeather: WeatherData,
  locationName: string,
  availableIngredients: string[] = []
): NPC {
  const name = getRandomNPCName()
  const baseRequirements = generateNPCRequirements(availableIngredients)
  const weatherModifier = calculateWeatherMoodModifier(locationWeather)
  const currentRequirements = applyWeatherModifierToIngredients(baseRequirements, weatherModifier)

  return {
    id: `${name}-${Date.now()}`,
    name,
    description: `${NPC_DESCRIPTIONS[name] || 'A curious traveler'} passing through ${locationName}`,
    baseRequirements,
    currentRequirements,
    mood: weatherModifier.overall_mood,
    moodScore: Math.round(
      (weatherModifier.temperature_modifier +
        weatherModifier.precipitation_modifier +
        weatherModifier.cloudiness_modifier +
        weatherModifier.wind_modifier +
        weatherModifier.humidity_modifier) *
        2
    ),
    locationWeather,
    moodDescription: weatherModifier.description,
    isGenerated: true,
  }
}

const initialState: NPCState = {
  currentNPC: null,
  generatedNPCs: [],
  status: 'idle',
  error: null,
}

const npcSlice = createSlice({
  name: 'npc',
  initialState,
  reducers: {
    setCurrentNPC: (state, action: PayloadAction<NPC>) => {
      state.currentNPC = action.payload
      state.generatedNPCs.push(action.payload)
      state.status = 'succeeded'
      state.error = null
    },
    clearCurrentNPC: state => {
      state.currentNPC = null
      state.status = 'idle'
    },
    setNPCStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload
    },
    setNPCError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      if (action.payload) {
        state.status = 'failed'
      }
    },
    updateNPCRequirements: (state, action: PayloadAction<string[]>) => {
      if (state.currentNPC) {
        state.currentNPC.currentRequirements = action.payload
      }
    },
    // Generate a new NPC based on weather
    generateNewNPCFromWeather: {
      reducer(state, action: PayloadAction<{ npc: NPC }>) {
        state.currentNPC = action.payload.npc
        state.generatedNPCs.push(action.payload.npc)
        state.status = 'succeeded'
        state.error = null
      },
      prepare(npc: NPC) {
        return {
          payload: { npc },
        }
      },
    },
  },
})

export const {
  setCurrentNPC,
  clearCurrentNPC,
  setNPCStatus,
  setNPCError,
  updateNPCRequirements,
  generateNewNPCFromWeather,
} = npcSlice.actions

// Selectors
export const selectCurrentNPC = (state: { npc: NPCState }) => state.npc.currentNPC
export const selectNPCStatus = (state: { npc: NPCState }) => state.npc.status
export const selectNPCError = (state: { npc: NPCState }) => state.npc.error
export const selectGeneratedNPCs = (state: { npc: NPCState }) => state.npc.generatedNPCs
export const selectCurrentNPCRequirements = (state: { npc: NPCState }) =>
  state.npc.currentNPC?.currentRequirements || []

export default npcSlice.reducer
