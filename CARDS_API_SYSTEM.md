# Deck of Cards API Integration Guide

## Overview

The Wandering Bartender now features a **Deck of Cards API** integration that allows players to draw random cards during their adventure, which are translated into ingredients and added to their inventory.

## Architecture

### Services

#### `src/services/cardsAPI.ts`

Provides the following functions:

- **`createDeck(): Promise<string>`** - Creates a new shuffled deck and returns the deck ID
- **`drawCard(deckId: string): Promise<Card>`** - Draws a single card from the deck
- **`cardToIngredient(card: Card): string`** - Maps a card to an ingredient
- **`getCardDetails(card: Card): {...}`** - Returns card display information
- **`drawMultipleCards(deckId: string, count: number): Promise<Card[]>`** - Draws multiple cards

### Card-to-Ingredient Mapping

Cards are mapped to ingredients based on their suit:

| Suit          | Category                | Examples                                                           |
| ------------- | ----------------------- | ------------------------------------------------------------------ |
| Spades (♠)   | Spirits                 | Rum, Gin, Tequila, Whiskey, Vodka, etc. (13 spirits)               |
| Hearts (♥)   | Juices & Mixers         | Lime Juice, Lemon Juice, Orange Juice, Coca-Cola, etc. (13 juices) |
| Diamonds (♦) | Syrups & Sweeteners     | Simple Syrup, Honey, Agave Syrup, Coffee Liqueur, etc. (13 syrups) |
| Clubs (♣)    | Herbs, Spices & Bitters | Fresh Mint, Fresh Basil, Bitters, Vermouth, etc. (13 herbs)        |

**Total:** 52 unique ingredients (4 suits × 13 cards)

### Redux State Management

#### Adventure Slice (`src/features/adventure/adventureSlice.ts`)

**New State Properties:**

```typescript
deckId: string | null                    // Current deck ID
currentStopIndex: number                 // Index of current stop (0-3)
drawnCards: DrawnCard[]                  // Cards drawn during this adventure
```

**New Async Thunks:**

- **`initializeDeck()`** - Creates a new deck when adventure starts
- **`drawCardAndGetIngredient(deckId)`** - Draws a card and maps it to an ingredient

**New Reducers:**

- **`advanceToNextStop()`** - Increments the current stop index

### Components

#### `src/components/CardDraw.tsx`

Interactive component for drawing cards at each stop:

```tsx
<CardDraw />
```

**Features:**

- Shows current stop number (e.g., "Stop 1 of 3")
- Draw button triggers card drawing
- Displays card image with suit and value
- Shows translated ingredient name
- Auto-adds ingredient to inventory
- "Continue to Next Stop" button
- Completes when all stops visited

**Props:** None (uses Redux state)

## Game Flow Integration

### 1. Adventure Start

```
Start Adventure
  ↓
- Calculate route with 3 stops
- Create new deck
- Display CardDraw component
```

### 2. At Each Stop

```
Draw Card
  ↓
- Fetch random card from Deck of Cards API
- Map card to ingredient (e.g., AS = Rum)
- Display card image
- Add ingredient to Redux game slice inventory
  ↓
Continue to Next Stop
  ↓
currentStopIndex += 1
```

### 3. Adventure Complete

```
Visit all stops (index >= 3)
  ↓
Display "Adventure Complete" message
Card draw disabled
```

## API Integration Details

### Deck of Cards API

**Base URL:** `https://deckofcardsapi.com/api/deck`

**Endpoints Used:**

1. **Create Deck**

   ```
   GET /new/shuffle/
   ```

   Returns: `{ success: true, deck_id: "...", shuffled: true, remaining: 52 }`

2. **Draw Card**
   ```
   GET /{deck_id}/draw/?count=1
   ```
   Returns: Card object with image, suit, value, code

### Example Flow

```javascript
// 1. Create deck
const deckId = await createDeck()
// deckId = "3p6shf51mmqo"

// 2. Draw a card
const card = await drawCard(deckId)
// card = {
//   code: "AS",
//   suit: "SPADES",
//   value: "ACE",
//   images: { svg: "...", png: "..." },
//   ...
// }

// 3. Map to ingredient
const ingredient = cardToIngredient(card)
// ingredient = "Rum"

// 4. Add to inventory
dispatch(addIngredient('Rum'))
```

## Usage Example

### In Adventure Page

```tsx
import { CardDraw } from '../components'

function Adventure() {
  const adventure = useSelector(state => state.adventure)

  return (
    <>
      {/* Show CardDraw when adventure is active and deck exists */}
      {adventure.status !== 'idle' && adventure.deckId && <CardDraw />}
    </>
  )
}
```

### Manual Card Drawing (Optional)

To allow users to draw cards on demand from anywhere:

```tsx
const dispatch = useDispatch()
const deckId = useSelector(state => state.adventure.deckId)

const handleDraw = async () => {
  if (deckId) {
    const result = await dispatch(drawCardAndGetIngredient(deckId))
    if (result.payload) {
      const { ingredient } = result.payload
      dispatch(addIngredient(ingredient))
    }
  }
}
```

## Features & Capabilities

✅ **Deck Management**

- Single deck per adventure
- Automatic reset on new adventure
- Tracks remaining cards (52 total)

✅ **Card Drawing**

- Draw one or multiple cards
- Cards cannot be drawn twice (deck mechanism)
- Automatic card-to-ingredient mapping

✅ **Inventory Integration**

- Auto-adds ingredients to Redux store
- Prevents duplicate ingredients (handled by game slice)
- Persists through adventure progression

✅ **UI/UX**

- Card image display with Tailwind styling
- Stop progress indicator
- Loading states during API calls
- Error handling with user-friendly messages

✅ **Future Enhancements**

- Draw multiple cards per stop
- Random ingredient selection (not just cards)
- Card rarity system (common, rare, legendary)
- Deck persistence across sessions

## Error Handling

```typescript
// Service Layer
try {
  const card = await drawCard(deckId)
} catch (error) {
  // Returns: Error: "Failed to draw card"
}

// Redux Thunk
.addCase(drawCardAndGetIngredient.rejected, (state, action) => {
  state.error = action.payload // "Failed to draw card"
})
```

## Testing

### Manual Testing Checklist

1. ✅ Start adventure with two locations
2. ✅ Deck initializes after route calculation
3. ✅ CardDraw component appears in sidebar
4. ✅ Can draw card at each stop
5. ✅ Card image displays correctly
6. ✅ Ingredient added to inventory
7. ✅ Can advance to next stop
8. ✅ Stops counting correctly (1, 2, 3)
9. ✅ Card draw disabled at last stop
10. ✅ Adventure reset clears deck

### Browser Console Testing

```javascript
// In browser console while adventure is active
import { drawCard, cardToIngredient } from '../services/cardsAPI'

const state = store.getState()
const deckId = state.adventure.deckId

const card = await drawCard(deckId)
console.log(cardToIngredient(card)) // "Rum", "Mint", etc.
```

## Performance Considerations

- **API Calls:** 1 call per draw (minimal impact)
- **State Size:** Stores only drawn cards during adventure (max 52)
- **Re-renders:** Only when drawing card or advancing stop
- **Memory:** Deck ID cached in Redux (string, minimal)

## Dependencies

- `axios` - HTTP requests to Deck of Cards API
- `Redux Toolkit` - State management
- React - UI rendering
- Tailwind CSS - Styling

## Files Modified/Created

### New Files

- `src/services/cardsAPI.ts` - Cards API service
- `src/components/CardDraw.tsx` - Card drawing UI component

### Modified Files

- `src/features/adventure/adventureSlice.ts` - Added deck state & thunks
- `src/routes/adventure.tsx` - Integrated CardDraw component
- `src/components/index.ts` - Exported CardDraw

## Integration Checklist

✅ Service layer implemented (`cardsAPI.ts`)
✅ Redux state management (`adventureSlice.ts`)
✅ UI component created (`CardDraw.tsx`)
✅ Route integration completed (`adventure.tsx`)
✅ Component exports updated (`components/index.ts`)
✅ TypeScript types validated
✅ Error handling implemented
✅ ESLint/Prettier formatting applied

## Next Steps (Optional Enhancements)

1. **Multiple Cards Per Stop** - Draw N cards at each location
2. **Card Rarity System** - Common, Uncommon, Rare, Legendary
3. **Special Cards** - Jokers with bonus effects
4. **Deck Persistence** - Save drawn cards between sessions
5. **Statistics** - Track total cards drawn, favorite ingredients
6. **Animation** - Card flip/reveal animations
7. **Sound Effects** - Card drawing sounds

---

**Last Updated:** December 2024
**Status:** Complete - Ready for Testing
