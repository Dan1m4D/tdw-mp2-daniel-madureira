import { Backpack } from 'lucide-react'
import { useAppSelector } from '../app/hooks'
import type { RootState } from '../app/store'

export function InventoryDisplay() {
  const inventory = useAppSelector((state: RootState) => state.game.inventory)

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2">
          <Backpack size={20} className="text-primary" />
          Inventory ({inventory.length})
        </h3>
        <div className="divider my-2" />

        {inventory.length === 0 ? (
          <p className="text-base-content/60 italic text-sm">Your inventory is empty...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {inventory.map((ingredient, idx) => (
              <div key={`${ingredient}-${idx}`} className="badge badge-primary badge-outline">
                {ingredient}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-base-content/60">
          <p>💡 Tip: Draw cards to add ingredients or craft drinks for NPCs</p>
        </div>
      </div>
    </div>
  )
}
