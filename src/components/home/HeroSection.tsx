import { Sparkles, MapPin, Users, Wine } from 'lucide-react'

export function HeroSection() {
  return (
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
  )
}
