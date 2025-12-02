# The Wandering Bartender - Complete Gameplay Guide

## 🎮 Full Adventure Workflow

### Phase 1: Route Planning

1. **Navigate to Adventure Page** (`/adventure`)
2. **Select Start Location**
   - Click "Select Start" button
   - Search for a city/location
   - NPC is automatically generated for start location with weather-based mood
3. **Select End Location**
   - Click "Select End" button
   - Choose a different city
4. **Start Adventure**
   - Click "Start Adventure" button
   - Route calculated with 3 intermediate stops
   - NPC deck initialized (52 cards available)
   - Adventure status changes to "active"

### Phase 2: At Each Stop (3 locations)

**For each of the 3 stops, repeat this process:**

#### A. Gather Ingredients

You have two ways to add ingredients:

1. **Draw Cards**
   - Click "Draw Card" button in CardDraw component
   - Random card fetched from Deck of Cards API
   - Card converted to ingredient (e.g., AS → Rum)
   - Ingredient auto-added to inventory
   - Click "Continue to Next Stop" to progress

2. **Craft Drinks**
   - Navigate to `/drinks` page
   - View your inventory
   - Sort/filter cocktails by ingredients you have
   - Browse available drinks
   - Select a drink you can craft (all ingredients available)
   - Craft the drink to use ingredients

#### B. Serve NPC

1. **View Current NPC**
   - NPC name, description, and mood displayed
   - Current mood affected by weather at that location
   - Required ingredients listed
2. **Check Requirements**
   - NPCServingPanel shows:
     - ✅ Green checkmark if you have ingredient
     - ❌ Red X if ingredient is missing
   - Status bar shows if you're ready to serve

3. **Craft Drink for NPC**
   - Click "Go Craft Drink" button
   - Navigate to `/drinks` page with NPC context
   - Select a drink that matches NPC requirements
   - Craft button shows "Craft for [NPC Name]"
   - Click "Craft for [NPC Name]"
   - Ingredients consumed from inventory
   - Automatically return to adventure page
   - NPC marked as completed

4. **Move to Next Stop**
   - Stop index increments (1→2→3)
   - New NPC generated for next location
   - Process repeats

### Phase 3: Adventure Completion

**After serving all 3 NPCs:**

1. **Summary Screen Appears**
   - Modal overlay with celebration theme
   - Shows statistics:
     - Total NPCs served (3)
     - Unique drinks crafted
     - Unique characters met
2. **Completed NPCs List**
   - Shows every NPC served:
     - Stop number
     - NPC name
     - Drink crafted
     - Ingredients used
3. **Actions**
   - **New Adventure**: Reset everything, start new route
   - **Back Home**: Return to home page

---

## 🃏 Card System Details

### Deck of Cards API Integration

**52 Cards = 52 Unique Ingredients**

| Card | Suit        | Category | Ingredient                                                                                                                          |
| ---- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| AS   | ♠ Spades   | Spirits  | Rum                                                                                                                                 |
| 2S   | ♠ Spades   | Spirits  | Gin                                                                                                                                 |
| 3S   | ♠ Spades   | Spirits  | Tequila                                                                                                                             |
| ...  | ♠ Spades   | Spirits  | Whiskey, Vodka, Brandy, Mezcal, Sake, Absinthe, Pernod, Cognac, Pisco, Chartreuse                                                   |
| AH   | ♥ Hearts   | Juices   | Lime Juice                                                                                                                          |
| 2H   | ♥ Hearts   | Juices   | Lemon Juice                                                                                                                         |
| 3H   | ♥ Hearts   | Juices   | Orange Juice                                                                                                                        |
| ...  | ♥ Hearts   | Juices   | Cranberry, Pineapple, Ginger Beer, Tonic, Club Soda, Cola, Ginger Ale, Coconut Milk, Tomato Juice, Grenadine                        |
| AD   | ♦ Diamonds | Syrups   | Simple Syrup                                                                                                                        |
| 2D   | ♦ Diamonds | Syrups   | Honey                                                                                                                               |
| 3D   | ♦ Diamonds | Syrups   | Agave Syrup                                                                                                                         |
| ...  | ♦ Diamonds | Syrups   | Maple Syrup, Brown Sugar, Cinnamon Syrup, Vanilla Syrup, Orgeat, Blue Curaçao, Peach Schnapps, Triple Sec, Chambord, Coffee Liqueur |
| AC   | ♣ Clubs    | Herbs    | Fresh Mint                                                                                                                          |
| 2C   | ♣ Clubs    | Herbs    | Fresh Basil                                                                                                                         |
| 3C   | ♣ Clubs    | Herbs    | Rosemary                                                                                                                            |
| ...  | ♣ Clubs    | Herbs    | Thyme, Bitters, Angostura, Aromatic Bitters, Cinnamon, Nutmeg, Black Pepper, Vermouth (3 types)                                     |

### Card Drawing Mechanics

- **One deck per adventure** (52 cards available)
- **Cards cannot be drawn twice** (deck system)
- **Each draw adds ingredient to inventory**
- **Draw anytime at any stop**
- **Deck resets on new adventure**

---

## 🍹 Drink Crafting System

### How to Craft

1. **Go to Drinks Page** (`/drinks`)
2. **Browse Cocktails**
   - Search by name
   - Filter by category
   - Filter by ingredients
   - Sort A-Z or by missing ingredients
3. **View Drink Details**
   - Click card to open drawer
   - See all requirements
   - Check which ingredients you have (✅/❌)
   - View drink image, glass type, instructions
4. **Craft If Possible**
   - "Craft Drink" button enabled if all ingredients available
   - Disabled if missing ingredients
   - Ingredients removed from inventory when crafted
5. **For NPC Crafting**
   - Drawer shows "Craft for [NPC Name]"
   - After crafting, auto-return to adventure
   - NPC marked as served
   - Completed NPC record saved

---

## 🎯 NPC System

### NPC Generation

**Each NPC has:**

- Random name (from 15-name pool)
- Personality description
- Location-based description
- Base ingredient requirements (3-5)
- Weather-affected mood modifiers
- Mood score (-10 to +10)
- Mood description explaining weather effects

### Weather Modifiers

NPCs' requirements are affected by:

- **Temperature**: Cold → wants warm drinks, Hot → wants cold/refreshing
- **Precipitation**: Rain → wants comfort drinks
- **Cloudiness**: Gloomy → wants uplifting drinks
- **Wind**: Windy → wants hearty drinks
- **Humidity**: High humidity → wants lighter drinks

### NPC Requirements

Example:

```
Base Requirements: [Rum, Lime Juice, Simple Syrup]
Weather: Hot and humid
Weather Modifier: +1 mood (refreshing weather)
Current Requirements: [Rum, Lime Juice, Simple Syrup, Club Soda] (extra ingredient added)
```

---

## 📊 Redux State Structure

### Adventure State

```typescript
{
  startLocation: Coordinate
  endLocation: Coordinate
  routeData: {
    mainRoute: RouteResponse
    stopPoints: Coordinate[]  // 3 stops
    totalDistance: number
    totalDuration: number
  }
  deckId: string
  currentStopIndex: number  // 0, 1, 2, 3
  drawnCards: DrawnCard[]   // Cards drawn this adventure
  completedNPCs: CompletedNPCRecord[]  // Served NPCs
  status: 'idle' | 'planning' | 'active' | 'completed'
}
```

### Crafting State

```typescript
{
  isCraftingForNPC: boolean
  currentNPCId: string | null
  currentNPCName: string | null
  selectedDrink: string | null
  selectedDrinkName: string | null
  ingredientsUsed: string[]
}
```

### Game State

```typescript
{
  status: 'idle' | 'playing' | 'finished'
  inventory: string[]  // Ingredients player has
}
```

### NPC State

```typescript
{
  currentNPC: NPC | null
  generatedNPCs: NPC[]  // All NPCs generated
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}
```

---

## 🗺️ Navigation Flow

```
Home
  ↓
Adventure Page
  ├── Select Start Location
  │   └── NPC generated for start
  ├── Select End Location
  ├── Start Adventure
  │   └── Route + Deck created
  ├── At Stop (repeat 3x):
  │   ├── Draw Cards (optional)
  │   ├── Serve NPC
  │   │   └── Go to Drinks page
  │   │       └── Craft for NPC
  │   │           └── Return to Adventure
  │   └── Move to Next Stop
  └── Adventure Complete
      ├── Summary Screen
      └── New Adventure / Home
```

---

## 📋 Complete Gameplay Example

### Scenario: London to Paris Adventure

1. **Route Planning**
   - Start: London, UK
   - End: Paris, France
   - Route created: London → Brussels → Amsterdam → Paris
   - NPCs generated for each stop

2. **Stop 1: Brussels**
   - Meet Marcus (traveler) - wants: Rum, Lime Juice, Simple Syrup
   - Weather: Rainy → adds Club Soda requirement
   - Draw card: Get Rum
   - Draw card: Get Lime Juice
   - Draw card: Get Simple Syrup
   - Draw card: Get Club Soda
   - Go to Drinks → Craft "Mojito" with Rum, Lime, Simple Syrup, Mint
   - Marcus served! ✅

3. **Stop 2: Amsterdam**
   - Meet Sofia (artist) - wants: Gin, Tonic Water, Lemon Juice
   - Weather: Cloudy → adds Lemon Peel
   - Draw card: Get Gin
   - Go to Drinks → Craft "Gin & Tonic"
   - Missing: Tonic, Lemon Juice, Lemon Peel
   - Draw card: Get Tonic Water
   - Draw card: Get Lemon Juice
   - Draw card: Get Lemon Peel
   - Go back to Drinks → Craft "Gin & Tonic" for Sofia
   - Sofia served! ✅

4. **Stop 3: Paris**
   - Meet James (businessman) - wants: Cognac, Vermouth, Bitters, Orange Peel
   - Weather: Clear and cool → mood neutral
   - Draw cards to gather all 4 ingredients
   - Go to Drinks → Craft "Manhattan" for James
   - James served! ✅

5. **Adventure Complete!**
   - Summary shows:
     - 3 NPCs served: Marcus, Sofia, James
     - 3 drinks crafted: Mojito, Gin & Tonic, Manhattan
     - 12 ingredients used total
   - Option to start new adventure or go home

---

## 💡 Pro Tips

### Ingredient Gathering

- **Draw early and often** to maximize ingredient pool
- **Use card system** before going to drinks page
- **Plan which drinks** you want to make based on current ingredients

### NPC Requirements

- **Check weather** - rainy locations want comfort, hot days want refreshing
- **Read mood description** - explains which extra ingredients are needed
- **Match drinks exactly** - all required ingredients must be in inventory

### Efficient Crafting

- **Sort by missing ingredients** on drinks page to prioritize craftable drinks
- **Multi-craft:** Draw several cards, then craft multiple drinks efficiently
- **Plan route:** Know which NPCs you'll meet before starting

### Advanced Strategy

- **Weather predict:** Choose routes with favorable weather for easier NPCs
- **Ingredient efficiency:** Draw cards that cover multiple drink recipes
- **Time management:** Complete all 3 stops within reasonable time

---

## 🐛 Troubleshooting

### Card Not Drawing

- Check deck is initialized (after starting adventure)
- Verify internet connection (API call required)
- Try drawing another card

### Drink Won't Craft

- Verify all ingredients are in inventory
- Check ingredient names match exactly
- Try closing and reopening drink drawer

### NPC Not Appearing

- Refresh the page
- Make sure you're at a stop (currentStopIndex >= 1)
- Try drawing a card to trigger NPC appearance

### Missing Ingredients

- Use card drawing system or craft drinks to gather more
- Check inventory display for full ingredient list
- Filter drinks by ingredients you have

---

## 🎨 UI Components Overview

### Adventure Page Sidebar

- **Location Selection** (before adventure)
- **Route Status** (after route calculated)
- **NPC Information** (during adventure)
- **NPC Serving Panel** (current requirements)
- **Inventory Display** (all ingredients)
- **Card Draw** (draw random ingredient)
- **Drink Crafting** (link to cocktails)

### Drinks Page

- **Search** by cocktail name
- **Filters** by category, ingredients
- **Sort** A-Z or by missing ingredients
- **Drink Cards** showing summary
- **Detail Drawer** with full recipe and crafting option

### Summary Screen

- **Stats** (NPCs served, drinks, unique characters)
- **Journey List** (all served NPCs with details)
- **Action Buttons** (new adventure, home)

---

**Status:** ✅ COMPLETE - Ready for full gameplay testing
**Last Updated:** December 2024
