import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, Loader, Globe } from 'lucide-react'
import { geocodeLocation, type Coordinate } from '../services/routingAPI'

interface LocationSelectorProps {
  onSelect: (location: Coordinate) => void
  placeholder?: string
  label?: string
  debounceDelay?: number
  resultsMode?: 'absolute' | 'relative'
}

export function LocationSelector({
  onSelect,
  placeholder = 'Search for a location...',
  label = 'Location',
  debounceDelay = 500,
  resultsMode = 'absolute',
}: LocationSelectorProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Coordinate[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    // Set new timer for debounced search
    setLoading(true)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const locations = await geocodeLocation(query)
        setResults(locations)
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, debounceDelay)

    // Cleanup timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query, debounceDelay])

  const handleSelectLocation = (location: Coordinate) => {
    onSelect(location)
    setQuery(location.name || '')
    setShowResults(false)
    setResults([])
  }

  return (
    <div className="form-control w-full gap-2">
      <label className="label px-0">
        <span className="label-text font-bold text-base flex items-center gap-2">
          <MapPin size={20} className="text-primary" />
          {label}
        </span>
      </label>

      <div className="relative">
        <div className="join w-full">
          <input
            type="text"
            placeholder={placeholder}
            className="input input-bordered join-item w-full placeholder-base-content/40 focus:outline-primary"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query && setShowResults(true)}
          />
          <button className="btn btn-primary join-item" disabled={loading} aria-label="Search">
            {loading ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
          </button>
        </div>

        {/* Results dropdown */}
        {showResults && results.length > 0 && (
          <div
            className={`${
              resultsMode === 'absolute' ? 'absolute top-full left-0 right-0 mt-2' : 'relative mt-4'
            } z-50 bg-base-100 border-2 border-primary/20 rounded-xl shadow-2xl max-h-72 overflow-y-auto`}
          >
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full text-left px-4 py-4 hover:bg-primary/10 rounded-lg transition duration-200 mb-2 last:mb-0 border-2 border-transparent hover:border-primary/30"
                >
                  <div className="flex items-start gap-3">
                    <Globe size={18} className="text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-base-content leading-tight">
                        {result.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {result.country && (
                          <p className="text-xs text-primary font-semibold">📍 {result.country}</p>
                        )}
                        <p className="text-xs text-base-content/50">
                          {result.latitude.toFixed(4)}°, {result.longitude.toFixed(4)}°
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results state */}
        {showResults && query && results.length === 0 && !loading && (
          <div
            className={`${
              resultsMode === 'absolute' ? 'absolute top-full left-0 right-0 mt-2' : 'relative mt-4'
            } z-50 bg-base-100 border-2 border-warning/20 rounded-xl shadow-lg p-6 text-center`}
          >
            <MapPin size={32} className="mx-auto text-warning mb-2 opacity-50" />
            <p className="text-sm font-semibold text-base-content">No locations found</p>
            <p className="text-xs text-base-content/60 mt-1">
              Try a different search term or be more specific
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            className={`${
              resultsMode === 'absolute' ? 'absolute top-full left-0 right-0 mt-2' : 'relative mt-4'
            } z-50 bg-base-100 border-2 border-primary/20 rounded-xl shadow-lg p-6 text-center`}
          >
            <div className="flex items-center justify-center gap-2">
              <Loader size={20} className="animate-spin text-primary" />
              <p className="text-sm font-semibold text-base-content">Searching...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
