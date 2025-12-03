import { CheckCircle } from 'lucide-react'
import { useEffect } from 'react'

interface NPCSuccessModalProps {
  isOpen: boolean
  npcName: string
  drinkName: string
  currentStop: number
  totalStops: number
  onAdvance: () => void
}

export function NPCSuccessModal({
  isOpen,
  npcName,
  drinkName,
  currentStop,
  totalStops,
  onAdvance,
}: NPCSuccessModalProps) {
  // Auto-close and advance after 3 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onAdvance()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onAdvance])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-success text-success-content p-8 text-center">
          <CheckCircle size={64} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">🎉 Success!</h2>
          <p className="text-lg opacity-90">You've satisfied {npcName}!</p>
        </div>

        <div className="p-8 space-y-4">
          <div>
            <p className="text-sm text-base-content/60 mb-1">Drink Crafted</p>
            <p className="text-xl font-bold text-primary">{drinkName}</p>
          </div>

          <div className="divider my-4" />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/60">Progress</p>
              <p className="text-2xl font-bold text-primary">
                {currentStop}/{totalStops}
              </p>
            </div>
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-base-content/60">
                  {currentStop === totalStops ? 'Status' : 'Next stop'}
                </p>
                <p className="text-lg font-bold text-primary">
                  {currentStop === totalStops ? 'Done' : currentStop + 1}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-xs text-base-content/50 text-center">
              {currentStop === totalStops
                ? 'Completing adventure in 3 seconds...'
                : 'Advancing to next location in 3 seconds...'}
            </p>
          </div>

          <button onClick={onAdvance} className="btn btn-success w-full">
            {currentStop === totalStops ? 'Finish Adventure' : 'Continue to Next Stop'}
          </button>
        </div>
      </div>
    </div>
  )
}
