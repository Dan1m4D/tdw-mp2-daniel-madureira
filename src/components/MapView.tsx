import { Compass } from 'lucide-react'

export function MapView() {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-lg overflow-hidden">
      <div className="h-96 bg-linear-to-br from-primary/20 to-primary/5 flex flex-col items-center justify-center gap-4">
        <Compass size={48} className="text-primary/50" />
        <div className="text-center">
          <p className="text-base-content/60">Map visualization will appear here</p>
          <p className="text-sm text-base-content/40 mt-1">Select a location to start your adventure</p>
        </div>
      </div>
    </div>
  )
}
