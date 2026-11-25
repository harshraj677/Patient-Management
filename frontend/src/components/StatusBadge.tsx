import type { PatientStatus } from '../types/patient'
import { cn } from '../lib/utils'

export function StatusBadge({ status }: { status: PatientStatus }) {
  const admitted = status === 'Admitted'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        admitted ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', admitted ? 'bg-emerald-500' : 'bg-slate-400')} />
      {status}
    </span>
  )
}
