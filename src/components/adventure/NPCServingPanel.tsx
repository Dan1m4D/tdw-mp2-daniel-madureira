import { Check, X, Wine } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { useNavigate } from '@tanstack/react-router'
import { startCraftingForNPC } from '../../features/crafting/craftingSlice'
import type { RootState } from '../../app/store'

export function NPCServingPanel() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const currentNPC = useAppSelector((state: RootState) => state.npc.currentNPC)
  const inventory = useAppSelector((state: RootState) => state.game.inventory)

  if (!currentNPC) {
    return (
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body text-center py-8">
          <p className="text-base-content/60 italic">No customer to serve yet...</p>
          <p className="text-xs text-base-content/50 mt-2">Draw a card to get ingredients</p>
        </div>
      </div>
    )
  }

  const hasAllIngredients = currentNPC.currentRequirements.every(req =>
    inventory.some((inv: string) => inv.toLowerCase() === req.toLowerCase())
  )

  const handleCraftDrink = () => {
    dispatch(
      startCraftingForNPC({
        npcId: currentNPC.id,
        npcName: currentNPC.name,
      })
    )
    navigate({ to: '/drinks' })
  }

  return (
    <div className="card bg-base-200 border-2 border-accent shadow-lg">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2">
          <Wine size={20} className="text-accent" />
          Serve Customer
        </h3>
        <div className="divider my-2" />

        {/* Current NPC Info */}
        <div className="bg-base-100 rounded p-3 mb-4">
          <h4 className="font-semibold text-accent">{currentNPC.name}</h4>
          <p className="text-sm text-base-content/70 mb-2">{currentNPC.description}</p>
          <div className="text-xs space-y-1">
            <p>
              <span className="font-semibold">Mood:</span> {currentNPC.mood} (
              {currentNPC.moodScore > 0 ? '+' : ''}
              {currentNPC.moodScore})
            </p>
            <p className="text-base-content/60 italic">{currentNPC.moodDescription}</p>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Wants:</h4>
          <div className="space-y-2">
            {currentNPC.currentRequirements.map(req => {
              const hasIng = inventory.some(
                (inv: string) => inv.toLowerCase() === req.toLowerCase()
              )
              return (
                <div
                  key={req}
                  className="flex items-center gap-2 text-sm p-2 bg-base-300/50 rounded"
                >
                  {hasIng ? (
                    <Check size={16} className="text-success" />
                  ) : (
                    <X size={16} className="text-error" />
                  )}
                  <span className={hasIng ? 'text-success' : 'text-error'}>{req}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status */}
        {hasAllIngredients ? (
          <div className="alert alert-success mt-4">
            <Check size={20} />
            <span>You have all the ingredients needed!</span>
          </div>
        ) : (
          <div className="alert alert-warning mt-4">
            <X size={20} />
            <span>You're missing some ingredients. Draw cards or craft a drink!</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button onClick={handleCraftDrink} className="btn btn-primary flex-1">
            <Wine size={18} />
            Go Craft Drink
          </button>
        </div>
      </div>
    </div>
  )
}
