import { createFileRoute } from '@tanstack/react-router'
import { Play, Compass, Users, Wine } from 'lucide-react'

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
            {/* Map */}
            <div className="card bg-base-200 border border-base-300 shadow-lg overflow-hidden">
              <div className="h-96 bg-linear-to-br from-primary/20 to-primary/5 flex flex-col items-center justify-center gap-4">
                <Compass size={48} className="text-primary/50" />
                <div className="text-center">
                  <p className="text-base-content/60">Map visualization will appear here</p>
                  <p className="text-sm text-base-content/40 mt-1">
                    Select a location to start your adventure
                  </p>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="card bg-base-200 border border-base-300 shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <Compass size={24} className="text-primary" />
                  Current Location
                </h2>
                <div className="divider my-2" />
                <p className="text-base-content/70">
                  Start a new run to select a location and begin exploring
                </p>
                <div className="pt-4 space-y-2 text-sm text-base-content/60">
                  <p>• No weather data available</p>
                  <p>• No location selected</p>
                  <p>• Awaiting adventure start</p>
                </div>
              </div>
            </div>
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
            <div className="card bg-base-200 border border-base-300 shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <Users size={20} className="text-accent" />
                  Customer
                </h2>
                <div className="divider my-2" />
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="placeholder avatar mb-4">
                    <div className="bg-primary text-primary-content rounded-full w-16">
                      <span className="text-2xl">?</span>
                    </div>
                  </div>
                  <p className="text-base-content/60 italic">Waiting for a customer...</p>
                </div>
              </div>
            </div>

            {/* Drink Crafting */}
            <div className="card bg-base-200 border border-base-300 shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2">
                  <Wine size={20} className="text-orange-500" />
                  Craft
                </h2>
                <div className="divider my-2" />
                <p className="text-sm text-base-content/70 mb-4">
                  Select ingredients to craft the perfect drink
                </p>
                <button className="btn btn-outline btn-sm w-full" disabled>
                  No ingredients available
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
