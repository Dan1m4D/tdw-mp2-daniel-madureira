import { createFileRoute, Link } from '@tanstack/react-router'
import { Play, Wine, MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  MapView,
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
        numStops: 5,
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
    <div className="min-h-[calc(100vh-120px)] py-4 md:py-8 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 font-serif text-primary">
              Adventure Mode
            </h1>
            <p className="text-base-content/70 text-sm md:text-base">
              Your journey through time and flavor
            </p>
          </div>
          <div className="badge badge-lg badge-primary gap-2 p-4 shadow-md w-full md:w-auto justify-center">
            <span className="loading loading-spinner loading-sm"></span>
            <span className="font-semibold uppercase tracking-wider text-sm">
              {adventure.status === 'idle' ? 'Ready to Start' : adventure.status}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {(calculateRouteAction.error || initializeDeckAction.error) && (
          <div className="alert alert-error mb-6 md:mb-8 shadow-lg">
            <AlertCircle size={20} />
            <span>
              {calculateRouteAction.error?.message ||
                initializeDeckAction.error?.message ||
                'An error occurred'}
            </span>
          </div>
        )}

        {/* Map Section - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Map Area */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-base-300 bg-base-200 h-[300px] md:h-[400px] relative group order-2 lg:order-1">
            <div className="absolute inset-0 z-0">
              <MapView
                startLocation={mapData?.startLocation}
                endLocation={mapData?.endLocation}
                stopPoints={mapData?.stopPoints}
                route={mapData?.route}
                currentStopIndex={adventure.currentStopIndex}
              />
            </div>
            <div className="absolute inset-0 pointer-events-none border-4 border-base-content/5 rounded-2xl"></div>
          </div>

          {/* NPC Area (Top Right) */}
          <div className="lg:col-span-4 h-auto min-h-[300px] md:h-[400px] overflow-y-auto rounded-2xl shadow-xl border border-base-300 bg-base-200 order-1 lg:order-2">
            <NPCInformation />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Column 1: Journey & Logistics */}
          <div className="space-y-4 md:space-y-6">
            {/* Route Planning (Idle) */}
            {adventure.status === 'idle' && (
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
                          onClick={() => {
                            setSelectingFor('start')
                            setShowLocationModal(true)
                          }}
                          className="btn btn-xs btn-ghost w-full mt-2 text-primary"
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
                          onClick={() => {
                            setSelectingFor('end')
                            setShowLocationModal(true)
                          }}
                          className="btn btn-xs btn-ghost w-full mt-2 text-primary"
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
                        className="btn btn-outline border-dashed border-2 h-auto py-4 gap-2 hover:bg-base-100 hover:border-primary"
                      >
                        <MapPin size={20} />
                        Select Destination
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
                    className="btn btn-primary w-full gap-2 mt-6 shadow-lg hover:shadow-xl transition-all"
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

            {/* Route Details (Active) */}
            {adventure.routeData && (
              <div className="card bg-base-200 border border-base-300 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <h2 className="card-title flex items-center gap-2 text-primary">
                      <MapPin size={20} />
                      Route Details
                    </h2>
                    {adventure.status !== 'idle' && (
                      <button
                        onClick={() => dispatch(resetAdventure())}
                        className="btn btn-xs btn-ghost text-error"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="divider my-2" />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-base-100 p-2 rounded-lg">
                      <p className="text-xs text-base-content/60 uppercase tracking-wider">
                        Distance
                      </p>
                      <p className="font-bold text-primary">
                        {formatDistance(adventure.routeData.totalDistance)}
                      </p>
                    </div>
                    <div className="bg-base-100 p-2 rounded-lg">
                      <p className="text-xs text-base-content/60 uppercase tracking-wider">
                        Duration
                      </p>
                      <p className="font-bold text-primary">
                        {formatDuration(adventure.routeData.totalDuration)}
                      </p>
                    </div>
                    <div className="bg-base-100 p-2 rounded-lg">
                      <p className="text-xs text-base-content/60 uppercase tracking-wider">Stops</p>
                      <p className="font-bold text-primary">
                        {adventure.routeData.stopPoints.length}
                      </p>
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
                                isCurrent
                                  ? 'badge-primary'
                                  : isCompleted
                                    ? 'badge-success'
                                    : 'badge-ghost'
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
            )}
          </div>

          {/* Column 2: The Encounter (NPC) */}
          <div className="space-y-6">
            {/* NPC Serving Panel moved here if needed, or keep in col 2 */}
            {adventure.status !== 'idle' && <NPCServingPanel />}

            {/* If idle, show placeholder or tips */}
            {adventure.status === 'idle' && (
              <div className="card bg-base-200 border border-base-300 border-dashed h-full">
                <div className="card-body items-center text-center opacity-50 justify-center">
                  <CheckCircle size={48} className="mb-2" />
                  <h3 className="font-bold">No Active Customer</h3>
                  <p className="text-sm">Start your adventure to meet NPCs.</p>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Resources & Actions */}
          <div className="space-y-6">
            {adventure.status !== 'idle' && (
              <>
                <InventoryDisplay />
                {adventure.deckId && <CardDraw />}

                {/* Drink Crafting CTA */}
                <div className="card bg-linear-to-br from-primary to-secondary text-primary-content shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title flex items-center gap-2">
                      <Wine size={24} />
                      Ready to Mix?
                    </h2>
                    <p className="opacity-90 text-sm">
                      Use your ingredients to craft the perfect drink for the current NPC.
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <Link
                        to="/drinks"
                        className="btn btn-white text-primary hover:bg-base-100 border-none w-full"
                      >
                        Open Bar Menu
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Placeholder for idle state in column 3 */}
            {adventure.status === 'idle' && (
              <div className="card bg-base-200 border border-base-300 border-dashed">
                <div className="card-body items-center text-center opacity-50">
                  <Wine size={48} className="mb-2" />
                  <h3 className="font-bold">Bar Closed</h3>
                  <p className="text-sm">
                    Start your adventure to open the bar and manage inventory.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Selector Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-200/50">
                <h3 className="text-xl font-bold font-serif">
                  Select {selectingFor === 'start' ? 'Start' : 'End'} Location
                </h3>
                <button
                  onClick={() => {
                    setShowLocationModal(false)
                    setSelectingFor(null)
                  }}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto min-h-[300px]">
                <LocationSelector
                  onSelect={handleLocationSelect}
                  label={selectingFor === 'start' ? 'Start Location' : 'End Location'}
                  resultsMode="relative"
                />
              </div>

              <div className="p-4 border-t border-base-200 bg-base-100">
                <button
                  onClick={() => {
                    setShowLocationModal(false)
                    setSelectingFor(null)
                  }}
                  className="btn btn-ghost w-full"
                >
                  Cancel
                </button>
              </div>
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
