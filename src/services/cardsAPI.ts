import axios from 'axios'

const DECK_API = 'https://deckofcardsapi.com/api/deck'

export interface Card {
  code: string
  image: string
  images: {
    svg: string
    png: string
  }
  value: string
  suit: string
}

export interface DeckResponse {
  success: boolean
  deck_id: string
  shuffled: boolean
  remaining: number
  cards?: Card[]
}

// Card to ingredient mapping
const CARD_TO_INGREDIENT_MAP: Record<string, string> = {
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

/**
 * Create a new deck
 */
export async function createDeck(): Promise<string> {
  try {
    const response = await axios.get<DeckResponse>(`${DECK_API}/new/shuffle/`)
    if (!response.data.success) {
      throw new Error('Failed to create deck')
    }
    return response.data.deck_id
  } catch (error) {
    console.error('Deck creation error:', error)
    throw new Error('Failed to create deck')
  }
}

/**
 * Draw a card from the deck
 */
export async function drawCard(deckId: string): Promise<Card> {
  try {
    const response = await axios.get<DeckResponse>(`${DECK_API}/${deckId}/draw/?count=1`)
    if (!response.data.success || !response.data.cards || response.data.cards.length === 0) {
      throw new Error('Failed to draw card')
    }
    return response.data.cards[0]
  } catch (error) {
    console.error('Card draw error:', error)
    throw new Error('Failed to draw card')
  }
}

/**
 * Convert a card to an ingredient
 */
export function cardToIngredient(card: Card): string {
  const ingredient = CARD_TO_INGREDIENT_MAP[card.code]
  if (!ingredient) {
    console.warn(`No ingredient mapping for card ${card.code}`)
    return `${card.value} of ${card.suit}`
  }
  return ingredient
}

/**
 * Get card details for display
 */
export function getCardDetails(card: Card): {
  ingredient: string
  cardName: string
  image: string
} {
  return {
    ingredient: cardToIngredient(card),
    cardName: `${card.value} of ${card.suit}`,
    image: card.images.png,
  }
}

/**
 * Draw multiple cards
 */
export async function drawMultipleCards(deckId: string, count: number): Promise<Card[]> {
  try {
    const response = await axios.get<DeckResponse>(
      `${DECK_API}/${deckId}/draw/?count=${Math.min(count, 52)}`
    )
    if (!response.data.success || !response.data.cards) {
      throw new Error('Failed to draw cards')
    }
    return response.data.cards
  } catch (error) {
    console.error('Multiple cards draw error:', error)
    throw new Error('Failed to draw cards')
  }
}
