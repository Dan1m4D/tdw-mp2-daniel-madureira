import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Compass } from 'lucide-react'

// Fix marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const startIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const endIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export interface MapViewProps {
  startLocation?: { lat: number; lng: number; name?: string }
  endLocation?: { lat: number; lng: number; name?: string }
  stopPoints?: { lat: number; lng: number; name?: string }[]
  route?: [number, number][]
}

export function MapView({ startLocation, endLocation, stopPoints = [], route = [] }: MapViewProps) {
  const mapCenter: [number, number] = startLocation
    ? [startLocation.lat, startLocation.lng]
    : [51.505, -0.09]

  if (!startLocation && !endLocation) {
    return (
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
    )
  }

  return (
    <div className="card bg-base-200 border border-base-300 shadow-lg overflow-hidden">
      <MapContainer center={mapCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Route line */}
        {route.length > 0 && <Polyline positions={route} color="blue" weight={3} opacity={0.7} />}

        {/* Start location */}
        {startLocation && (
          <Marker position={[startLocation.lat, startLocation.lng]} icon={startIcon}>
            <Popup>
              <div>
                <strong>Start</strong>
                <p>{startLocation.name || 'Starting point'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* End location */}
        {endLocation && (
          <Marker position={[endLocation.lat, endLocation.lng]} icon={endIcon}>
            <Popup>
              <div>
                <strong>End</strong>
                <p>{endLocation.name || 'Destination'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Stop points */}
        {stopPoints.map((stop, index) => (
          <Marker key={index} position={[stop.lat, stop.lng]} icon={defaultIcon}>
            <Popup>
              <div>
                <strong>Stop {index + 1}</strong>
                <p>{stop.name || `Stop point ${index + 1}`}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
