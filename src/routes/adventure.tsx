import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/adventure')({
  component: Adventure,
})

function Adventure() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Adventure</h1>
      <p>Your adventure begins here...</p>
    </div>
  )
}
