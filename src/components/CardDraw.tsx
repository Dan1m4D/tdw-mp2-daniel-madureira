import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { advanceToNextStop, addDrawnCard } from '../features/adventure/adventureSlice'
import { addIngredient } from '../features/game/gameSlice'
import { useDrawCardAction } from '../actions/useAdventureQueries'

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

  const handleNextStop = () => {
    dispatch(advanceToNextStop())
    setShowCard(false)
    setLastCard(null)
  }

  const isLastStop = currentStopIndex >= stopPoints.length

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

            {!isLastStop ? (
              <button className="btn btn-primary w-full" onClick={handleNextStop}>
                Continue to Next Stop ({currentStopIndex + 1}/{stopPoints.length})
              </button>
            ) : (
              <div className="alert alert-success">
                <span>🎉 Adventure complete! You've visited all stops.</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Stop {currentStopIndex + 1} of {stopPoints.length}
            </p>
            <button
              className="btn btn-primary w-full"
              onClick={handleDrawCard}
              disabled={drawCardAction.isPending || !deckId || isLastStop}
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
