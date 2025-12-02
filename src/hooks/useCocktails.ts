import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { cocktailAPI } from '../services/cocktailAPI'

export function useCocktailSearch(name: string) {
  return useQuery({
    queryKey: ['cocktails', 'search', name],
    queryFn: () => cocktailAPI.searchByName(name),
    enabled: name.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useRandomCocktail() {
  return useQuery({
    queryKey: ['cocktails', 'random'],
    queryFn: () => cocktailAPI.getRandomDrink(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCocktailById(id: string) {
  return useQuery({
    queryKey: ['cocktails', 'detail', id],
    queryFn: () => cocktailAPI.getDrinkById(id),
    enabled: id.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useCocktailsByIngredient(ingredient: string) {
  return useQuery({
    queryKey: ['cocktails', 'ingredient', ingredient],
    queryFn: () => cocktailAPI.getByIngredient(ingredient),
    enabled: ingredient.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCocktailCategories() {
  return useQuery({
    queryKey: ['cocktails', 'categories'],
    queryFn: () => cocktailAPI.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour - rarely changes
  })
}

export function useAllCocktails() {
  return useQuery({
    queryKey: ['cocktails', 'all'],
    queryFn: () => cocktailAPI.getAllDrinks(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

export function useInfiniteAllCocktails() {
  return useInfiniteQuery({
    queryKey: ['cocktails', 'infinite', 'all'],
    queryFn: ({ pageParam }) => cocktailAPI.getAllDrinksPaginated(pageParam),
    initialPageParam: { categoryIndex: 0, page: 0 },
    getNextPageParam: lastPage => lastPage.nextPage,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
