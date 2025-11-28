import { createFileRoute } from '@tanstack/react-router'
import type { Drink } from '../services/cocktailAPI'
import { useCocktailSearch } from '../hooks/useCocktails'
import { Wine, BookOpen, Zap, X, Check } from 'lucide-react'
import { useState } from 'react'
import { useAppSelector } from '../app/hooks'
import type { RootState } from '../app/store'

export const Route = createFileRoute('/drinks')({
  component: DrinksPage,
})

function DrinksPage() {
  const [searchQuery, setSearchQuery] = useState('margarita') // Default search
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null)
  const { data: drinks, isLoading, error } = useCocktailSearch(searchQuery)
  const playerInventory = useAppSelector((state: RootState) => state.game.inventory)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    if (query.trim()) {
      setSearchQuery(query)
    }
  }

  const closeDrawer = () => {
    setSelectedDrink(null)
  }

  return (
    <div className="min-h-[calc(100vh-120px)] py-12 px-4">
      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none opacity-5 mix-blend-multiply" 
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)' }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with worn notebook style */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-6 p-6 bg-base-100 border-4 border-base-content/20 rounded-xl shadow-xl transform -rotate-1">
            <Wine size={48} className="text-primary mx-auto mb-3" />
            <h1 className="text-5xl font-bold font-serif mb-2">Cocktail Compendium</h1>
            <p className="text-base-content/70 italic">A bartender's collected recipes from around the world</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              name="search"
              placeholder="Search cocktails..."
              defaultValue={searchQuery}
              className="input input-bordered flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
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
        {!isLoading && !error && (!drinks || drinks.length === 0) && (
          <div className="text-center py-12">
            <p className="text-base-content/60 text-lg">No cocktails found. Try a different search!</p>
          </div>
        )}

        {/* Stats Bar */}
        {drinks && drinks.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-12">
            <StatsCard icon={<BookOpen size={24} />} label="Recipes" value={drinks.length} />
            <StatsCard icon={<Wine size={24} />} label="Category" value={drinks[0]?.category || 'N/A'} />
            <StatsCard icon={<Zap size={24} />} label="Ingredients" value={drinks[0]?.ingredients.length || 0} />
          </div>
        )}

        {/* Drinks Grid */}
        {drinks && drinks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map((drink, index) => (
              <div key={drink.id} onClick={() => setSelectedDrink(drink)} className="block">
                <DrinkCard drink={drink} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Drink Detail Drawer */}
        {selectedDrink && (
          <DrinkDetailDrawer
            drink={selectedDrink}
            playerInventory={playerInventory}
            onClose={closeDrawer}
          />
        )}
      </div>
    </div>
  )
}

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
}

function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <div className="card bg-base-100 border-2 border-base-content/10 shadow-md">
      <div className="card-body items-center text-center p-4">
        <div className="text-primary mb-2">{icon}</div>
        <p className="text-sm text-base-content/60">{label}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  )
}

interface DrinkCardProps {
  drink: Drink
  index: number
}

function DrinkCard({ drink, index }: DrinkCardProps) {
  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2']
  const rotation = rotations[index % rotations.length]

  return (
    <div className={`card bg-base-100 border-3 border-base-content/20 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full ${rotation}`}>
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)' }}
      />

      <div className="card-body relative z-10 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h2 className="card-title text-2xl font-serif text-primary mb-1">{drink.name}</h2>
            <p className="text-sm text-base-content/60 italic">{drink.category}</p>
          </div>
        </div>

        <div className="divider my-2" />
        <div className="flex gap-2 flex-wrap text-xs">
          <span className="badge badge-outline">{drink.glass}</span>
          <span className="badge badge-outline">{drink.alcoholic}</span>
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2 italic">"{drink.instructions}"</p>

        <div className="bg-base-200/50 rounded p-3 border border-base-300/50">
          <p className="text-xs font-semibold text-base-content/80 mb-2">Ingredients ({drink.ingredients.length}):</p>
          <ul className="text-xs text-base-content/70 space-y-1">
            {drink.ingredients.slice(0, 3).map((ingredient) => (
              <li key={ingredient.name}>
                • {ingredient.name} {ingredient.measure ? `- ${ingredient.measure}` : ''}
              </li>
            ))}
            {drink.ingredients.length > 3 && (
              <li className="text-primary/80 italic">+ {drink.ingredients.length - 3} more</li>
            )}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-primary/60 font-serif italic">ID: {drink.id}</span>
        </div>
      </div>
    </div>
  )
}

interface DrinkDetailDrawerProps {
  drink: Drink
  playerInventory: string[]
  onClose: () => void
}

function DrinkDetailDrawer({ drink, playerInventory, onClose }: DrinkDetailDrawerProps) {
  const drinkIngredients = drink.ingredients.map(ingredient => ({
    name: ingredient.name,
    measure: ingredient.measure,
    has: playerInventory.some((inv: string) => inv.toLowerCase() === ingredient.name.toLowerCase()),
  }))

  const canCraft = drinkIngredients.every(ing => ing.has)

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer from right */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-base-100 shadow-2xl z-50 overflow-y-auto">
        {/* Close button */}
        <div className="sticky top-0 flex items-center justify-between p-4 bg-base-100 border-b border-base-300">
          <h2 className="text-2xl font-serif font-bold text-primary">{drink.name}</h2>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Drink Image */}
          {drink.image && (
            <div className="rounded-lg overflow-hidden border-2 border-base-300">
              <img src={drink.image} alt={drink.name} className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-base-200 rounded p-3 text-center">
              <p className="text-xs text-base-content/60">Glass</p>
              <p className="text-sm font-semibold text-primary">{drink.glass}</p>
            </div>
            <div className="bg-base-200 rounded p-3 text-center">
              <p className="text-xs text-base-content/60">Type</p>
              <p className="text-sm font-semibold text-primary">{drink.alcoholic}</p>
            </div>
            <div className="bg-base-200 rounded p-3 text-center">
              <p className="text-xs text-base-content/60">Category</p>
              <p className="text-sm font-semibold text-primary">{drink.category}</p>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold text-lg mb-2 font-serif">Instructions</h3>
            <p className="text-base-content/80 leading-relaxed italic">{drink.instructions}</p>
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
            <h3 className="font-semibold text-lg mb-3 font-serif">Recipe ({drinkIngredients.length} ingredients)</h3>
            <div className="space-y-2">
              {drinkIngredients.map((ingredient) => (
                <div key={ingredient.name} className={`flex items-center gap-3 p-3 rounded border-2 ${
                  ingredient.has 
                    ? 'bg-success/10 border-success/30' 
                    : 'bg-warning/10 border-warning/30'
                }`}>
                  <div className={`shrink-0 ${ingredient.has ? 'text-success' : 'text-warning'}`}>
                    {ingredient.has ? <Check size={20} /> : <X size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${ingredient.has ? 'text-success' : 'text-warning'}`}>
                      {ingredient.name}
                    </p>
                    {ingredient.measure && (
                      <p className="text-xs text-base-content/60">{ingredient.measure}</p>
                    )}
                  </div>
                  <span className={`text-xs font-semibold ${ingredient.has ? 'text-success' : 'text-warning'}`}>
                    {ingredient.has ? 'Have' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Craft Button */}
          <button className={`btn w-full ${canCraft ? 'btn-success' : 'btn-disabled'}`}>
            {canCraft ? 'Craft Drink' : 'Cannot Craft'}
          </button>
        </div>
      </div>
    </>
  )
}

