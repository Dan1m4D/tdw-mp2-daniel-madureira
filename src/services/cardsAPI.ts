import axios from 'axios'
import { DECK_API, CARD_TO_INGREDIENT_MAP } from '../constants'

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
 * Reshuffle a deck
 */
export async function reshuffleDeck(deckId: string): Promise<DeckResponse> {
  try {
    const response = await axios.get<DeckResponse>(`${DECK_API}/${deckId}/shuffle/`)
    if (!response.data.success) {
      throw new Error('Failed to reshuffle deck')
    }
    return response.data
  } catch (error) {
    console.error('Deck reshuffle error:', error)
    throw new Error('Failed to reshuffle deck')
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
