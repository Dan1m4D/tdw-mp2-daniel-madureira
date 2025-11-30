import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar, Footer } from '../components'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-base-100 text-base-content">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
