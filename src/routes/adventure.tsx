import { createFileRoute, Link } from '@tanstack/react-router'
import { Wine, AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  MapView,
  NPCInformation,
  CardDraw,
  InventoryDisplay,
  NPCServingPanel,
  AdventureSummary,
} from '../components'
import { AdventureSetup } from '../components/adventure/AdventureSetup'
import { AdventureRouteDetails } from '../components/adventure/AdventureRouteDetails'
import { LocationSelectionModal } from '../components/adventure/LocationSelectionModal'
import {
  setStartLocation,
  setEndLocation,
  setRouteData,
  setDeckId,
  resetAdventure,
  type AdventureState,
} from '../features/adventure/adventureSlice'
import {
  useCalculateRouteAction,
  useInitializeDeckAction,
  useGetWeatherAction,
} from '../actions/useAdventureQueries'
import { type AppDispatch, type RootState } from '../app/store'
import { type Coordinate } from '../services/routingAPI'
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
  const getWeatherAction = useGetWeatherAction()

  const handleLocationSelect = async (location: Coordinate) => {
    if (selectingFor === 'start') {
      dispatch(setStartLocation(location))
      // Fetch weather and generate NPC for start location
      try {
        const weather = await getWeatherAction.mutateAsync({
          lat: location.latitude,
          lng: location.longitude,
        })
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
        {(calculateRouteAction.error || initializeDeckAction.error || getWeatherAction.error) && (
          <div className="alert alert-error mb-6 md:mb-8 shadow-lg">
            <AlertCircle size={20} />
            <span>
              {calculateRouteAction.error?.message ||
                initializeDeckAction.error?.message ||
                getWeatherAction.error?.message ||
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
              <AdventureSetup
                adventure={adventure}
                onSelectStart={() => {
                  setSelectingFor('start')
                  setShowLocationModal(true)
                }}
                onSelectEnd={() => {
                  setSelectingFor('end')
                  setShowLocationModal(true)
                }}
                onStartAdventure={handleStartAdventure}
                isPending={calculateRouteAction.isPending || initializeDeckAction.isPending}
              />
            )}

            {/* Route Details (Active) */}
            {adventure.routeData && (
              <AdventureRouteDetails
                adventure={adventure}
                onReset={() => dispatch(resetAdventure())}
              />
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
        <LocationSelectionModal
          isOpen={showLocationModal}
          selectingFor={selectingFor}
          onClose={() => {
            setShowLocationModal(false)
            setSelectingFor(null)
          }}
          onSelect={handleLocationSelect}
        />

        {/* Adventure Summary Modal */}
        {adventure.completedNPCs.length === adventure.routeData?.stopPoints.length && (
          <AdventureSummary />
        )}
      </div>
    </div>
  )
}
