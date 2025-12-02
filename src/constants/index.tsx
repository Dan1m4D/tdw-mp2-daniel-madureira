// API Endpoints
export const COCKTAILS_API_URL = 'https://www.thecocktaildb.com/api/json/v1/1'
export const DECK_API = 'https://deckofcardsapi.com/api/deck'
export const OSRM_API = 'https://router.project-osrm.org'
export const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search'
export const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

// Card to Ingredient Mapping
export const CARD_TO_INGREDIENT_MAP: Record<string, string> = {
  // Spades - Spirits
  AS: 'Rum',
  '2S': 'Gin',
  '3S': 'Tequila',
  '4S': 'Whiskey',
  '5S': 'Vodka',
  '6S': 'Brandy',
  '7S': 'Mezcal',
  '8S': 'Sake',
  '9S': 'Absinthe',
  '10S': 'Pernod',
  JS: 'Cognac',
  QS: 'Pisco',
  KS: 'Chartreuse',

  // Hearts - Juices & Mixers
  AH: 'Lime Juice',
  '2H': 'Lemon Juice',
  '3H': 'Orange Juice',
  '4H': 'Cranberry Juice',
  '5H': 'Pineapple Juice',
  '6H': 'Ginger Beer',
  '7H': 'Tonic Water',
  '8H': 'Club Soda',
  '9H': 'Cola',
  '10H': 'Ginger Ale',
  JH: 'Coconut Milk',
  QH: 'Tomato Juice',
  KH: 'Grenadine',

  // Diamonds - Syrups & Sweeteners
  AD: 'Simple Syrup',
  '2D': 'Honey',
  '3D': 'Agave Syrup',
  '4D': 'Maple Syrup',
  '5D': 'Brown Sugar',
  '6D': 'Cinnamon Syrup',
  '7D': 'Vanilla Syrup',
  '8D': 'Orgeat',
  '9D': 'Blue Curaçao',
  '10D': 'Peach Schnapps',
  JD: 'Triple Sec',
  QD: 'Chambord',
  KD: 'Coffee Liqueur',

  // Clubs - Herbs, Spices & Bitters
  AC: 'Fresh Mint',
  '2C': 'Fresh Basil',
  '3C': 'Rosemary',
  '4C': 'Thyme',
  '5C': 'Bitters',
  '6C': 'Angostura Bitters',
  '7C': 'Aromatic Bitters',
  '8C': 'Cinnamon Powder',
  '9C': 'Nutmeg',
  '10C': 'Black Pepper',
  JC: 'Vermouth',
  QC: 'Dry Vermouth',
  KC: 'Sweet Vermouth',
}

// Weather Code Descriptions (WMO Weather interpretation codes)
export const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}
