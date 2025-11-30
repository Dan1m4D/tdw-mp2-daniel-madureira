import { Link } from '@tanstack/react-router'
import { Compass, Home, Map as MapIcon, Moon, Sun } from 'lucide-react'
import { useTheme } from '../app/theme/useTheme'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-base-200 border-b border-base-300 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-content shadow-lg">
            <Compass size={22} className="font-bold" />
          </div>
          <div>
            <span className="text-lg font-bold text-primary tracking-wider font-serif block leading-none">
              The Wandering
            </span>
            <span className="text-xs text-primary tracking-widest opacity-75">BARTENDER</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <ul className="flex gap-1">
            <li>
              <NavLink to="/" label="Home" icon={<Home size={18} />} />
            </li>
            <li>
              <NavLink to="/adventure" label="Adventure" icon={<MapIcon size={18} />} />
            </li>
          </ul>
          <div className="divider divider-horizontal mx-2 h-6" />
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm btn-circle"
            title={`Switch to ${theme === 'wanderer-dark' ? 'light' : 'dark'} theme`}
            aria-label="Toggle theme"
          >
            {theme === 'wanderer-dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>
    </header>
  )
}

interface NavLinkProps {
  to: string
  label: string
  icon: React.ReactNode
}

function NavLink({ to, label, icon }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="px-4 py-2 flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors rounded-lg hover:bg-base-300 [&.active]:text-primary [&.active]:bg-base-300 [&.active]:font-medium"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
}
