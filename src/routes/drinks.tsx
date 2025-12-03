import { createFileRoute } from '@tanstack/react-router'
import type { Drink, DrinkPreview } from '../services/cocktailAPI'
import {
  useCocktailSearchAction,
  useInfiniteAllCocktailsAction,
  useCocktailIngredientsAction,
  useCocktailCategoriesAction,
  useCocktailsByIngredientAction,
  useCocktailsByCategoryAction,
  useCocktailByIdAction,
} from '../actions/useCocktails'
import { Wine, Zap, X, Check } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import type { RootState } from '../app/store'
import { completeCrafting } from '../features/crafting/craftingSlice'
import { removeIngredient } from '../features/game/gameSlice'
import { completeNPC, advanceToNextStop } from '../features/adventure/adventureSlice'
import { useNavigate } from '@tanstack/react-router'
import { NPCSuccessModal } from '../components'

export const Route = createFileRoute('/drinks')({
  component: DrinksPage,
})

type FilterType = 'all' | 'search' | 'ingredient' | 'category'

function DrinksPage() {
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterValue, setFilterValue] = useState('')
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
    filterType === 'ingredient' ? filterValue : ''
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    if (query.trim()) {
      setFilterType('search')
      setFilterValue(query.trim())
    } else {
      setFilterType('all')
      setFilterValue('')
    }
  }

  const handleFilterSelect = (type: 'ingredient' | 'category', value: string) => {
    if (filterType === type && filterValue === value) {
      setFilterType('all')
      setFilterValue('')
    } else {
      setFilterType(type)
      setFilterValue(value)
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
                      filterType === 'ingredient' && filterValue === ingredient
                        ? 'badge-primary'
                        : 'badge-outline'
                    }`}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filterType !== 'all' && (
            <button
              onClick={() => {
                setFilterType('all')
                setFilterValue('')
              }}
              className="btn btn-sm btn-ghost text-error"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Status */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-serif">
            {filterType === 'all' && 'All Cocktails'}
            {filterType === 'search' && `Search: "${filterValue}"`}
            {filterType === 'category' && `Category: ${filterValue}`}
            {filterType === 'ingredient' && `Ingredient: ${filterValue}`}
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

interface DrinkCardProps {
  drink: DrinkPreview
  index: number
}

function DrinkCard({ drink, index }: DrinkCardProps) {
  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2']
  const rotation = rotations[index % rotations.length]

  return (
    <div
      className={`card bg-base-100 border-3 border-base-content/20 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full ${rotation}`}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)',
        }}
      />

      <div className="card-body relative z-10 space-y-3 p-4">
        <div className="aspect-square rounded-lg overflow-hidden border-2 border-base-300 mb-2">
          <img
            src={drink.image}
            alt={drink.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <h2 className="card-title text-xl font-serif text-primary leading-tight">{drink.name}</h2>

        <div className="flex items-center justify-between pt-2 mt-auto">
          <span className="text-xs text-base-content/60">Click for recipe</span>
          <span className="text-xs text-primary/40 font-mono">#{drink.id}</span>
        </div>
      </div>
    </div>
  )
}

interface DrinkDetailContainerProps {
  drinkId: string
  playerInventory: string[]
  onClose: () => void
  isCraftingForNPC: boolean
  craftingNPCName?: string
  craftingNPCId?: string
  currentStopIndex: number
  totalStops: number
  onShowSuccessModal: (data: {
    npcName: string
    drinkName: string
    currentStop: number
    totalStops: number
  }) => void
}

function DrinkDetailContainer(props: DrinkDetailContainerProps) {
  const { data: drink, isLoading, error } = useCocktailByIdAction(props.drinkId)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    )
  }

  if (error || !drink) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-base-100 p-6 rounded-lg">
          <p className="text-error">Failed to load drink details.</p>
          <button onClick={props.onClose} className="btn btn-sm mt-4">
            Close
          </button>
        </div>
      </div>
    )
  }

  return <DrinkDetailDrawer drink={drink} {...props} />
}

interface DrinkDetailDrawerProps {
  drink: Drink
  playerInventory: string[]
  onClose: () => void
  isCraftingForNPC: boolean
  craftingNPCName?: string
  craftingNPCId?: string
  currentStopIndex: number
  totalStops: number
  onShowSuccessModal: (data: {
    npcName: string
    drinkName: string
    currentStop: number
    totalStops: number
  }) => void
}

function DrinkDetailDrawer({
  drink,
  playerInventory,
  onClose,
  isCraftingForNPC,
  craftingNPCName,
  craftingNPCId,
  currentStopIndex,
  totalStops,
  onShowSuccessModal,
}: DrinkDetailDrawerProps) {
  const dispatch = useAppDispatch()

  const drinkIngredients = drink.ingredients.map(ingredient => ({
    name: ingredient.name,
    measure: ingredient.measure,
    has: playerInventory.some((inv: string) => inv.toLowerCase() === ingredient.name.toLowerCase()),
  }))

  const canCraft = drinkIngredients.every(ing => ing.has)

  const handleCraft = () => {
    if (!canCraft) return

    // Remove ingredients from inventory
    drinkIngredients.forEach(ingredient => {
      if (ingredient.has) {
        dispatch(removeIngredient(ingredient.name))
      }
    })

    if (isCraftingForNPC && craftingNPCId && craftingNPCName) {
      // Show success modal instead of immediate navigation
      onShowSuccessModal({
        npcName: craftingNPCName,
        drinkName: drink.name,
        currentStop: currentStopIndex + 1,
        totalStops,
      })

      // Dispatch the NPC completion and crafting completion
      dispatch(
        completeNPC({
          npcId: craftingNPCId,
          npcName: craftingNPCName,
          drinkCrafted: drink.name,
          ingredientsUsed: drinkIngredients.map(i => i.name),
        })
      )
      dispatch(completeCrafting())
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Drawer from right */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-base-100 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Close button */}
        <div className="sticky top-0 flex items-center justify-between p-4 bg-base-100 border-b border-base-300 z-10">
          <h2 className="text-2xl font-serif font-bold text-primary truncate pr-4">{drink.name}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* NPC Requirements (when crafting for NPC) */}
          {isCraftingForNPC && craftingNPCName && (
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-primary">👤 Customer Request</h3>
              <p className="text-base-content/80 font-medium mb-3">{craftingNPCName} wants:</p>
              <p className="text-sm text-base-content/70 italic">
                A drink with ingredients they enjoy. Choose wisely to satisfy them!
              </p>
            </div>
          )}

          {/* Drink Image */}
          {drink.image && (
            <div className="rounded-lg overflow-hidden border-2 border-base-300 shadow-md">
              <img src={drink.image} alt={drink.name} className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-base-200 rounded p-3 text-center">
              <p className="text-xs text-base-content/60">Glass</p>
              <p className="text-sm font-semibold text-primary truncate" title={drink.glass}>
                {drink.glass}
              </p>
            </div>
            <div className="bg-base-200 rounded p-3 text-center">
              <p className="text-xs text-base-content/60">Type</p>
              <p className="text-sm font-semibold text-primary truncate" title={drink.alcoholic}>
                {drink.alcoholic}
              </p>
            </div>
            <div className="bg-base-200 rounded p-3 text-center">
              <p className="text-xs text-base-content/60">Category</p>
              <p className="text-sm font-semibold text-primary truncate" title={drink.category}>
                {drink.category}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold text-lg mb-2 font-serif">Instructions</h3>
            <p className="text-base-content/80 leading-relaxed italic bg-base-200/30 p-4 rounded-lg border border-base-200">
              {drink.instructions}
            </p>
          </div>

          {/* Craftability Status */}
          <div className={`alert ${canCraft ? 'alert-success' : 'alert-warning'}`}>
            <div className="flex items-start gap-2">
              {canCraft ? (
                <Check size={20} className="text-success" />
              ) : (
                <Zap size={20} className="text-warning" />
              )}
              <div>
                <h4 className="font-semibold">
                  {canCraft ? '✓ You can craft this!' : '⚠ Missing ingredients'}
                </h4>
                <p className="text-sm opacity-90">
                  {canCraft
                    ? 'All ingredients are in your inventory.'
                    : `You're missing ${drinkIngredients.filter(i => !i.has).length} ingredient(s)`}
                </p>
              </div>
            </div>
          </div>

          {/* Ingredients List */}
          <div>
            <h3 className="font-semibold text-lg mb-3 font-serif">
              Recipe ({drinkIngredients.length} ingredients)
            </h3>
            <div className="space-y-2">
              {drinkIngredients.map(ingredient => (
                <div
                  key={ingredient.name}
                  className={`flex items-center gap-3 p-3 rounded border-2 ${
                    ingredient.has
                      ? 'bg-success/10 border-success/30'
                      : 'bg-warning/10 border-warning/30'
                  }`}
                >
                  <div className={`shrink-0 ${ingredient.has ? 'text-success' : 'text-warning'}`}>
                    {ingredient.has ? <Check size={20} /> : <X size={20} />}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${ingredient.has ? 'text-success' : 'text-warning'}`}
                    >
                      {ingredient.name}
                    </p>
                    {ingredient.measure && (
                      <p className="text-xs text-base-content/60">{ingredient.measure}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold ${ingredient.has ? 'text-success' : 'text-warning'}`}
                  >
                    {ingredient.has ? 'Have' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Craft Button */}
          <button
            onClick={handleCraft}
            className={`btn w-full btn-lg ${canCraft ? 'btn-success' : 'btn-disabled'}`}
          >
            {canCraft
              ? isCraftingForNPC
                ? `Craft for ${craftingNPCName}`
                : 'Craft Drink'
              : 'Cannot Craft'}
          </button>
        </div>
      </div>
    </>
  )
}
