import { useLayoutEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const getInitialTheme = (): 'wanderer' | 'wanderer-dark' => {
  const stored = localStorage.getItem('theme') as 'wanderer' | 'wanderer-dark' | null
  if (stored) return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'wanderer-dark' : 'wanderer'
}

const applyTheme = (newTheme: 'wanderer' | 'wanderer-dark') => {
  const html = document.documentElement
  if (newTheme === 'wanderer-dark') {
    html.setAttribute('data-mode', 'dark')
  } else {
    html.removeAttribute('data-mode')
  }
  html.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'wanderer' | 'wanderer-dark'>(() => getInitialTheme())

  useLayoutEffect(() => {
    // Apply theme to DOM on mount and when theme changes
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'wanderer-dark' ? 'wanderer' : 'wanderer-dark'))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
