export interface Drink {
  id: string
  name: string
  category: string
  ingredients: string[]
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  baseSpirit: string
}

export const MOCK_DRINKS: Drink[] = [
  {
    id: '1',
    name: 'Mojito',
    category: 'Refreshing',
    ingredients: ['Light Rum', 'Fresh Mint', 'Lime Juice', 'Sugar', 'Soda Water'],
    description: 'A crisp, refreshing Cuban classic with lime and mint',
    difficulty: 'easy',
    baseSpirit: 'Rum',
  },
  {
    id: '2',
    name: 'Martini',
    category: 'Classic',
    ingredients: ['Gin', 'Dry Vermouth', 'Olive'],
    description: 'The quintessential cocktail - elegant and timeless',
    difficulty: 'easy',
    baseSpirit: 'Gin',
  },
  {
    id: '3',
    name: 'Old Fashioned',
    category: 'Spirit-Forward',
    ingredients: ['Whiskey', 'Sugar', 'Bitters', 'Orange Peel'],
    description: 'A sophisticated bourbon classic, bold and warming',
    difficulty: 'medium',
    baseSpirit: 'Whiskey',
  },
  {
    id: '4',
    name: 'Daiquiri',
    category: 'Refreshing',
    ingredients: ['White Rum', 'Fresh Lime Juice', 'Simple Syrup'],
    description: 'Deceptively simple but perfectly balanced Caribbean delight',
    difficulty: 'easy',
    baseSpirit: 'Rum',
  },
  {
    id: '5',
    name: 'Margarita',
    category: 'Refreshing',
    ingredients: ['Tequila', 'Triple Sec', 'Lime Juice', 'Salt'],
    description: 'A vibrant Mexican favorite with a perfect balance of citrus',
    difficulty: 'medium',
    baseSpirit: 'Tequila',
  },
  {
    id: '6',
    name: 'Negroni',
    category: 'Spirit-Forward',
    ingredients: ['Gin', 'Campari', 'Sweet Vermouth'],
    description: 'Bold, bitter, and utterly captivating Italian aperitivo',
    difficulty: 'easy',
    baseSpirit: 'Gin',
  },
  {
    id: '7',
    name: 'Sazerac',
    category: 'Spirit-Forward',
    ingredients: ['Rye Whiskey', 'Absinthe', 'Peychaud Bitters', 'Lemon Peel'],
    description: 'A legendary New Orleans cocktail with complex botanicals',
    difficulty: 'hard',
    baseSpirit: 'Whiskey',
  },
  {
    id: '8',
    name: 'Pisco Sour',
    category: 'Refreshing',
    ingredients: ['Pisco', 'Lime Juice', 'Simple Syrup', 'Egg White', 'Angostura Bitters'],
    description: 'A Peruvian treasure with a silky, foamy head',
    difficulty: 'hard',
    baseSpirit: 'Pisco',
  },
]
