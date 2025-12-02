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
  // Temperature modifier (optimal around 20°C)
  let temperatureModifier = 0
  if (weather.temperature >= 18 && weather.temperature <= 24) {
    temperatureModifier = 3 // Happy/energetic weather
  } else if (weather.temperature >= 15 && weather.temperature < 18) {
    temperatureModifier = 1 // Cool but pleasant
  } else if (weather.temperature > 24 && weather.temperature <= 28) {
    temperatureModifier = 1 // Warm and pleasant
  } else if (weather.temperature > 28) {
    temperatureModifier = -2 // Too hot, irritable
  } else if (weather.temperature < 15) {
    temperatureModifier = -3 // Cold, grumpy
  }

  // Precipitation modifier
  let precipitationModifier = 0
  if (weather.precipitation === 0) {
    precipitationModifier = 2 // Dry weather is nice
  } else if (weather.precipitation > 0 && weather.precipitation <= 1) {
    precipitationModifier = 0 // Light rain, neutral
  } else if (weather.precipitation > 1 && weather.precipitation <= 5) {
    precipitationModifier = -2 // Moderate rain, gloomy
  } else if (weather.precipitation > 5) {
    precipitationModifier = -3 // Heavy rain, very gloomy
  }

  // Cloud cover modifier
  let cloudinessModifier = 0
  if (weather.cloudCover <= 25) {
    cloudinessModifier = 2 // Clear skies, happy
  } else if (weather.cloudCover <= 50) {
    cloudinessModifier = 1 // Partly cloudy, slightly happy
  } else if (weather.cloudCover <= 75) {
    cloudinessModifier = -1 // Mostly cloudy, slightly sad
  } else {
    cloudinessModifier = -2 // Overcast, gloomy
  }

  // Wind modifier
  let windModifier = 0
  if (weather.windSpeed <= 10) {
    windModifier = 1 // Calm, pleasant
  } else if (weather.windSpeed <= 20) {
    windModifier = 0 // Moderate wind
  } else if (weather.windSpeed <= 30) {
    windModifier = -1 // Strong wind, irritable
  } else {
    windModifier = -2 // Very strong wind, very irritable
  }

  // Humidity modifier
  let humidityModifier = 0
  if (weather.humidity >= 40 && weather.humidity <= 60) {
    humidityModifier = 1 // Comfortable humidity
  } else if (weather.humidity < 40 || weather.humidity > 70) {
    humidityModifier = -1 // Uncomfortable humidity
  }

  // Calculate overall mood score
  const overallMoodScore =
    temperatureModifier +
    precipitationModifier +
    cloudinessModifier +
    windModifier +
    humidityModifier

  // Determine mood category
  let overallMood: WeatherMoodModifier['overall_mood']
  if (overallMoodScore >= 5) {
    overallMood = 'happy'
  } else if (overallMoodScore >= 2) {
    overallMood = 'energetic'
  } else if (overallMoodScore >= -2) {
    overallMood = 'neutral'
  } else if (overallMoodScore >= -5) {
    overallMood = 'calm'
  } else {
    overallMood = 'sad'
  }

  // Determine additional/removed ingredients based on mood
  const suggestedIngredients: string[] = []
  const removedIngredients: string[] = []

  if (overallMood === 'happy') {
    suggestedIngredients.push('Fresh Mint', 'Lemon Peel')
    // Happy people want fresh, citrus drinks
  } else if (overallMood === 'energetic') {
    suggestedIngredients.push('Fresh Basil', 'Ginger')
    // Energetic people want spicy, herbal drinks
  } else if (overallMood === 'sad') {
    suggestedIngredients.push('Honey', 'Vermouth')
    removedIngredients.push('Fresh Basil')
    // Sad people want comforting, rich drinks
  } else if (overallMood === 'calm') {
    suggestedIngredients.push('Honey', 'Fresh Mint')
    removedIngredients.push('Ginger')
    // Calm people want soothing drinks
  }

  // Create description
  const description = `Weather: ${weather.weatherDescription} | ${Math.round(weather.temperature)}°C | ${weather.humidity}% humidity`

  return {
    temperature_modifier: Math.min(5, Math.max(-5, temperatureModifier)),
    precipitation_modifier: Math.min(3, Math.max(-3, precipitationModifier)),
    cloudiness_modifier: Math.min(2, Math.max(-2, cloudinessModifier)),
    wind_modifier: Math.min(2, Math.max(-2, windModifier)),
    humidity_modifier: Math.min(1, Math.max(-1, humidityModifier)),
    overall_mood: overallMood,
    suggested_ingredients: [...new Set(suggestedIngredients)],
    removed_ingredients: [...new Set(removedIngredients)],
    description,
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
