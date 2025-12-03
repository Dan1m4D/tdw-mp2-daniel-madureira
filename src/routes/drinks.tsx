import { createFileRoute } from '@tanstack/react-router'
import type { DrinkPreview } from '../services/cocktailAPI'
import {
  useCocktailSearchAction,
  useInfiniteAllCocktailsAction,
  useCocktailIngredientsAction,
  useCocktailCategoriesAction,
  useCocktailsByIngredientAction,
  useCocktailsByCategoryAction,
} from '../actions/useCocktails'
import { Wine } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import type { RootState } from '../app/store'
import { advanceToNextStop } from '../features/adventure/adventureSlice'
import { useNavigate } from '@tanstack/react-router'
import { NPCSuccessModal } from '../components'
import { DrinkCard } from '../components/drinks/DrinkCard'
import { DrinkDetailContainer } from '../components/drinks/DrinkDetailContainer'

export const Route = createFileRoute('/drinks')({
  component: DrinksPage,
})

type FilterType = 'all' | 'search' | 'ingredient' | 'category'

function DrinksPage() {
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterValue, setFilterValue] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [sortByMissing, setSortByMissing] = useState(false)
  const [selectedDrinkId, setSelectedDrinkId] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState<{
    npcName: string
    drinkName: string
    currentStop: number
    totalStops: number
  } | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Get crafting state
  const craftingState = useAppSelector((state: RootState) => state.crafting)
  const adventureState = useAppSelector((state: RootState) => state.adventure)
  const playerInventory = useAppSelector((state: RootState) => state.game.inventory)

  // Queries
  const ingredientsQuery = useCocktailIngredientsAction()
  const categoriesQuery = useCocktailCategoriesAction()

  // Conditional Queries based on filter
  const searchQuery = useCocktailSearchAction(filterType === 'search' ? filterValue : '')
  const ingredientQuery = useCocktailsByIngredientAction(
    filterType === 'ingredient' ? selectedIngredients.join(',') : ''
  )
  const categoryQuery = useCocktailsByCategoryAction(filterType === 'category' ? filterValue : '')
  const infiniteAllDrinks = useInfiniteAllCocktailsAction()

  // Determine which data to show
  let drinks: DrinkPreview[] = []
  let isLoading = false
  let error = null
  let hasMore = false
  let isFetchingNextPage = false

  if (filterType === 'search') {
    drinks = searchQuery.data || []
    isLoading = searchQuery.isLoading
    error = searchQuery.error
  } else if (filterType === 'ingredient') {
    drinks = ingredientQuery.data || []
    isLoading = ingredientQuery.isLoading
    error = ingredientQuery.error
  } else if (filterType === 'category') {
    drinks = categoryQuery.data || []
    isLoading = categoryQuery.isLoading
    error = categoryQuery.error
  } else {
    // Default: Infinite scroll of all drinks
    drinks = infiniteAllDrinks.data?.pages.flatMap(page => page.drinks) || []
    isLoading = infiniteAllDrinks.isLoading
    error = infiniteAllDrinks.error
    hasMore = !!infiniteAllDrinks.hasNextPage
    isFetchingNextPage = infiniteAllDrinks.isFetchingNextPage
  }

  // Sort by missing ingredients if enabled
  if (sortByMissing && drinks.length > 0) {
    drinks = [...drinks].sort((a, b) => {
      // Helper to count missing ingredients
      const getMissingCount = (drink: DrinkPreview) => {
        if (!drink.ingredientNames) return 999 // Push to bottom if no ingredients known
        const missing = drink.ingredientNames.filter(
          ing => !playerInventory.some(inv => inv.toLowerCase() === ing.toLowerCase())
        )
        return missing.length
      }
      return getMissingCount(a) - getMissingCount(b)
    })
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    if (query.trim()) {
      setFilterType('search')
      setFilterValue(query.trim())
      setSelectedIngredients([])
    } else {
      setFilterType('all')
      setFilterValue('')
    }
  }

  const handleFilterSelect = (type: 'ingredient' | 'category', value: string) => {
    if (type === 'category') {
      if (filterType === 'category' && filterValue === value) {
        setFilterType('all')
        setFilterValue('')
      } else {
        setFilterType('category')
        setFilterValue(value)
        setSelectedIngredients([])
      }
    } else if (type === 'ingredient') {
      setFilterType('ingredient')
      setFilterValue('') // Not used for multi-select

      setSelectedIngredients(prev => {
        if (prev.includes(value)) {
          const next = prev.filter(i => i !== value)
          if (next.length === 0) {
            setFilterType('all')
          }
          return next
        } else {
          return [...prev, value]
        }
      })
    }
  }

  // Infinite scroll observer
  const handleIntersection = useCallback(() => {
    if (
      filterType === 'all' &&
      infiniteAllDrinks.hasNextPage &&
      !infiniteAllDrinks.isFetchingNextPage
    ) {
      infiniteAllDrinks.fetchNextPage()
    }
  }, [filterType, infiniteAllDrinks])

  useEffect(() => {
    const target = observerTarget.current
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          handleIntersection()
        }
      },
      { threshold: 0.1 }
    )

    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target)
      }
    }
  }, [handleIntersection])

  return (
    <div className="min-h-[calc(100vh-120px)] py-12 px-4">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 mix-blend-multiply"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-6 p-6 bg-base-100 border-4 border-base-content/20 rounded-xl shadow-xl transform -rotate-1">
            <Wine size={48} className="text-primary mx-auto mb-3" />
            <h1 className="text-5xl font-bold font-serif mb-2">Cocktail Compendium</h1>
            <p className="text-base-content/70 italic">
              A bartender's collected recipes from around the world
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              name="search"
              placeholder="Search cocktails..."
              className="input input-bordered flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Filters Section */}
        <div className="mb-12 space-y-6 bg-base-100 border-2 border-base-content/10 rounded-lg p-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Categories</h3>
            {categoriesQuery.isLoading ? (
              <div className="flex gap-2">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                {categoriesQuery.data?.map(category => (
                  <button
                    key={category}
                    onClick={() => handleFilterSelect('category', category)}
                    className={`badge badge-lg cursor-pointer transition-all hover:scale-105 ${
                      filterType === 'category' && filterValue === category
                        ? 'badge-primary'
                        : 'badge-outline'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
            {ingredientsQuery.isLoading ? (
              <div className="flex gap-2">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap max-h-48 overflow-y-auto">
                {ingredientsQuery.data?.map(ingredient => (
                  <button
                    key={ingredient}
                    onClick={() => handleFilterSelect('ingredient', ingredient)}
                    className={`badge badge-lg cursor-pointer transition-all hover:scale-105 ${
                      selectedIngredients.includes(ingredient) ? 'badge-primary' : 'badge-outline'
                    }`}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-base-content/10">
            <div className="form-control">
              <label className="label cursor-pointer gap-2">
                <span className="label-text font-medium">Sort by "Ingredients I Have"</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={sortByMissing}
                  onChange={e => setSortByMissing(e.target.checked)}
                />
              </label>
            </div>

            {filterType !== 'all' && (
              <button
                onClick={() => {
                  setFilterType('all')
                  setFilterValue('')
                  setSelectedIngredients([])
                }}
                className="btn btn-sm btn-ghost text-error"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Status */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-serif">
            {filterType === 'all' && 'All Cocktails'}
            {filterType === 'search' && `Search: "${filterValue}"`}
            {filterType === 'category' && `Category: ${filterValue}`}
            {filterType === 'ingredient' && `Ingredients: ${selectedIngredients.join(', ')}`}
          </h2>
          <span className="badge badge-ghost">{drinks.length} results</span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error mb-8">
            <span>Error loading cocktails. Please try again.</span>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && drinks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content/60 text-lg">
              No cocktails found. Try a different search or filter!
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks.map((drink, index) => (
            <div key={drink.id} onClick={() => setSelectedDrinkId(drink.id)} className="block">
              <DrinkCard drink={drink} index={index} />
            </div>
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        {filterType === 'all' && (
          <div ref={observerTarget} className="flex justify-center py-8">
            {isFetchingNextPage ? (
              <span className="loading loading-spinner loading-lg text-primary"></span>
            ) : !hasMore && drinks.length > 0 ? (
              <p className="text-base-content/60 text-sm">No more cocktails to load</p>
            ) : null}
          </div>
        )}

        {/* Drink Detail Drawer */}
        {selectedDrinkId && (
          <DrinkDetailContainer
            drinkId={selectedDrinkId}
            playerInventory={playerInventory}
            onClose={() => setSelectedDrinkId(null)}
            isCraftingForNPC={craftingState.isCraftingForNPC}
            craftingNPCName={craftingState.currentNPCName || undefined}
            craftingNPCId={craftingState.currentNPCId || undefined}
            currentStopIndex={adventureState.currentStopIndex}
            totalStops={adventureState.routeData?.stopPoints.length || 5}
            onShowSuccessModal={setShowSuccessModal}
          />
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <NPCSuccessModal
            isOpen={!!showSuccessModal}
            npcName={showSuccessModal.npcName}
            drinkName={showSuccessModal.drinkName}
            currentStop={showSuccessModal.currentStop}
            totalStops={showSuccessModal.totalStops}
            onAdvance={() => {
              dispatch(advanceToNextStop())
              setSelectedDrinkId(null)
              setShowSuccessModal(null)
              navigate({ to: '/adventure' })
            }}
          />
        )}
      </div>
    </div>
  )
}
