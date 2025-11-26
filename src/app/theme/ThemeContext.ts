import { createContext } from 'react'

export interface ThemeContextType {
  theme: 'wanderer' | 'wanderer-dark'
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
