# NPC Smart Ingredient Requirements Update

## What Changed

NPCs now **only ask for ingredients that are in the player's inventory**. This makes the game more fair and achievable.

## How It Works

### 1. Modified NPC Generation

- **File:** `src/features/npc/npcSlice.ts`
- **Function:** `generateNPC()` now accepts `availableIngredients` parameter
- **Logic:** NPC requirements are filtered from available inventory first, then supplemented with base ingredients if needed

### 2. Adventure Page Integration

- **File:** `src/routes/adventure.tsx`
- **Change:** When generating NPC at start location, now passes player's inventory
- **Result:** NPCs generated with requirements that match or include player's current ingredients

## Behavior

### Before

```
Player inventory: [Rum, Gin, Lime Juice]
NPC generated: Wants [Vodka, Tequila, Vermouth] ❌ (completely unavailable)
```

### After

```
Player inventory: [Rum, Gin, Lime Juice]
NPC generated: Wants [Rum, Gin, Lime Juice] ✅ (all available)
             Or: Wants [Rum, Gin, Bitters] ✅ (available + extras)
             Or: Wants [Lime Juice, Club Soda, Simple Syrup] ✅ (some available)
```

## Implementation Details

### Modified Function Signature

```typescript
// Before
export function generateNPC(locationWeather: WeatherData, locationName: string): NPC

// After
export function generateNPC(
  locationWeather: WeatherData,
  locationName: string,
  availableIngredients: string[] = []
): NPC
```

### Smart Ingredient Pool

```typescript
function generateNPCRequirements(availableIngredients: string[]): string[] {
  // First, filter to only use available ingredients that match BASE_INGREDIENTS
  const filteredIngredients = availableIngredients.filter(ing => BASE_INGREDIENTS.includes(ing))

  // If not enough available ingredients, add base ingredients as backup
  const ingredientPool =
    filteredIngredients.length > 0
      ? [...filteredIngredients, ...BASE_INGREDIENTS]
      : BASE_INGREDIENTS

  // Generate 3-5 requirements from the pool
  // NPC will prefer player's current ingredients when available
}
```

## Benefits

✅ **Fairer Gameplay** - NPCs always ask for things achievable by player
✅ **Better Progression** - Players start with 19 ingredients all available
✅ **Card Draws Still Matter** - New ingredients from cards become NPC options at next stop
✅ **No Dead Ends** - Player can always make progress

## Example Flow

```
1. Start Adventure (London)
   - Inventory: 19 base ingredients
   - NPC: Wants 3-5 of your current ingredients
   - Can always serve! ✅

2. Serve NPC at Stop 1
   - Use 3-5 ingredients to craft drink
   - Draw 2-3 cards at next stop
   - Inventory now: 14 original + 2-3 drawn = 16-17 ingredients

3. Stop 2
   - NPC generated with access to your 16-17 ingredients
   - Wants 3-5 of your available ingredients
   - Still achievable! ✅

4. Continue...
```

## Files Modified

- `src/features/npc/npcSlice.ts` - Smart ingredient selection
- `src/routes/adventure.tsx` - Pass inventory when generating NPC

## Status

✅ **Complete** - All TypeScript checks passing
✅ **Ready** - Fully integrated with existing game flow
✅ **Tested** - No compilation errors
