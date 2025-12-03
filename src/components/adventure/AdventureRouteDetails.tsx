import { MapPin, CheckCircle } from 'lucide-react'
import type { AdventureState } from '../../features/adventure/adventureSlice'

interface AdventureRouteDetailsProps {
  adventure: AdventureState
  onReset: () => void
}

export function AdventureRouteDetails({ adventure, onReset }: AdventureRouteDetailsProps) {
  if (!adventure.routeData) return null

  const formatDistance = (meters: number) => {
    if (meters > 1000) {
      return `${(meters / 1000).toFixed(1)} km`
    }
    return `${Math.round(meters)} m`
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="card bg-base-200 border border-base-300 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title flex items-center gap-2 text-primary">
            <MapPin size={20} />
            Route Details
          </h2>
          {adventure.status !== 'idle' && (
            <button onClick={onReset} className="btn btn-xs btn-ghost text-error">
              Reset
            </button>
          )}
        </div>
        <div className="divider my-2" />
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-base-100 p-2 rounded-lg">
            <p className="text-xs text-base-content/60 uppercase tracking-wider">Distance</p>
            <p className="font-bold text-primary">
              {formatDistance(adventure.routeData.totalDistance)}
            </p>
          </div>
          <div className="bg-base-100 p-2 rounded-lg">
            <p className="text-xs text-base-content/60 uppercase tracking-wider">Duration</p>
            <p className="font-bold text-primary">
              {formatDuration(adventure.routeData.totalDuration)}
            </p>
          </div>
          <div className="bg-base-100 p-2 rounded-lg">
            <p className="text-xs text-base-content/60 uppercase tracking-wider">Stops</p>
            <p className="font-bold text-primary">{adventure.routeData.stopPoints.length}</p>
          </div>
        </div>

        {/* Stop Points List */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-base-content/70">
            Itinerary
          </h3>
          <div className="space-y-3">
            {adventure.routeData.stopPoints.map((stop, index) => {
              const isCompleted = index < adventure.currentStopIndex
              const isCurrent = index === adventure.currentStopIndex
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-primary/10 border-primary shadow-md scale-105'
                      : isCompleted
                        ? 'bg-base-100 border-success/30 opacity-70'
                        : 'bg-base-100 border-base-200'
                  }`}
                >
                  <div
                    className={`badge ${
                      isCurrent ? 'badge-primary' : isCompleted ? 'badge-success' : 'badge-ghost'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm truncate ${isCompleted ? 'line-through text-base-content/50' : ''}`}
                    >
                      {stop.name}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary font-bold animate-pulse">
                        Current Location
                      </p>
                    )}
                  </div>
                  {isCompleted && <CheckCircle size={16} className="text-success" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
