import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Wine, MapPin, Users, Sparkles, Compass, Zap } from 'lucide-react'

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
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">Adventure Awaits</span>
          <div className="h-1 w-12 bg-primary rounded-full" />
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-center leading-tight">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-primary">
            The Wandering Bartender
          </span>
        </h1>

        <p className="text-lg md:text-xl text-center text-base-content/80 leading-relaxed max-w-2xl mx-auto">
          Embark on a procedural adventure through vibrant cities. Meet unique souls, read the weather, and craft legendary drinks that change destinies.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles size={18} className="text-primary" />
            <span className="text-base-content/70">AI-Generated Stories</span>
          </div>
          <div className="divider divider-horizontal mx-0 h-6" />
          <div className="flex items-center gap-2 text-sm">
            <Compass size={18} className="text-primary" />
            <span className="text-base-content/70">Real Locations</span>
          </div>
          <div className="divider divider-horizontal mx-0 h-6" />
          <div className="flex items-center gap-2 text-sm">
            <Wine size={18} className="text-primary" />
            <span className="text-base-content/70">Craft Cocktails</span>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        <FeatureCard 
          icon={<MapPin size={32} />}
          title="Explore the World"
          description="Travel through real-world locations with dynamic weather, local details, and procedurally-generated storytelling."
          color="primary"
        />
        <FeatureCard 
          icon={<Users size={32} />}
          title="Meet Characters"
          description="Encounter AI-generated NPCs with unique personalities, backstories, and meaningful quests tailored to each location."
          color="accent"
        />
        <FeatureCard 
          icon={<Wine size={32} />}
          title="Craft Excellence"
          description="Mix real cocktail recipes to fulfill customer desires and unlock new stories, regions, and possibilities."
          color="secondary"
        />
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
      <div className="grid grid-cols-3 gap-8 text-center pt-8">
        <div>
          <div className="text-3xl font-bold text-primary">∞</div>
          <p className="text-sm text-base-content/60 mt-2">Infinite Stories</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">🌍</div>
          <p className="text-sm text-base-content/60 mt-2">Real Places</p>
        </div>
        <div>
          <div className="text-3xl font-bold text-primary">🍸</div>
          <p className="text-sm text-base-content/60 mt-2">Craft Drinks</p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
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
    <div className={`card bg-linear-to-br ${colorClasses[color]} border border-base-300 hover:shadow-lg transition-all duration-300`}>
      <div className="card-body">
        <div className={`${iconColors[color]} mb-2`}>
          {icon}
        </div>
        <h2 className="card-title text-xl">{title}</h2>
        <p className="text-base-content/70">{description}</p>
      </div>
    </div>
  )
}
