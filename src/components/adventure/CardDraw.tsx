import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addDrawnCard } from '../../features/adventure/adventureSlice'
import { addIngredient } from '../../features/game/gameSlice'
import { useDrawCardAction } from '../../actions/useAdventureQueries'
import { RotateCcw } from 'lucide-react'

export function CardDraw() {
  const dispatch = useAppDispatch()
  const [showCard, setShowCard] = useState(false)
  const [lastCard, setLastCard] = useState<{
    image: string
    ingredient: string
    cardName: string
  } | null>(null)

  const deckId = useAppSelector(state => state.adventure.deckId)
  const currentStopIndex = useAppSelector(state => state.adventure.currentStopIndex)
  const stopPoints = useAppSelector(state => state.adventure.routeData?.stopPoints || [])

  const drawCardAction = useDrawCardAction()

  const handleDrawCard = async () => {
    if (!deckId) return

    try {
      const drawnCard = await drawCardAction.mutateAsync(deckId)
      setLastCard({
        image: drawnCard.card.images.png,
        ingredient: drawnCard.ingredient,
        cardName: `${drawnCard.card.value} of ${drawnCard.card.suit}`,
      })
      setShowCard(true)

      // Add ingredient to inventory
      dispatch(addIngredient(drawnCard.ingredient))
      dispatch(addDrawnCard(drawnCard))
    } catch (error) {
      console.error('Failed to draw card:', error)
    }
  }

  const handleDrawAnother = () => {
    setShowCard(false)
    setLastCard(null)
  }

  const isLastStop = currentStopIndex >= stopPoints.length

  if (isLastStop) {
    return null
  }

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h3 className="card-title text-lg font-bold">Draw a Card</h3>

        {showCard && lastCard ? (
          <div className="space-y-4">
            <div className="relative w-full max-w-xs mx-auto">
              <img
                src={lastCard.image}
                alt={lastCard.cardName}
                className="w-full rounded-lg shadow-md border-4 border-primary"
              />
            </div>

            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-600">{lastCard.cardName}</p>
              <p className="text-lg font-bold text-success">
                🍹 {lastCard.ingredient} added to inventory!
              </p>
            </div>

            <div className="divider my-2" />

            <button className="btn btn-outline w-full gap-2" onClick={handleDrawAnother}>
              <RotateCcw size={16} />
              Draw Another Card
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600">Need ingredients? Draw a card from the deck!</p>
            <button
              className="btn btn-primary w-full"
              onClick={handleDrawCard}
              disabled={drawCardAction.isPending || !deckId}
            >
              {drawCardAction.isPending && <span className="loading loading-spinner loading-sm" />}
              {!deckId ? 'Initializing deck...' : 'Draw Card'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
