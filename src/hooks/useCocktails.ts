import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { cocktailAPI } from '../services/cocktailAPI'

export function useCocktailSearchAction(name: string) {
  return useQuery({
    queryKey: ['cocktails', 'search', name],
    queryFn: () => cocktailAPI.searchByName(name),
    enabled: name.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useRandomCocktailAction() {
  return useQuery({
    queryKey: ['cocktails', 'random'],
    queryFn: () => cocktailAPI.getRandomDrink(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCocktailByIdAction(id: string) {
  return useQuery({
    queryKey: ['cocktails', 'detail', id],
    queryFn: () => cocktailAPI.getDrinkById(id),
    enabled: id.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useCocktailsByIngredientAction(ingredient: string) {
  return useQuery({
    queryKey: ['cocktails', 'ingredient', ingredient],
    queryFn: () => cocktailAPI.getByIngredient(ingredient),
    enabled: ingredient.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCocktailCategoriesAction() {
  return useQuery({
    queryKey: ['cocktails', 'categories'],
    queryFn: () => cocktailAPI.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour - rarely changes
  })
}

export function useAllCocktailsAction() {
  return useQuery({
    queryKey: ['cocktails', 'all'],
    queryFn: () => cocktailAPI.getAllDrinks(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

export function useInfiniteAllCocktailsAction() {
  return useInfiniteQuery({
    queryKey: ['cocktails', 'infinite', 'all'],
    queryFn: ({ pageParam }) => cocktailAPI.getAllDrinksPaginated(pageParam),
    initialPageParam: { letterIndex: 0 },
    getNextPageParam: lastPage => lastPage.nextPage,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
