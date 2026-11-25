import { Plus } from 'lucide-react'
import { Button } from './ui/Button'

interface HeaderProps {
  title: string
  description: string
  onAdd?: () => void
}

export function Header({ title, description, onAdd }: HeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {onAdd && (
        <Button onClick={onAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      )}
    </div>
  )
}
