import { Users, CloudRain, Cloud, Sun, Wind } from 'lucide-react'
import { useAppSelector } from '../app/hooks'
import { selectCurrentNPC } from '../features/npc/npcSlice'

const MOOD_EMOJI: Record<string, string> = {
  happy: '😊',
  energetic: '⚡',
  neutral: '😐',
  calm: '😌',
  sad: '😔',
}

const WEATHER_ICONS: Record<number, React.ReactNode> = {
  0: <Sun size={16} className="text-yellow-400" />,
  1: <Cloud size={16} className="text-gray-300" />,
  2: <Cloud size={16} className="text-gray-400" />,
  3: <Cloud size={16} className="text-gray-500" />,
  45: <Cloud size={16} className="text-gray-400" />,
  61: <CloudRain size={16} className="text-blue-400" />,
  63: <CloudRain size={16} className="text-blue-500" />,
  65: <CloudRain size={16} className="text-blue-600" />,
  95: <Wind size={16} className="text-purple-500" />,
}

export function NPCInformation() {
  const currentNPC = useAppSelector(selectCurrentNPC)

  if (!currentNPC) {
    return (
      <div className="card bg-base-200 border border-base-300 shadow-lg">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <Users size={20} className="text-accent" />
            Customer
          </h2>
          <div className="divider my-2" />
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="placeholder avatar mb-4">
              <div className="bg-primary text-primary-content rounded-full w-16">
                <span className="text-2xl">?</span>
              </div>
            </div>
            <p className="text-base-content/60 italic">Waiting for a customer...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-200 border border-base-300 shadow-lg">
      <div className="card-body">
        <h2 className="card-title flex items-center gap-2">
          <Users size={20} className="text-accent" />
          Customer
        </h2>
        <div className="divider my-2" />

        {/* NPC Avatar and Name */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="avatar">
            <div className="bg-primary text-primary-content rounded-full w-20 flex items-center justify-center text-3xl">
              {currentNPC.name.charAt(0)}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold">{currentNPC.name}</h3>
            <p className="text-sm text-base-content/70">{currentNPC.description}</p>
          </div>
        </div>

        {/* Mood Section */}
        <div className="bg-base-300/50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Mood:</span>
            <span className="text-2xl">{MOOD_EMOJI[currentNPC.mood]}</span>
          </div>
          <p className="text-xs text-base-content/70 capitalize">
            {currentNPC.mood} (Score: {currentNPC.moodScore > 0 ? '+' : ''}
            {currentNPC.moodScore})
          </p>
        </div>

        {/* Weather Information */}
        <div className="bg-base-300/50 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <div className="shrink-0 pt-0.5">
              {WEATHER_ICONS[currentNPC.locationWeather.weatherCode] || <Cloud size={16} />}
            </div>
            <div className="grow">
              <p className="text-xs font-semibold">Weather Impact</p>
              <p className="text-xs text-base-content/70">{currentNPC.moodDescription}</p>
            </div>
          </div>
        </div>

        {/* Required Ingredients */}
        <div>
          <p className="text-sm font-semibold mb-2">Wants</p>
          <div className="flex flex-wrap gap-2">
            {currentNPC.currentRequirements.map(ingredient => {
              const isAdditional = !currentNPC.baseRequirements.includes(ingredient)
              return (
                <div
                  key={ingredient}
                  className={`badge badge-sm ${isAdditional ? 'badge-success' : 'badge-outline'}`}
                  title={isAdditional ? 'Added due to weather' : 'Base requirement'}
                >
                  {ingredient}
                  {isAdditional && <span className="ml-1">✨</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
