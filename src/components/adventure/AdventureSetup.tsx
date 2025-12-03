import { MapPin, Play } from 'lucide-react'
import type { AdventureState } from '../../features/adventure/adventureSlice'

interface AdventureSetupProps {
  adventure: AdventureState
  onSelectStart: () => void
  onSelectEnd: () => void
  onStartAdventure: () => void
  isPending: boolean
}

export function AdventureSetup({
  adventure,
  onSelectStart,
  onSelectEnd,
  onStartAdventure,
  isPending,
}: AdventureSetupProps) {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl flex items-center gap-2 text-primary">
          <MapPin size={24} />
          Plan Your Route
        </h2>
        <div className="divider my-2" />

        {/* Start Location */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Start Location</span>
          </label>
          {adventure.startLocation ? (
            <div className="p-4 bg-base-100 rounded-xl border-l-4 border-success shadow-sm">
              <p className="font-bold text-base">{adventure.startLocation.name}</p>
              <p className="text-xs text-base-content/60 font-mono mt-1">
                {adventure.startLocation.latitude.toFixed(4)},{' '}
                {adventure.startLocation.longitude.toFixed(4)}
              </p>
              <button
                onClick={onSelectStart}
                className="btn btn-xs btn-ghost w-full mt-2 text-primary"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={onSelectStart}
              className="btn btn-outline border-dashed border-2 h-auto py-4 gap-2 hover:bg-base-100 hover:border-primary"
            >
              <MapPin size={20} />
              Select Start Point
            </button>
          )}
        </div>

        {/* End Location */}
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text font-semibold">End Location</span>
          </label>
          {adventure.endLocation ? (
            <div className="p-4 bg-base-100 rounded-xl border-l-4 border-error shadow-sm">
              <p className="font-bold text-base">{adventure.endLocation.name}</p>
              <p className="text-xs text-base-content/60 font-mono mt-1">
                {adventure.endLocation.latitude.toFixed(4)},{' '}
                {adventure.endLocation.longitude.toFixed(4)}
              </p>
              <button
                onClick={onSelectEnd}
                className="btn btn-xs btn-ghost w-full mt-2 text-primary"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={onSelectEnd}
              className="btn btn-outline border-dashed border-2 h-auto py-4 gap-2 hover:bg-base-100 hover:border-primary"
            >
              <MapPin size={20} />
              Select Destination
            </button>
          )}
        </div>

        {/* Start Button */}
        <button
          onClick={onStartAdventure}
          disabled={!adventure.startLocation || !adventure.endLocation || isPending}
          className="btn btn-primary w-full gap-2 mt-6 shadow-lg hover:shadow-xl transition-all"
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Planning Route...
            </>
          ) : (
            <>
              <Play size={20} />
              Start Adventure
            </>
          )}
        </button>
      </div>
    </div>
  )
}
