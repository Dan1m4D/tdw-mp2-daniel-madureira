import { createFileRoute } from '@tanstack/react-router'
import type { Drink } from '../data/mockDrinks'
import { MOCK_DRINKS } from '../data/mockDrinks'
import { Wine, BookOpen, Zap } from 'lucide-react'

export const Route = createFileRoute('/drinks')({
  component: DrinksPage,
})

function DrinksPage() {
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
            <p className="text-base-content/70 italic">A bartender's collected recipes</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <StatsCard icon={<BookOpen size={24} />} label="Recipes" value={MOCK_DRINKS.length} />
          <StatsCard icon={<Wine size={24} />} label="Spirits" value="6" />
          <StatsCard icon={<Zap size={24} />} label="Flavors" value="12+" />
        </div>

        {/* Drinks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DRINKS.map((drink, index) => (
            <DrinkCard key={drink.id} drink={drink} index={index} />
          ))}
        </div>
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

  const difficultyColors = {
    easy: 'badge-success',
    medium: 'badge-warning',
    hard: 'badge-error',
  }

  return (
    <div className={`card bg-base-100 border-3 border-base-content/20 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer h-full ${rotation}`}>
        {/* Worn paper texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)' }}
        />

        <div className="card-body relative z-10 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h2 className="card-title text-2xl font-serif text-primary mb-1">{drink.name}</h2>
              <p className="text-sm text-base-content/60 italic">{drink.category}</p>
            </div>
          </div>

          {/* Spirit Type */}
          <div className="divider my-2" />
          <p className="text-xs font-semibold text-primary/80 tracking-widest uppercase">
            Base: {drink.baseSpirit}
          </p>

          {/* Description */}
          <p className="text-sm text-base-content/70 line-clamp-2">{drink.description}</p>

          {/* Ingredients List */}
          <div className="bg-base-200/50 rounded p-3 border border-base-300/50">
            <p className="text-xs font-semibold text-base-content/80 mb-2">Ingredients:</p>
            <ul className="text-xs text-base-content/70 space-y-1">
              {drink.ingredients.slice(0, 3).map((ingredient) => (
                <li key={ingredient}>• {ingredient}</li>
              ))}
              {drink.ingredients.length > 3 && (
                <li className="text-primary/80 italic">+ {drink.ingredients.length - 3} more</li>
              )}
            </ul>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className={`badge badge-sm ${difficultyColors[drink.difficulty]}`}>
              {drink.difficulty}
            </span>
            <span className="text-xs text-primary/60 font-serif italic">Recipe #{drink.id}</span>
          </div>
        </div>
      </div>
  )
}

