import axios from 'axios'
import { COCKTAILS_API_URL } from '../constants'

export interface CocktailData {
  idDrink: string
  strDrink: string
  strCategory: string
  strAlcoholic: string
  strGlass: string
  strInstructions: string
  strDrinkThumb: string
  [key: string]: string | null
}

interface BaseDrink {
  id: string
  name: string
  image: string
}

export interface DrinkPreview extends BaseDrink {
  ingredientNames?: string[]
}

export interface Drink extends BaseDrink {
  category: string
  alcoholic: string
  glass: string
  instructions: string
  ingredients: Array<{ name: string; measure: string | null }>
  ingredientNames: string[]
}

// Transform API response to our format
function transformCocktail(cocktail: CocktailData): Drink {
  const ingredients: Array<{ name: string; measure: string | null }> = []
  const ingredientNames: string[] = []

  for (let i = 1; i <= 15; i++) {
    const ingredientKey = `strIngredient${i}` as keyof CocktailData
    const measureKey = `strMeasure${i}` as keyof CocktailData
    const ingredient = cocktail[ingredientKey]

    if (ingredient) {
      ingredients.push({
        name: ingredient as string,
        measure: (cocktail[measureKey] as string | null) || null,
      })
      ingredientNames.push(ingredient as string)
    }
  }

  return {
    id: cocktail.idDrink,
    name: cocktail.strDrink,
    category: cocktail.strCategory,
    alcoholic: cocktail.strAlcoholic,
    glass: cocktail.strGlass,
    instructions: cocktail.strInstructions,
    image: cocktail.strDrinkThumb,
    ingredients,
    ingredientNames,
  }
}

function transformCocktailPreview(cocktail: {
  idDrink: string
  strDrink: string
  strDrinkThumb: string
  [key: string]: string | null | undefined
}): DrinkPreview {
  const ingredientNames: string[] = []

  // Try to extract ingredients if available (e.g. from search results)
  for (let i = 1; i <= 15; i++) {
    const ingredientKey = `strIngredient${i}`
    if (cocktail[ingredientKey]) {
      ingredientNames.push(cocktail[ingredientKey])
    }
  }

  return {
    id: cocktail.idDrink,
    name: cocktail.strDrink,
    image: cocktail.strDrinkThumb,
    ingredientNames: ingredientNames.length > 0 ? ingredientNames : undefined,
  }
}

export const cocktailAPI = {
  // Search drinks by name
  async searchByName(name: string): Promise<Drink[]> {
    try {
      const response = await axios.get<{ drinks: CocktailData[] | null }>(
        `${COCKTAILS_API_URL}/search.php?s=${name}`
      )
      if (!response.data.drinks) return []
      return response.data.drinks.map(transformCocktail)
    } catch (error) {
      console.error('Error fetching cocktails:', error)
      throw error
    }
  },

  // Get random drink
  async getRandomDrink(): Promise<Drink> {
    const response = await axios.get<{ drinks: CocktailData[] }>(`${COCKTAILS_API_URL}/random.php`)
    return transformCocktail(response.data.drinks[0])
  },

  // Get drink by ID
  async getDrinkById(id: string): Promise<Drink> {
    const response = await axios.get<{ drinks: CocktailData[] }>(
      `${COCKTAILS_API_URL}/lookup.php?i=${id}`
    )
    return transformCocktail(response.data.drinks[0])
  },

  // Get list of all ingredients
  async getIngredientsList(): Promise<string[]> {
    try {
      const response = await axios.get<{ drinks: Array<{ strIngredient1: string }> }>(
        `${COCKTAILS_API_URL}/list.php?i=list`
      )
      return response.data.drinks.map(d => d.strIngredient1).sort()
    } catch (error) {
      console.error('Error fetching ingredients list:', error)
      return []
    }
  },

  // Get drinks by ingredient (Simplified)
  async getByIngredient(ingredient: string): Promise<DrinkPreview[]> {
    try {
      const response = await axios.get<{
        drinks: Array<{ idDrink: string; strDrink: string; strDrinkThumb: string }> | null
      }>(`${COCKTAILS_API_URL}/filter.php?i=${ingredient}`)
      if (!response.data.drinks) return []
      return response.data.drinks.map(transformCocktailPreview)
    } catch (error) {
      console.error('Error fetching cocktails by ingredient:', error)
      throw error
    }
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    const response = await axios.get<{ drinks: Array<{ strCategory: string }> }>(
      `${COCKTAILS_API_URL}/list.php?c=list`
    )
    return response.data.drinks.map(d => d.strCategory).sort()
  },

  // Get drinks by category (Simplified)
  async getDrinksByCategory(category: string): Promise<DrinkPreview[]> {
    try {
      const response = await axios.get<{
        drinks: Array<{ idDrink: string; strDrink: string; strDrinkThumb: string }> | null
      }>(`${COCKTAILS_API_URL}/filter.php?c=${category}`)
      if (!response.data.drinks) return []
      return response.data.drinks.map(transformCocktailPreview)
    } catch (error) {
      console.error(`Error fetching drinks for category ${category}:`, error)
      return []
    }
  },

  // Get all drinks by fetching from all categories (Simplified)
  async getAllDrinks(): Promise<DrinkPreview[]> {
    try {
      const categories = await this.getCategories()
      const allDrinks = new Map<string, DrinkPreview>()

      // Fetch drinks from each category
      for (const category of categories) {
        const drinks = await this.getDrinksByCategory(category)
        drinks.forEach(drink => {
          allDrinks.set(drink.id, drink)
        })
      }

      return Array.from(allDrinks.values())
    } catch (error) {
      console.error('Error fetching all drinks:', error)
      return []
    }
  },

  // Get drinks by letter
  async getDrinksByLetter(letter: string): Promise<DrinkPreview[]> {
    try {
      const response = await axios.get<{ drinks: CocktailData[] | null }>(
        `${COCKTAILS_API_URL}/search.php?f=${letter}`
      )
      if (!response.data.drinks) return []
      return response.data.drinks.map(transformCocktailPreview)
    } catch {
      // Some letters might return no results or error if empty
      return []
    }
  },

  // Get paginated drinks by iterating letters
  async getAllDrinksPaginated(
    pageParam: { letterIndex: number } = { letterIndex: 0 }
  ): Promise<{ drinks: DrinkPreview[]; nextPage: { letterIndex: number } | null }> {
    try {
      const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
      const letter = letters[pageParam.letterIndex]

      if (!letter) return { drinks: [], nextPage: null }

      const drinks = await this.getDrinksByLetter(letter)

      const nextIndex = pageParam.letterIndex + 1
      const hasMore = nextIndex < letters.length

      return {
        drinks,
        nextPage: hasMore ? { letterIndex: nextIndex } : null,
      }
    } catch {
      // Error fetching paginated drinks
      return { drinks: [], nextPage: null }
    }
  },
}
