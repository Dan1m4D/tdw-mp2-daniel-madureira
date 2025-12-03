interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'accent' | 'secondary'
}

export function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
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
