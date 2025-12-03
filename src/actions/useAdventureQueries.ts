import { useMutation } from '@tanstack/react-query'
import {
  getRouteWithStops,
  geocodeLocation,
  type Coordinate,
  type RouteResponse,
} from '../services/routingAPI'
import { getWeather, type WeatherData } from '../services/weatherAPI'
import {
  createDeck,
  drawCard,
  reshuffleDeck,
  cardToIngredient,
  type Card,
} from '../services/cardsAPI'

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

// Action for calculating route
export function useCalculateRouteAction() {
  return useMutation({
    mutationFn: async ({
      start,
      end,
      numStops,
    }: {
      start: Coordinate
      end: Coordinate
      numStops?: number
    }) => {
      const routeData = await getRouteWithStops(start, end, numStops || 3)
      return routeData
    },
  })
}

// Action for initializing deck
export function useInitializeDeckAction() {
  return useMutation({
    mutationFn: async () => {
      const deckId = await createDeck()
      return deckId
    },
  })
}

// Action for drawing card
export function useDrawCardAction() {
  return useMutation({
    mutationFn: async (deckId: string) => {
      let card: Card
      try {
        card = await drawCard(deckId)
      } catch {
        // If deck is empty, reshuffle and try again
        await reshuffleDeck(deckId)
        card = await drawCard(deckId)
      }
      const ingredient = cardToIngredient(card)
      return { card, ingredient, timestamp: Date.now() } as DrawnCard
    },
  })
}

// Action for fetching weather
export function useGetWeatherAction() {
  return useMutation({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }): Promise<WeatherData> => {
      const weather = await getWeather(lat, lng)
      return weather
    },
  })
}

// Action for geocoding location
export function useGeocodeLocationAction() {
  return useMutation({
    mutationFn: async (query: string) => {
      const locations = await geocodeLocation(query)
      return locations
    },
  })
}
