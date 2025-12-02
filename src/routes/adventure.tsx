import { createFileRoute, Link } from '@tanstack/react-router'
import { Play, Wine } from 'lucide-react'
import { MapView, LocationDetails, NPCInformation } from '../components'

export const Route = createFileRoute('/adventure')({
  component: Adventure,
})

function Adventure() {
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
            Idle
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map & Location (Main Content) */}
          <div className="lg:col-span-3 space-y-6">
            <MapView />
            <LocationDetails />
          </div>

          {/* Sidebar: Actions & NPC */}
          <div className="space-y-6">
            {/* Start Adventure */}
            <div className="card bg-base-200 border border-base-300 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-lg">Ready?</h2>
                <button className="btn btn-primary w-full gap-2 mt-4">
                  <Play size={20} />  
                  Start New Run
                </button>
                <p className="text-xs text-base-content/50 mt-3">Begin a new adventure journey</p>
              </div>
            </div>

            {/* NPC Information */}
            <NPCInformation />

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
      </div>
    </div>
  )
}
