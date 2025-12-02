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
    const response = await axios.get<{ drinks: CocktailData[] }>(`${API_BASE}/random.php`)
    return transformCocktail(response.data.drinks[0])
  },

  // Get drink by ID
  async getDrinkById(id: string): Promise<Drink> {
    const response = await axios.get<{ drinks: CocktailData[] }>(`${API_BASE}/lookup.php?i=${id}`)
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
    return response.data.drinks.map(d => d.strCategory)
  },

  // Get drinks by category with full details
  async getDrinksByCategory(category: string): Promise<Drink[]> {
    try {
      const response = await axios.get<{ drinks: Array<{ idDrink: string }> | null }>(
        `${API_BASE}/filter.php?c=${category}`
      )
      if (!response.data.drinks) return []

      // Fetch full details for each drink to get ingredients
      const fullDrinks = await Promise.all(
        response.data.drinks.map(drink => this.getDrinkById(drink.idDrink))
      )
      return fullDrinks
    } catch (error) {
      console.error(`Error fetching drinks for category ${category}:`, error)
      return []
    }
  },

  // Get all drinks by fetching from all categories
  async getAllDrinks(): Promise<Drink[]> {
    try {
      const categories = await this.getCategories()
      const allDrinks = new Map<string, Drink>()

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

  // Get drinks by category for infinite scroll (paginated)
  async getDrinksByCategoryPaginated(
    category: string,
    page: number,
    pageSize: number = 20
  ): Promise<Drink[]> {
    try {
      const response = await axios.get<{ drinks: Array<{ idDrink: string }> | null }>(
        `${API_BASE}/filter.php?c=${category}`
      )
      if (!response.data.drinks) return []

      // Sort and paginate
      const drinks = response.data.drinks.slice(page * pageSize, (page + 1) * pageSize)

      // Fetch full details for each drink
      const fullDrinks = await Promise.all(drinks.map(drink => this.getDrinkById(drink.idDrink)))
      return fullDrinks
    } catch (error) {
      console.error(`Error fetching drinks for category ${category}:`, error)
      return []
    }
  },

  // Get all categories for infinite scroll
  async getAllCategoriesPaginated(): Promise<string[]> {
    try {
      const categories = await this.getCategories()
      return categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  // Get paginated drinks across all categories
  async getAllDrinksPaginated(
    pageParam: { categoryIndex: number; page: number } = { categoryIndex: 0, page: 0 },
    pageSize: number = 20
  ): Promise<{ drinks: Drink[]; nextPage: { categoryIndex: number; page: number } | null }> {
    try {
      const categories = await this.getCategories()
      let currentCategoryIndex = pageParam.categoryIndex
      let currentPage = pageParam.page
      const allDrinks: Drink[] = []
      const seenIds = new Set<string>()

      // Keep fetching until we have enough drinks or run out of categories
      while (allDrinks.length < pageSize && currentCategoryIndex < categories.length) {
        const category = categories[currentCategoryIndex]
        const categoryDrinks = await this.getDrinksByCategoryPaginated(
          category,
          currentPage,
          pageSize
        )

        if (categoryDrinks.length === 0) {
          // Move to next category
          currentCategoryIndex += 1
          currentPage = 0
        } else {
          // Add unique drinks
          categoryDrinks.forEach(drink => {
            if (!seenIds.has(drink.id) && allDrinks.length < pageSize) {
              seenIds.add(drink.id)
              allDrinks.push(drink)
            }
          })

          if (allDrinks.length < pageSize) {
            currentPage += 1
          }
        }
      }

      const hasMore = currentCategoryIndex < categories.length
      const nextPage = hasMore ? { categoryIndex: currentCategoryIndex, page: currentPage } : null

      return {
        drinks: allDrinks,
        nextPage,
      }
    } catch (error) {
      console.error('Error fetching paginated drinks:', error)
      return { drinks: [], nextPage: null }
    }
  },
}
