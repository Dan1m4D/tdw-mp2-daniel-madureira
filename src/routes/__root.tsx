import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/adventure" className="[&.active]:font-bold">
          Adventure
        </Link>
      </nav>
      <hr />
      <Outlet />
    </>
  )
}
