# Project Overview: TDW Adventure App

## Technologies Used

### Frontend Framework & Language
*   **React 19**: The latest version of the library for building user interfaces, utilizing concurrent features for better performance.
*   **TypeScript**: Adds static typing to JavaScript, enhancing developer experience, code quality, and maintainability.
*   **Vite**: A build tool that provides a fast development environment (HMR) and optimized production builds.

### State Management
*   **Redux Toolkit**: The official, opinionated toolset for efficient Redux development. Used for managing global application state (UI, Dice, Monsters, etc.).
*   **React Query (@tanstack/react-query)**: Powerful asynchronous state management for fetching, caching, and synchronizing server state (used for API data).

### Routing
*   **TanStack Router**: A type-safe router for React applications, ensuring that navigation paths and parameters are validated at compile time.

### Styling & UI
*   **Tailwind CSS v4**: A utility-first CSS framework for rapid UI development. Version 4 brings a new high-performance engine.
*   **DaisyUI**: A component library for Tailwind CSS that provides pre-designed, semantic component classes (buttons, inputs, cards).
*   **Lucide React**: A clean and consistent icon library.

### Maps & Geolocation
*   **Leaflet & React Leaflet**: Open-source JavaScript libraries for mobile-friendly interactive maps.

### HTTP Client
*   **Axios**: A promise-based HTTP client for making requests to external APIs.

---

## External APIs

The application integrates several external APIs to provide dynamic content and functionality.

### 1. TheCocktailDB
*   **URL**: `https://www.thecocktaildb.com/api/json/v1/1`
*   **Purpose**: Provides cocktail recipes, ingredients, and images.
*   **Reason**: It offers a comprehensive and free database of drinks, which is essential for the "Tavern" or "Drink" features of the adventure app.

### 2. Deck of Cards API
*   **URL**: `https://deckofcardsapi.com/api/deck`
*   **Purpose**: Simulates a deck of cards for shuffling and drawing.
*   **Reason**: A simple, stateless API that handles the logic of card decks perfectly without needing to implement complex shuffling algorithms on the client side. Used for random generation or mini-games.

### 3. OSRM (Open Source Routing Machine)
*   **URL**: `https://router.project-osrm.org`
*   **Purpose**: Calculates routes, distances, and durations between coordinates.
*   **Reason**: A fast and free routing service based on OpenStreetMap data, allowing the app to plot travel paths for the adventure map.

### 4. Nominatim (OpenStreetMap)
*   **URL**: `https://nominatim.openstreetmap.org/search`
*   **Purpose**: Geocoding (converting location names to coordinates) and Reverse Geocoding (coordinates to names).
*   **Reason**: The standard search engine for OpenStreetMap data. It's free and provides detailed location data worldwide.

### 5. Open-Meteo
*   **URL**: `https://api.open-meteo.com/v1/forecast`
*   **Purpose**: Provides current and forecasted weather data based on coordinates.
*   **Reason**: An excellent free weather API that doesn't require an API key for non-commercial use and offers a wide range of weather variables (temperature, precipitation, cloud cover) to influence the game's atmosphere.

---

## Challenges & Solutions

During the development process, we encountered several technical challenges. Here is how we solved them:

### 1. Blank Screen & Render Crashes
*   **Difficulty**: The application initially failed to render, showing a blank white screen. This was caused by the `AudioContext` initializing immediately upon load, which many browsers block due to autoplay policies, leading to unhandled errors.
*   **Solution**: We refactored the `AudioEngine` to use **lazy loading**. The `AudioContext` now only initializes after a user interaction (like clicking a button). We also implemented a global `ErrorBoundary` component to catch render errors and display a helpful error message instead of crashing the entire app.

### 2. Build & Syntax Errors
*   **Difficulty**: We faced issues with the build process due to syntax errors in `App.tsx` (malformed JSX tags) and incorrect imports in Redux slices (importing `PayloadAction` as a value instead of a type).
*   **Solution**:
    *   We corrected the JSX structure in `App.tsx`, ensuring all tags were properly closed and nested.
    *   We updated the Redux slice files to use `import type { PayloadAction }`. This ensures that the build tool correctly treats it as a TypeScript interface and removes it from the runtime JavaScript bundle.

### 3. Cascading Renders (useEffect)
*   **Difficulty**: The `LocationSelector` component was triggering a "cascading render" warning. This happened because we were calling a state setter (`clearQueryResults`) inside a `useEffect` that was triggered by the same state it was modifying (`query`), creating a potential loop.
*   **Solution**: We removed the `useEffect` entirely and moved the logic to clear results directly into the `onChange` event handler. This allows React to batch the state updates efficiently and prevents the unnecessary render cycle.

### 4. Cocktail API Limitations & Crafting Logic
*   **Difficulty**: The *TheCocktailDB* API has a significant limitation: it does not support filtering by multiple ingredients simultaneously. This made it difficult to implement a "What can I make?" feature, which is crucial for players trying to craft recipes with their limited inventory.
*   **Solution**: We implemented a custom client-side filtering solution. Instead of relying on the API to filter, we fetch a broader set of data (or all available drinks) and perform the intersection logic within the application. This allows us to accurately match the player's specific inventory against the recipe database to suggest craftable drinks.

### 5. Location Search Performance
*   **Difficulty**: The location search feature (using Nominatim) was initially sluggish and "laggy." Every keystroke triggered a new API request, leading to a flood of network calls, rate limiting, and a poor user experience.
*   **Solution**: We implemented a **debounce strategy**. By wrapping the search logic in a timer (using `setTimeout` and `clearTimeout`), we ensure that the API request is only sent after the user has stopped typing for a specific duration (e.g., 500ms). This drastically reduced network traffic and made the UI responsive.

### 6. Complex Game State Management
*   **Difficulty**: The application has a complex logistical challenge: managing many distinct but interacting systems (NPCs, Crafting, Inventory, Weather, Audio, Dice, Maps) without creating a "spaghetti code" mess.
*   **Solution**: We utilized **Redux Toolkit** to strictly compartmentalize state into distinct "slices":
    *   **`npcSlice`**: Manages NPC generation, current mood, and active orders.
    *   **`craftingSlice`**: Handles the active crafting session state (selected drink, ingredients used).
    *   **`adventureSlice`**: Tracks the journey progress, route data, and current location.
    *   **`gameSlice`**: Manages global game status and player inventory.
    This separation of concerns allowed us to keep the codebase maintainable. For example, the Weather system can influence the NPC system (changing their mood) without the two systems being tightly coupled in the code.

### 7. Dynamic NPC Generation
*   **Difficulty**: We wanted NPCs to feel "alive" and reactive to the game world, rather than just being static quest givers. Generating them randomly was easy, but making them context-aware was challenging.
*   **Solution**: We built a sophisticated generation engine in `npcSlice.ts` that takes the current **Weather** and **Location** as inputs.
    *   **Weather Integration**: We created a `calculateWeatherMoodModifier` utility that translates weather data (temp, rain, wind) into an emotional state (e.g., "Gloomy" during rain, "Energetic" on sunny days).
    *   **Dynamic Requirements**: The NPC's drink requests are modified by this mood. A "Cold" NPC might request warming ingredients like Whiskey or Honey, while a "Hot" NPC might want refreshing Mint or Lime.
    *   **Progression Blocking (Impossible Requests)**: A major issue we encountered was NPCs requesting ingredients the player did not yet possess (and wouldn't obtain for some time), effectively soft-locking the game loop.
    *   **Inventory-Aware Generation**: To fix this, we modified the `generateNPC` function to accept an array of the player's currently available ingredients. The generator now prioritizes these ingredients when creating the NPC's "cravings," ensuring that every request is theoretically fulfillable with the player's current inventory.
