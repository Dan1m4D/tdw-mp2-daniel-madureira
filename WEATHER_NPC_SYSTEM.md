# Weather API & NPC Mood System Documentation

## Overview

The weather-based NPC mood system creates dynamic, weather-influenced cocktail requirements for NPCs. When a player selects a location, the system:

1. **Fetches weather data** from Open-Meteo API (free, no auth required)
2. **Calculates mood modifiers** based on temperature, precipitation, humidity, wind, and cloud cover
3. **Generates NPCs** with personalized ingredient requirements adjusted by weather
4. **Displays mood and requirements** in the NPCInformation component

## Architecture

### Services

#### `src/services/weatherAPI.ts`

Free weather API integration using Open-Meteo with these core functions:

**`getWeather(latitude: number, longitude: number): Promise<WeatherData>`**

- Fetches current weather for a location
- Returns: temperature, weatherCode, description, humidity, precipitation, cloudCover, windSpeed
- No API key required
- Gracefully handles errors with neutral weather fallback

**`calculateWeatherMoodModifier(weather: WeatherData): WeatherMoodModifier`**

- Converts weather conditions into mood modifiers
- Uses a scoring system (-5 to +5 per metric):
  - **Temperature modifier**: Optimal at 18-24°C (happy), cold/hot = grumpy
  - **Precipitation modifier**: Dry = happy, heavy rain = sad
  - **Cloud cover modifier**: Clear = happy, overcast = sad
  - **Wind modifier**: Calm = pleasant, strong wind = irritable
  - **Humidity modifier**: 40-60% = comfortable, extreme = uncomfortable

- Returns mood category:
  - `happy` (score ≥ 5): Energetic, wants citrus and mint drinks
  - `energetic` (score ≥ 2): Wants spicy, herbal ingredients
  - `neutral` (score -2 to 2): No special modifications
  - `calm` (score ≥ -2): Wants soothing, honey-based drinks
  - `sad` (score < -5): Wants rich, warming spirits

**`applyWeatherModifierToIngredients(baseIngredients: string[], modifier: WeatherMoodModifier): string[]`**

- Takes base NPC requirements and applies weather mood effects
- Removes ingredients that don't fit the mood
- Adds suggested ingredients for the mood
- Returns final ingredient list

### State Management

#### `src/features/npc/npcSlice.ts`

Redux slice managing NPC state with the following structure:

```typescript
interface NPC {
  id: string // Unique NPC identifier
  name: string // Generated from NPC_NAMES array
  description: string // Context-specific description
  baseRequirements: string[] // Original ingredient requirements
  currentRequirements: string[] // Modified by weather mood
  mood: 'happy' | 'energetic' | 'neutral' | 'calm' | 'sad'
  moodScore: number // -10 to +10
  locationWeather: WeatherData // Weather data for the NPC's location
  moodDescription: string // Human-readable weather summary
  isGenerated: boolean // Always true for dynamic NPCs
}
```

**Selectors:**

- `selectCurrentNPC()`: Get the active NPC for the game
- `selectNPCStatus()`: Get async operation status (idle/loading/succeeded/failed)
- `selectCurrentNPCRequirements()`: Get the weather-modified ingredient list
- `selectGeneratedNPCs()`: Get all NPCs generated in this session

**Actions:**

- `setCurrentNPC(npc: NPC)`: Manually set current NPC
- `clearCurrentNPC()`: Reset NPC state
- `generateNewNPCFromWeather(npc: NPC)`: Generate NPC from weather data
- `updateNPCRequirements(ingredients: string[])`: Update ingredient list

**Helper Function:**

- `generateNPC(weather: WeatherData, locationName: string): NPC`
  - Creates a random NPC with weather-appropriate requirements
  - Selects from 15 predefined NPC names and descriptions
  - Generates 3-5 random base ingredients
  - Applies weather mood modifiers automatically

## Components

### `src/components/NPCInformation.tsx`

Enhanced component displaying NPC with mood and weather-influenced requirements.

**Features:**

- Shows NPC avatar (first letter of name)
- Displays mood emoji and score
- Shows weather icon and mood description
- Lists required ingredients with visual indicators
- Highlights weather-modified ingredients with ✨ marker
- Shows baseline vs. weather-influenced differences

**Props:** None (uses Redux for state)

**Selectors:** Uses `selectCurrentNPC()` from Redux

## Integration

### `src/routes/adventure.tsx`

Weather API integrated into location selection flow:

```typescript
const handleLocationSelect = async (location: Coordinate) => {
  if (selectingFor === 'start') {
    dispatch(setStartLocation(location))

    // Fetch weather and generate NPC
    try {
      const weather = await getWeather(location.latitude, location.longitude)
      const npc = generateNPC(weather, location.name)
      dispatch(generateNewNPCFromWeather(npc))
    } catch (error) {
      console.error('Failed to fetch weather:', error)
    }
  }
  // ... end location handling
}
```

When user selects start location → weather fetched → NPC generated → displayed in NPCInformation

## Mood System Details

### Mood Calculation Formula

```
Overall Mood Score =
  temperature_mod +
  precipitation_mod +
  cloudiness_mod +
  wind_mod +
  humidity_mod
```

### Mood Categories & Ingredient Behavior

**HAPPY (Score ≥ 5)**

- Weather: Sunny, 18-24°C, low precipitation, calm
- Suggested additions: Fresh Mint, Lemon Peel
- Best drinks: Mojitos, Margaritas, Citrus-based cocktails

**ENERGETIC (Score ≥ 2)**

- Weather: Pleasant but slightly active conditions
- Suggested additions: Fresh Basil, Ginger
- Best drinks: Spicy/herbal cocktails

**NEUTRAL (-2 ≤ Score < 2)**

- Weather: Typical conditions, no extreme modifications
- Ingredient changes: None
- Best drinks: Any traditional cocktail

**CALM (Score ≥ -2)**

- Weather: Cool or overcast but not gloomy
- Suggested additions: Honey, Fresh Mint
- Removed: Ginger (too spicy)
- Best drinks: Soothing, balanced cocktails

**SAD (Score < -5)**

- Weather: Cold, rainy, gloomy
- Suggested additions: Honey, Vermouth
- Removed: Fresh Basil
- Best drinks: Rich, warming spirits (Whiskey, Rum-based)

## API Details

### Weather API (Open-Meteo)

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

**Parameters:**

```
?latitude=51.5074
&longitude=-0.1278
&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation,cloud_cover
&timezone=auto
```

**Response:**

```json
{
  "current": {
    "temperature_2m": 15.5,
    "weather_code": 61,
    "wind_speed_10m": 12,
    "relative_humidity_2m": 72,
    "precipitation": 0.5,
    "cloud_cover": 85
  }
}
```

**Weather Codes (WMO Standard):**

- 0: Clear sky
- 1-3: Partly cloudy to overcast
- 45-48: Fog
- 51-65: Drizzle/Rain
- 71-77: Snow
- 80-82: Rain showers
- 95-99: Thunderstorm

### No Authentication Required

Open-Meteo is free and doesn't require API keys, rate-limited per IP (sufficient for game use).

## Example Workflow

### Scenario: User selects London (cold, rainy) as start location

1. **Weather Fetch**

   ```
   Temperature: 8°C
   Precipitation: 3mm
   Cloud cover: 90%
   Humidity: 78%
   Wind: 15 km/h
   ```

2. **Mood Calculation**

   ```
   Temperature mod: -3 (very cold)
   Precipitation mod: -2 (moderate rain)
   Cloud cover mod: -2 (overcast)
   Wind mod: 0 (moderate wind)
   Humidity mod: -1 (high humidity)

   Total Score: -8 → SAD mood
   ```

3. **NPC Generated**

   ```
   Name: Marcus
   Mood: SAD
   Base Requirements: [Rum, Vodka, Lime Juice, Honey, Ginger]

   Weather Modifiers:
   - Add: Honey, Vermouth
   - Remove: Ginger

   Final Requirements: [Rum, Vodka, Lime Juice, Honey, Vermouth]
   ```

4. **Display in UI**
   ```
   Marcus - "A seasoned traveler" 😔
   Weather: Cold London drizzle
   Wants: Rum, Vodka, Lime Juice, Honey, Vermouth ✨
   ```

## Testing the System

### Local Testing

1. **Start the dev server:**

   ```bash
   pnpm dev
   ```

2. **Navigate to Adventure mode**

3. **Select a location:**
   - Choose any city from LocationSelector
   - NPCInformation updates with generated NPC
   - Weather mood drives ingredient changes

4. **Test different weather scenarios:**
   - Hot locations (tropical): Should generate HAPPY/ENERGETIC NPCs
   - Cold locations (Nordic): Should generate SAD/CALM NPCs
   - Moderate locations: NEUTRAL NPCs

### Verifying NPC State

Check Redux DevTools or browser console:

```javascript
// In browser console:
const store = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const state = store.getState()
console.log(state.npc.currentNPC)
```

## Future Enhancements

- **Multiple NPCs per route:** Generate NPC at each waypoint
- **Time-based mood:** Morning/evening preferences
- **Seasonal modifiers:** Holiday moods, seasonal ingredients
- **NPC memory:** Track which drinks were made for NPCs
- **Mood progression:** Improve NPC mood through successful drinks
- **Location-specific NPCs:** Cultural preferences by region
- **Weather API integration:** Real-time live weather for selected cities

## Files Changed

- **Created:** `src/services/weatherAPI.ts`
- **Created:** `src/features/npc/npcSlice.ts`
- **Modified:** `src/components/NPCInformation.tsx` (enhanced from placeholder)
- **Modified:** `src/routes/adventure.tsx` (integrated weather fetching)
- **Modified:** `src/app/store.ts` (added npc reducer)

## Dependencies

No new npm dependencies required. Uses:

- `axios` (already in project)
- `@reduxjs/toolkit` (already in project)
- `lucide-react` (already in project)

---

**Status:** ✅ Complete and tested
**API:** Free, no rate limiting concerns
**Mood System:** Ready for gameplay and NPC encounters
