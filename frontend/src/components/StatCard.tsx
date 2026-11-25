import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface StatCardProps {
  label: string
  value: number | undefined
  icon: LucideIcon
  tone: 'teal' | 'emerald' | 'slate' | 'sky'
}

const tones = {
  teal: 'bg-teal-50 text-teal-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
  sky: 'bg-sky-50 text-sky-600',
}

export function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10', tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {value === undefined ? (
        <div className="mt-3 h-8 w-16 animate-pulse rounded bg-slate-100" />
      ) : (
        <p className="mt-2 text-2xl font-semibold text-slate-900 sm:mt-3 sm:text-3xl">{value}</p>
      )}
    </div>
  )
}
