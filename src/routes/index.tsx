import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Wine, MapPin, Users, Sparkles, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center gap-16 py-12">
      {/* Hero Section */}
      <div className="space-y-8 max-w-4xl">
        <div className="flex items-center justify-center gap-2">
          <div className="h-1 w-12 bg-primary rounded-full" />
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">
            Adventure Awaits
          </span>
          <div className="h-1 w-12 bg-primary rounded-full" />
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-center leading-tight">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary">
            The Wandering Bartender
          </span>
        </h1>

        <p className="text-lg md:text-xl text-center text-base-content/80 leading-relaxed max-w-2xl mx-auto">
          Draw cards for ingredients. Navigate through 5 real-world stops. Craft legendary cocktails
          to satisfy NPCs shaped by the weather. Complete your journey and become a legend.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles size={18} className="text-primary" />
            <span className="text-base-content/70">Card-Driven Gameplay</span>
          </div>
          <div className="divider divider-horizontal mx-0 h-6" />
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={18} className="text-primary" />
            <span className="text-base-content/70">5 Real Locations</span>
          </div>
          <div className="divider divider-horizontal mx-0 h-6" />
          <div className="flex items-center gap-2 text-sm">
            <Users size={18} className="text-primary" />
            <span className="text-base-content/70">Weather NPCs</span>
          </div>
          <div className="divider divider-horizontal mx-0 h-6" />
          <div className="flex items-center gap-2 text-sm">
            <Wine size={18} className="text-primary" />
            <span className="text-base-content/70">2000+ Recipes</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        <FeatureCard
          icon={<Zap size={32} />}
          title="Draw Cards for Ingredients"
          description="Start with a 52-card deck. Each card represents a unique ingredient - from spirits and juices to herbs and syrups. Cards auto-reshuffle for infinite possibilities."
          color="primary"
        />
        <FeatureCard
          icon={<MapPin size={32} />}
          title="Navigate 5 Stops"
          description="Choose start and end points. The route generates 3 intermediate stops. Watch your progress on the map as you advance through each location."
          color="accent"
        />
        <FeatureCard
          icon={<Users size={32} />}
          title="Craft for NPCs"
          description="Each stop has an NPC influenced by real weather data. Craft cocktails that satisfy them using your drawn ingredients. Advance on success."
          color="secondary"
        />
      </div>

      {/* Game Flow Section */}
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

      {/* CTA Button */}
      <Link
        to="/adventure"
        className="btn btn-primary btn-lg gap-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
      >
        <Zap size={24} />
        Begin Your Journey
        <ArrowRight size={24} />
      </Link>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center pt-8">
        <div>
          <div className="text-3xl font-bold text-primary">5️⃣</div>
          <p className="text-sm text-base-content/60 mt-2">Stops</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">52</div>
          <p className="text-sm text-base-content/60 mt-2">Cards</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">2000+</div>
          <p className="text-sm text-base-content/60 mt-2">Cocktails</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">∞</div>
          <p className="text-sm text-base-content/60 mt-2">Gameplay</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">🌍</div>
          <p className="text-sm text-base-content/60 mt-2">Real World</p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'accent' | 'secondary'
}) {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50',
    accent: 'from-accent/20 to-accent/5 border-accent/30 hover:border-accent/50',
    secondary: 'from-secondary/20 to-secondary/5 border-secondary/30 hover:border-secondary/50',
  }

  const iconColors = {
    primary: 'text-primary',
    accent: 'text-accent',
    secondary: 'text-secondary',
  }

  return (
    <div
      className={`card bg-linear-to-br ${colorClasses[color]} border border-base-300 hover:shadow-lg transition-all duration-300`}
    >
      <div className="card-body">
        <div className={`${iconColors[color]} mb-2`}>{icon}</div>
        <h2 className="card-title text-xl">{title}</h2>
        <p className="text-base-content/70">{description}</p>
      </div>
    </div>
  )
}
