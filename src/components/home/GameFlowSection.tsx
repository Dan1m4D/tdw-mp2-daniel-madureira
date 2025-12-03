export function GameFlowSection() {
  return (
    <div className="w-full max-w-5xl px-4">
      <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {[
          { step: '1', label: 'Select Route', icon: '🗺️' },
          { step: '2', label: 'Draw Cards', icon: '🃏' },
          { step: '3', label: 'Meet NPC', icon: '👤' },
          { step: '4', label: 'Craft Drink', icon: '🍸' },
          { step: '5', label: 'Advance', icon: '➜' },
        ].map(({ step, label, icon }) => (
          <div key={step} className="card bg-base-200 border border-base-300">
            <div className="card-body items-center text-center p-4">
              <div className="text-4xl mb-2">{icon}</div>
              <p className="text-xs text-base-content/60">Step {step}</p>
              <p className="font-semibold text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
