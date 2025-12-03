import type { DrinkPreview } from '../../services/cocktailAPI'

interface DrinkCardProps {
  drink: DrinkPreview
  index: number
}

export function DrinkCard({ drink, index }: DrinkCardProps) {
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
