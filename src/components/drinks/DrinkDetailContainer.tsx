import { useCocktailByIdAction } from '../../actions/useCocktails'
import { DrinkDetailDrawer } from './DrinkDetailDrawer'

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

export function DrinkDetailContainer(props: DrinkDetailContainerProps) {
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
