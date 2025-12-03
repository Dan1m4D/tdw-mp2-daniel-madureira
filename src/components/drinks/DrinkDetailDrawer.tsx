import { X, Check, Zap } from 'lucide-react'
import { useAppDispatch } from '../../app/hooks'
import { removeIngredient } from '../../features/game/gameSlice'
import { completeNPC } from '../../features/adventure/adventureSlice'
import { completeCrafting } from '../../features/crafting/craftingSlice'
import type { Drink } from '../../services/cocktailAPI'

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

export function DrinkDetailDrawer({
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
