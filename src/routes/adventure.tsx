import { createFileRoute, Link } from '@tanstack/react-router'
import { Play, Wine, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  MapView,
  LocationDetails,
  NPCInformation,
  LocationSelector,
  CardDraw,
  InventoryDisplay,
  NPCServingPanel,
  AdventureSummary,
} from '../components'
import {
  setStartLocation,
  setEndLocation,
  setRouteData,
  setDeckId,
  resetAdventure,
  type AdventureState,
} from '../features/adventure/adventureSlice'
import { useCalculateRouteAction, useInitializeDeckAction } from '../actions/useAdventureQueries'
import { type AppDispatch, type RootState } from '../app/store'
import { type Coordinate } from '../services/routingAPI'
import { getWeather } from '../services/weatherAPI'
import { generateNPC, generateNewNPCFromWeather } from '../features/npc/npcSlice'

export const Route = createFileRoute('/adventure')({
  component: Adventure,
})

function Adventure() {
  const dispatch = useDispatch<AppDispatch>()
  const adventure = useSelector((state: RootState) => state.adventure) as AdventureState
  const inventory = useSelector((state: RootState) => state.game.inventory)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [selectingFor, setSelectingFor] = useState<'start' | 'end' | null>(null)

  // Adventure actions
  const calculateRouteAction = useCalculateRouteAction()
  const initializeDeckAction = useInitializeDeckAction()

  const handleLocationSelect = async (location: Coordinate) => {
    if (selectingFor === 'start') {
      dispatch(setStartLocation(location))
      // Fetch weather and generate NPC for start location
      try {
        const weather = await getWeather(location.latitude, location.longitude)
        const npc = generateNPC(weather, location.name || 'Unknown Location', inventory)
        dispatch(generateNewNPCFromWeather(npc))
      } catch (error) {
        console.error('Failed to fetch weather:', error)
      }
    } else if (selectingFor === 'end') {
      dispatch(setEndLocation(location))
    }
    setShowLocationModal(false)
    setSelectingFor(null)
  }

  const handleStartAdventure = async () => {
    if (!adventure.startLocation || !adventure.endLocation) {
      return
    }

    try {
      const routeData = await calculateRouteAction.mutateAsync({
        start: adventure.startLocation,
        end: adventure.endLocation,
        numStops: 3,
      })
      dispatch(setRouteData(routeData))

      // Initialize deck for card drawing
      const deckId = await initializeDeckAction.mutateAsync()
      dispatch(setDeckId(deckId))
    } catch (error) {
      console.error('Failed to start adventure:', error)
    }
  }

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

  const mapData = adventure.routeData
    ? {
        startLocation:
          adventure.startLocation &&
          adventure.startLocation.latitude !== undefined &&
          adventure.startLocation.longitude !== undefined
            ? {
                lat: adventure.startLocation.latitude,
                lng: adventure.startLocation.longitude,
                name: adventure.startLocation.name,
              }
            : undefined,
        endLocation:
          adventure.endLocation &&
          adventure.endLocation.latitude !== undefined &&
          adventure.endLocation.longitude !== undefined
            ? {
                lat: adventure.endLocation.latitude,
                lng: adventure.endLocation.longitude,
                name: adventure.endLocation.name,
              }
            : undefined,
        stopPoints: adventure.routeData.stopPoints.map(stop => ({
          lat: stop.latitude,
          lng: stop.longitude,
          name: stop.name,
        })),
        route: adventure.routeData.mainRoute.route as [number, number][],
      }
    : null

  return (
    <div className="min-h-[calc(100vh-120px)] py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Adventure Mode</h1>
            <p className="text-base-content/70">Your journey through time and flavor</p>
          </div>
          <div className="badge badge-lg badge-primary gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            {adventure.status === 'idle' ? 'Ready' : adventure.status}
          </div>
        </div>

        {/* Error Alert */}
        {(calculateRouteAction.error || initializeDeckAction.error) && (
          <div className="alert alert-error mb-6">
            <AlertCircle size={20} />
            <span>
              {calculateRouteAction.error?.message ||
                initializeDeckAction.error?.message ||
                'An error occurred'}
            </span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map & Location (Main Content) */}
          <div className="lg:col-span-3 space-y-6">
            <MapView
              startLocation={mapData?.startLocation}
              endLocation={mapData?.endLocation}
              stopPoints={mapData?.stopPoints}
              route={mapData?.route}
            />

            {/* Route Details */}
            {adventure.routeData && (
              <div className="card bg-base-200 border border-base-300 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title flex items-center gap-2">
                    <MapPin size={20} className="text-primary" />
                    Route Details
                  </h2>
                  <div className="divider my-2" />
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-base-content/60">Distance</p>
                      <p className="text-lg font-semibold">
                        {formatDistance(adventure.routeData.totalDistance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">Duration</p>
                      <p className="text-lg font-semibold">
                        {formatDuration(adventure.routeData.totalDuration)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">Stops</p>
                      <p className="text-lg font-semibold">
                        {adventure.routeData.stopPoints.length}
                      </p>
                    </div>
                  </div>

                  {/* Stop Points List */}
                  <div className="mt-4">
                    <h3 className="font-semibold mb-3">Suggested Stops</h3>
                    <div className="space-y-2">
                      {adventure.routeData.stopPoints.map((stop, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 bg-base-100 rounded-lg"
                        >
                          <div className="badge badge-primary">{index + 1}</div>
                          <div>
                            <p className="font-semibold text-sm">{stop.name}</p>
                            <p className="text-xs text-base-content/60">
                              {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <LocationDetails />
          </div>

          {/* Sidebar: Actions & NPC */}
          <div className="space-y-6">
            {/* Location Selection */}
            {adventure.status === 'idle' && (
              <div className="card bg-base-200 border border-base-300 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title text-lg">Plan Your Route</h2>
                  <div className="divider my-2" />

                  {/* Start Location */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Start Location</span>
                    </label>
                    {adventure.startLocation ? (
                      <div className="p-3 bg-base-100 rounded-lg border border-success">
                        <p className="font-semibold text-sm">{adventure.startLocation.name}</p>
                        <p className="text-xs text-base-content/60">
                          {adventure.startLocation.latitude.toFixed(4)},{' '}
                          {adventure.startLocation.longitude.toFixed(4)}
                        </p>
                        <button
                          onClick={() => {
                            setSelectingFor('start')
                            setShowLocationModal(true)
                          }}
                          className="btn btn-xs btn-ghost w-full mt-2"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectingFor('start')
                          setShowLocationModal(true)
                        }}
                        className="btn btn-sm btn-outline gap-2"
                      >
                        <MapPin size={16} />
                        Select Start
                      </button>
                    )}
                  </div>

                  {/* End Location */}
                  <div className="form-control w-full mt-4">
                    <label className="label">
                      <span className="label-text font-semibold">End Location</span>
                    </label>
                    {adventure.endLocation ? (
                      <div className="p-3 bg-base-100 rounded-lg border border-error">
                        <p className="font-semibold text-sm">{adventure.endLocation.name}</p>
                        <p className="text-xs text-base-content/60">
                          {adventure.endLocation.latitude.toFixed(4)},{' '}
                          {adventure.endLocation.longitude.toFixed(4)}
                        </p>
                        <button
                          onClick={() => {
                            setSelectingFor('end')
                            setShowLocationModal(true)
                          }}
                          className="btn btn-xs btn-ghost w-full mt-2"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectingFor('end')
                          setShowLocationModal(true)
                        }}
                        className="btn btn-sm btn-outline gap-2"
                      >
                        <MapPin size={16} />
                        Select End
                      </button>
                    )}
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={handleStartAdventure}
                    disabled={
                      !adventure.startLocation ||
                      !adventure.endLocation ||
                      calculateRouteAction.isPending ||
                      initializeDeckAction.isPending
                    }
                    className="btn btn-primary w-full gap-2 mt-4"
                  >
                    {calculateRouteAction.isPending || initializeDeckAction.isPending ? (
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
            )}

            {/* Route Planned */}
            {adventure.status !== 'idle' && adventure.routeData && (
              <div className="card bg-base-200 border-2 border-success shadow-lg">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={24} className="text-success" />
                    <h2 className="card-title text-lg">Route Ready!</h2>
                  </div>
                  <button
                    onClick={() => dispatch(resetAdventure())}
                    className="btn btn-outline w-full"
                  >
                    Plan New Route
                  </button>
                </div>
              </div>
            )}

            {/* NPC Information */}
            <NPCInformation />

            {/* NPC Serving Panel */}
            {adventure.status !== 'idle' && <NPCServingPanel />}

            {/* Inventory Display */}
            {adventure.status !== 'idle' && <InventoryDisplay />}

            {/* Card Draw */}
            {adventure.status !== 'idle' && adventure.deckId && <CardDraw />}

            {/* Drink Crafting */}
            <div className="card bg-base-200 border border-base-300 shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <Wine size={20} className="text-orange-500" />
                  Craft
                </h2>
                <div className="divider my-2" />
                <p className="text-sm text-base-content/70 mb-4">
                  Explore our cocktail collection and craft drinks
                </p>
                <Link to="/drinks" className="btn btn-primary btn-sm w-full">
                  View Cocktails
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Location Selector Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full max-h-96 p-6">
              <h3 className="text-xl font-bold mb-4">
                Select {selectingFor === 'start' ? 'Start' : 'End'} Location
              </h3>
              <LocationSelector
                onSelect={handleLocationSelect}
                label={selectingFor === 'start' ? 'Start Location' : 'End Location'}
              />
              <button
                onClick={() => {
                  setShowLocationModal(false)
                  setSelectingFor(null)
                }}
                className="btn btn-ghost w-full mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Adventure Summary Modal */}
        {adventure.completedNPCs.length === adventure.routeData?.stopPoints.length && (
          <AdventureSummary />
        )}
      </div>
    </div>
  )
}
