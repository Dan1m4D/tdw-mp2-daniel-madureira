import { LocationSelector } from './LocationSelector'
import type { Coordinate } from '../../services/routingAPI'

interface LocationSelectionModalProps {
  isOpen: boolean
  selectingFor: 'start' | 'end' | null
  onClose: () => void
  onSelect: (location: Coordinate) => void
}

export function LocationSelectionModal({
  isOpen,
  selectingFor,
  onClose,
  onSelect,
}: LocationSelectionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-200/50">
          <h3 className="text-xl font-bold font-serif">
            Select {selectingFor === 'start' ? 'Start' : 'End'} Location
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto min-h-[300px]">
          <LocationSelector
            onSelect={onSelect}
            label={selectingFor === 'start' ? 'Start Location' : 'End Location'}
            resultsMode="relative"
          />
        </div>

        <div className="p-4 border-t border-base-200 bg-base-100">
          <button onClick={onClose} className="btn btn-ghost w-full">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
