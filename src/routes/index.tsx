import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Zap, MapPin, Users } from 'lucide-react'
import { HeroSection } from '../components/home/HeroSection'
import { FeatureCard } from '../components/home/FeatureCard'
import { GameFlowSection } from '../components/home/GameFlowSection'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center gap-16 py-12">
      {/* Hero Section */}
      <HeroSection />

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
      <GameFlowSection />

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
