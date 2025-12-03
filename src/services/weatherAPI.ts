import axios from 'axios'
import { WEATHER_API, WEATHER_CODE_DESCRIPTIONS } from '../constants'

export interface WeatherData {
  temperature: number
  weatherCode: number
  weatherDescription: string
  windSpeed: number
  humidity: number
  precipitation: number
  cloudCover: number
}

export interface WeatherMoodModifier {
  temperature_modifier: number // -5 to 5
  precipitation_modifier: number // -3 to 3
  cloudiness_modifier: number // -2 to 2
  wind_modifier: number // -2 to 2
  humidity_modifier: number // -1 to 1
  overall_mood: 'happy' | 'neutral' | 'sad' | 'energetic' | 'calm'
  suggested_ingredients: string[] // Additional ingredients to add
  removed_ingredients: string[] // Ingredients to remove
  description: string
}

/**
 * Fetch current weather for a location
 */
export async function getWeather(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    const response = await axios.get(WEATHER_API, {
      params: {
        latitude,
        longitude,
        current: [
          'temperature_2m',
          'weather_code',
          'wind_speed_10m',
          'relative_humidity_2m',
          'precipitation',
          'cloud_cover',
        ].join(','),
        timezone: 'auto',
      },
    })

    const current = response.data.current

    return {
      temperature: current.temperature_2m,
      weatherCode: current.weather_code,
      weatherDescription: WEATHER_CODE_DESCRIPTIONS[current.weather_code] || 'Unknown',
      windSpeed: current.wind_speed_10m,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation || 0,
      cloudCover: current.cloud_cover,
    }
  } catch (error) {
    console.error('Weather API error:', error)
    // Return neutral weather on error
    return {
      temperature: 20,
      weatherCode: 0,
      weatherDescription: 'Unknown',
      windSpeed: 0,
      humidity: 50,
      precipitation: 0,
      cloudCover: 0,
    }
  }
}

/**
 * Calculate mood modifier based on weather conditions
 */
export function calculateWeatherMoodModifier(weather: WeatherData): WeatherMoodModifier {
  // 1. Calculate Modifiers using concise ternary logic
  const temperatureModifier =
    weather.temperature < 15
      ? -3
      : weather.temperature < 18
        ? 1
        : weather.temperature <= 24
          ? 3
          : weather.temperature <= 28
            ? 1
            : -2

  const precipitationModifier =
    weather.precipitation === 0
      ? 2
      : weather.precipitation <= 1
        ? 0
        : weather.precipitation <= 5
          ? -2
          : -3

  const cloudinessModifier =
    weather.cloudCover <= 25 ? 2 : weather.cloudCover <= 50 ? 1 : weather.cloudCover <= 75 ? -1 : -2

  const windModifier =
    weather.windSpeed <= 10 ? 1 : weather.windSpeed <= 20 ? 0 : weather.windSpeed <= 30 ? -1 : -2

  const humidityModifier = weather.humidity >= 40 && weather.humidity <= 60 ? 1 : -1

  // 2. Calculate Overall Mood Score
  const score =
    temperatureModifier +
    precipitationModifier +
    cloudinessModifier +
    windModifier +
    humidityModifier

  // 3. Determine Mood Category
  let overallMood: WeatherMoodModifier['overall_mood'] = 'neutral'
  if (score >= 5) overallMood = 'happy'
  else if (score >= 2) overallMood = 'energetic'
  else if (score >= -2) overallMood = 'neutral'
  else if (score >= -5) overallMood = 'calm'
  else overallMood = 'sad'

  // 4. Determine Ingredients based on Mood
  const moodIngredients: Record<string, { add: string[]; remove: string[] }> = {
    happy: { add: ['Fresh Mint', 'Lemon Peel'], remove: [] },
    energetic: { add: ['Fresh Basil', 'Ginger'], remove: [] },
    sad: { add: ['Honey', 'Vermouth'], remove: ['Fresh Basil'] },
    calm: { add: ['Honey', 'Fresh Mint'], remove: ['Ginger'] },
    neutral: { add: [], remove: [] },
  }

  const { add, remove } = moodIngredients[overallMood] || moodIngredients.neutral

  return {
    temperature_modifier: temperatureModifier,
    precipitation_modifier: precipitationModifier,
    cloudiness_modifier: cloudinessModifier,
    wind_modifier: windModifier,
    humidity_modifier: humidityModifier,
    overall_mood: overallMood,
    suggested_ingredients: add,
    removed_ingredients: remove,
    description: `Weather: ${weather.weatherDescription} | ${Math.round(weather.temperature)}°C | ${weather.humidity}% humidity`,
  }
}

/**
 * Apply weather mood modifier to NPC ingredient requirements
 */
export function applyWeatherModifierToIngredients(
  baseIngredients: string[],
  modifier: WeatherMoodModifier
): string[] {
  let modifiedIngredients = [...baseIngredients]

  // Remove ingredients based on mood
  modifiedIngredients = modifiedIngredients.filter(
    ing => !modifier.removed_ingredients.includes(ing)
  )

  // Add suggested ingredients if not already present
  for (const ingredient of modifier.suggested_ingredients) {
    if (!modifiedIngredients.includes(ingredient)) {
      modifiedIngredients.push(ingredient)
    }
  }

  return modifiedIngredients
}

/**
 * Get mood description based on weather
 */
export function getMoodDescription(weather: WeatherData): string {
  if (weather.temperature > 28) {
    return "It's too hot - the NPCs seem irritable and want refreshing drinks"
  } else if (weather.temperature < 0) {
    return "It's freezing - the NPCs are grumpy and want warm, comforting drinks"
  } else if (weather.precipitation > 5) {
    return "It's pouring rain - the NPCs are gloomy and need cheering up"
  } else if (weather.windSpeed > 30) {
    return "It's very windy - the NPCs are tense and irritable"
  } else if (weather.cloudCover > 75 && weather.precipitation === 0 && weather.temperature < 15) {
    return "It's a dark, gloomy day - the NPCs are melancholic"
  } else if (weather.temperature >= 18 && weather.temperature <= 24 && weather.cloudCover <= 50) {
    return 'Perfect weather! The NPCs are happy and energetic'
  } else if (weather.humidity < 30) {
    return "It's very dry - the NPCs are thirsty"
  } else {
    return 'The weather is pleasant - the NPCs are in a neutral mood'
  }
}
