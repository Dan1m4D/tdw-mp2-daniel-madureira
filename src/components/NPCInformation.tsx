import { Users } from 'lucide-react'

export function NPCInformation() {
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
