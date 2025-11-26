import axios from 'axios'

const API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1'

export interface CocktailData {
  idDrink: string
  strDrink: string
  strCategory: string
  strAlcoholic: string
  strGlass: string
  strInstructions: string
  strDrinkThumb: string
  strIngredient1: string | null
  strIngredient2: string | null
  strIngredient3: string | null
  strIngredient4: string | null
  strIngredient5: string | null
  strIngredient6: string | null
  strIngredient7: string | null
  strIngredient8: string | null
  strIngredient9: string | null
  strIngredient10: string | null
  strMeasure1: string | null
  strMeasure2: string | null
  strMeasure3: string | null
  strMeasure4: string | null
  strMeasure5: string | null
  strMeasure6: string | null
  strMeasure7: string | null
  strMeasure8: string | null
  strMeasure9: string | null
  strMeasure10: string | null
}

export interface Drink {
  id: string
  name: string
  category: string
  alcoholic: string
  glass: string
  instructions: string
  image: string
  ingredients: Array<{ name: string; measure: string | null }>
}

// Transform API response to our format
function transformCocktail(cocktail: CocktailData): Drink {
  const ingredients: Array<{ name: string; measure: string | null }> = []

  for (let i = 1; i <= 10; i++) {
    const ingredientKey = `strIngredient${i}` as keyof CocktailData
    const measureKey = `strMeasure${i}` as keyof CocktailData
    const ingredient = cocktail[ingredientKey]

    if (ingredient) {
      ingredients.push({
        name: ingredient as string,
        measure: (cocktail[measureKey] as string | null) || null,
      })
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
  }
}

export const cocktailAPI = {
  // Search drinks by name
  async searchByName(name: string): Promise<Drink[]> {
    try {
      const response = await axios.get<{ drinks: CocktailData[] | null }>(
        `${API_BASE}/search.php?s=${name}`
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
    const response = await axios.get<{ drinks: CocktailData[] }>(
      `${API_BASE}/random.php`
    )
    return transformCocktail(response.data.drinks[0])
  },

  // Get drink by ID
  async getDrinkById(id: string): Promise<Drink> {
    const response = await axios.get<{ drinks: CocktailData[] }>(
      `${API_BASE}/lookup.php?i=${id}`
    )
    return transformCocktail(response.data.drinks[0])
  },

  // Get drinks by ingredient
  async getByIngredient(ingredient: string): Promise<Drink[]> {
    try {
      const response = await axios.get<{ drinks: CocktailData[] | null }>(
        `${API_BASE}/filter.php?i=${ingredient}`
      )
      if (!response.data.drinks) return []
      return response.data.drinks.map(transformCocktail)
    } catch (error) {
      console.error('Error fetching cocktails by ingredient:', error)
      throw error
    }
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    const response = await axios.get<{ drinks: Array<{ strCategory: string }> }>(
      `${API_BASE}/list.php?c=list`
    )
    return response.data.drinks.map((d) => d.strCategory)
  },
}
