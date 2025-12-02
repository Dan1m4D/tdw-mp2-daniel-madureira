import axios from 'axios'

// OSRM (Open Source Routing Machine) API
const OSRM_API = 'https://router.project-osrm.org'

export interface Coordinate {
  latitude: number
  longitude: number
  name?: string
  country?: string
}

export interface RouteSegment {
  coordinates: [number, number][]
  distance: number // in meters
  duration: number // in seconds
}

export interface RouteResponse {
  route: [number, number][]
  distance: number // in meters
  duration: number // in seconds
  waypoints: Coordinate[]
}

export interface NominatimResult {
  lat: string
  lon: string
  name: string
  address?: {
    city?: string
    country?: string
  }
}

/**
 * Geocode a location name to coordinates using Nominatim (OSM)
 */
export async function geocodeLocation(query: string): Promise<Coordinate[]> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5,
      },
      headers: {
        'User-Agent': 'TDW-Adventure-App',
      },
    })

    return response.data.map((result: NominatimResult) => ({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      name: result.name,
      country: result.address?.country,
    }))
  } catch (error) {
    console.error('Geocoding error:', error)
    throw new Error('Failed to geocode location')
  }
}

/**
 * Get reverse geocoding - convert coordinates to location name
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
      },
      headers: {
        'User-Agent': 'TDW-Adventure-App',
      },
    })

    return response.data.address?.town || response.data.address?.city || response.data.name
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  }
}

/**
 * Calculate route between two points using OSRM
 */
export async function getRoute(start: Coordinate, end: Coordinate): Promise<RouteResponse> {
  try {
    const coordinatesString = `${start.longitude},${start.latitude};${end.longitude},${end.latitude}`

    const response = await axios.get(`${OSRM_API}/route/v1/driving/${coordinatesString}`, {
      params: {
        overview: 'full',
        geometries: 'geojson',
        steps: false,
      },
    })

    if (response.data.code !== 'Ok') {
      throw new Error(`OSRM Error: ${response.data.code}`)
    }

    const route = response.data.routes[0]
    const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [
      coord[1],
      coord[0],
    ]) // Convert from [lon, lat] to [lat, lon]

    return {
      route: coordinates,
      distance: route.distance,
      duration: route.duration,
      waypoints: [start, end],
    }
  } catch (error) {
    console.error('Routing error:', error)
    throw new Error('Failed to calculate route')
  }
}

/**
 * Generate intermediate waypoints along a route
 * Divides the route into segments and returns evenly spaced points
 */
export function generateIntermediateWaypoints(
  route: [number, number][],
  numWaypoints: number = 3
): [number, number][] {
  if (route.length < 2) return []

  const waypoints: [number, number][] = []
  const step = Math.floor(route.length / (numWaypoints + 1))

  for (let i = 1; i <= numWaypoints; i++) {
    const index = Math.min(i * step, route.length - 1)
    waypoints.push(route[index])
  }

  return waypoints
}

/**
 * Get detailed route with intermediate waypoints
 */
export async function getRouteWithStops(
  start: Coordinate,
  end: Coordinate,
  numStops: number = 3
): Promise<{
  mainRoute: RouteResponse
  stopPoints: Coordinate[]
  totalDistance: number
  totalDuration: number
}> {
  // Get the main route
  const mainRoute = await getRoute(start, end)

  // Generate intermediate waypoints from the route
  const intermediateCoords = generateIntermediateWaypoints(mainRoute.route, numStops)

  // Convert coordinates back to Coordinate format with names
  const stopPoints: Coordinate[] = []
  for (const coord of intermediateCoords) {
    const name = await reverseGeocode(coord[0], coord[1])
    stopPoints.push({
      latitude: coord[0],
      longitude: coord[1],
      name,
    })
  }

  return {
    mainRoute,
    stopPoints,
    totalDistance: mainRoute.distance,
    totalDuration: mainRoute.duration,
  }
}
