import { Plus, UserRoundPlus } from 'lucide-react'
import { Button } from './ui/Button'

interface EmptyStateProps {
  title?: string
  description?: string
  onAdd?: () => void
}

export function EmptyState({
  title = 'No patients yet',
  description = 'Start by adding your first patient record.',
  onAdd,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
        <UserRoundPlus className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {onAdd && (
        <Button className="mt-5" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      )}
    </div>
  )
}
