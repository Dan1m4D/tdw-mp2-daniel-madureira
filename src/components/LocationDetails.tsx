import { Compass } from 'lucide-react'

export function LocationDetails() {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-lg">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2">
          <Compass size={24} className="text-primary" />
          Current Location
        </h2>
        <div className="divider my-2" />
        <p className="text-base-content/70">Start a new run to select a location and begin exploring</p>
        <div className="pt-4 space-y-2 text-sm text-base-content/60">
          <p>• No weather data available</p>
          <p>• No location selected</p>
          <p>• Awaiting adventure start</p>
        </div>
      </div>
    </div>
  )
}
