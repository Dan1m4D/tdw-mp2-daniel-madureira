import { Sparkles, Wine, RotateCcw } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { resetAdventure } from '../../features/adventure/adventureSlice'
import { resetCrafting } from '../../features/crafting/craftingSlice'
import { clearCurrentNPC } from '../../features/npc/npcSlice'
import { startGame } from '../../features/game/gameSlice'
import type { RootState } from '../../app/store'

export function AdventureSummary() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const adventure = useAppSelector((state: RootState) => state.adventure)
  const completedNPCs = adventure.completedNPCs

  const handleNewAdventure = () => {
    dispatch(resetAdventure())
    dispatch(resetCrafting())
    dispatch(clearCurrentNPC())
    dispatch(startGame())
    navigate({ to: '/adventure' })
  }

  const handleBackToHome = () => {
    dispatch(resetAdventure())
    dispatch(resetCrafting())
    dispatch(clearCurrentNPC())
    navigate({ to: '/' })
  }

  if (completedNPCs.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Confetti-like celebration */}
        <div className="text-center py-8 bg-linear-to-r from-primary/10 to-accent/10">
          <Sparkles size={48} className="mx-auto mb-3 text-primary animate-bounce" />
          <h1 className="text-4xl font-bold text-primary mb-2">Adventure Complete!</h1>
          <p className="text-base-content/70">You've served {completedNPCs.length} customers!</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card bg-success/10 border border-success/30">
              <div className="card-body items-center text-center p-4">
                <p className="text-3xl font-bold text-success">{completedNPCs.length}</p>
                <p className="text-xs text-base-content/60">NPCs Served</p>
              </div>
            </div>
            <div className="card bg-accent/10 border border-accent/30">
              <div className="card-body items-center text-center p-4">
                <p className="text-3xl font-bold text-accent">
                  {new Set(completedNPCs.map(c => c.drinkCrafted)).size}
                </p>
                <p className="text-xs text-base-content/60">Unique Drinks</p>
              </div>
            </div>
            <div className="card bg-primary/10 border border-primary/30">
              <div className="card-body items-center text-center p-4">
                <p className="text-3xl font-bold text-primary">
                  {new Set(completedNPCs.map(c => c.npcName)).size}
                </p>
                <p className="text-xs text-base-content/60">Characters Met</p>
              </div>
            </div>
          </div>

          {/* Completed NPCs List */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Wine size={20} />
              Your Journey
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {completedNPCs.map((record, idx) => (
                <div key={idx} className="card bg-base-200 border border-base-300">
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="badge badge-primary">{record.stopIndex}</span>
                          <h4 className="font-semibold">{record.npcName}</h4>
                        </div>
                        <div className="text-sm text-base-content/70 mb-2">
                          <p className="font-medium text-primary">{record.drinkCrafted}</p>
                          <p className="text-xs">Made with: {record.ingredientsUsed.join(', ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-base-content/60">
                          {new Date(record.craftedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-base-300">
            <button onClick={handleNewAdventure} className="btn btn-primary flex-1 gap-2">
              <RotateCcw size={18} />
              New Adventure
            </button>
            <button onClick={handleBackToHome} className="btn btn-outline flex-1">
              Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
