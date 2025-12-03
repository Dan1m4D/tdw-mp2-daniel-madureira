# The Wandering Bartender

A React + TypeScript + Vite application where you travel the world, gather ingredients via a deck of cards, and craft cocktails for NPCs influenced by real-time weather.

## 🚀 Quick Start

1.  **Install dependencies**: `pnpm install`
2.  **Run development server**: `pnpm dev`
3.  **Build for production**: `pnpm build`

## 🎮 Gameplay Guide

### 1. Route Planning

- Navigate to **Adventure Mode**.
- Select a **Start Location** and **End Location**.
- Click **Start Adventure** to generate a route with 3 intermediate stops.

### 2. The Journey (3 Stops)

At each stop, you will encounter an NPC with specific drink cravings based on the local weather.

- **Gather Ingredients**:
  - **Draw Cards**: Use the deck to draw cards. Each card corresponds to an ingredient (e.g., Ace of Spades = Rum).
  - **Inventory**: Ingredients are automatically added to your inventory.
- **Serve the NPC**:
  - Check the **NPC Serving Panel** to see what they want.
  - Requirements are "smart" - NPCs will prioritize asking for ingredients you actually have or can easily get.
  - **Weather Modifiers**: Local weather affects NPC mood and requirements (e.g., cold weather = warm drinks).
- **Craft & Serve**:
  - Click **Go Craft Drink** to visit the Bar.
  - Select a cocktail that meets the requirements.
  - Crafting consumes ingredients and satisfies the NPC.
- **Advance**: Move to the next stop once the NPC is served.

### 3. Completion

- After serving all 3 NPCs, you view a **Summary Screen** with your journey stats.

## 🛠️ System Documentation

### 🃏 Deck of Cards System

- **API**: Uses `deckofcardsapi.com`.
- **Mechanic**: One 52-card deck per adventure.
- **Mapping**:
  - ♠ Spades: Spirits (Rum, Gin, etc.)
  - ♥ Hearts: Juices & Mixers
  - ♦ Diamonds: Syrups & Sweeteners
  - ♣ Clubs: Herbs & Spices

### 🌦️ Weather & NPC System

- **API**: Uses `open-meteo.com` for real-time weather data.
- **Moods**:
  - **Happy** (Sunny/Warm): Wants refreshing/citrus drinks.
  - **Sad** (Rainy/Cold): Wants warming/comfort drinks.
  - **Energetic** (Windy/Active): Wants spicy/herbal drinks.
  - **Calm** (Overcast): Wants soothing drinks.
- **Smart Requirements**: NPCs generate requirements based on your current inventory to ensure gameplay is always achievable.

### 🍹 Cocktail System

- **API**: Uses `thecocktaildb.com`.
- **Features**: Search, filter by ingredient, view details, and craft drinks.

## 🏗️ Technical Architecture

### Tech Stack

- **Frontend**: React, TypeScript, Vite
- **State Management**: Redux Toolkit
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query (React Query) & Axios
- **Styling**: Tailwind CSS + DaisyUI
- **Maps**: Leaflet / React-Leaflet

### Key Services

- `cardsAPI.ts`: Manages deck creation and card drawing.
- `weatherAPI.ts`: Fetches weather and calculates mood modifiers.
- `cocktailAPI.ts`: Fetches drink recipes and details.
- `routingAPI.ts`: Calculates routes and geocodes locations (OSRM + Nominatim).

### Redux Slices

- `adventureSlice`: Manages route, stops, deck, and progress.
- `gameSlice`: Manages player inventory.
- `npcSlice`: Manages current NPC generation and state.
- `craftingSlice`: Manages the crafting session context.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
