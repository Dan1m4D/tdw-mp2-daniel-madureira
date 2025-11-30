import { Scroll } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-base-200 border-t border-base-300 mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60">
        <p>© {currentYear} The Wandering Bartender | A procedural adventure game</p>
        <div className="flex items-center gap-2">
          <Scroll size={14} />
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  )
}
