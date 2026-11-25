import { Search, X } from 'lucide-react'
import { DEPARTMENTS, DOCTORS, STATUSES, WARDS } from '../lib/options'
import type { PatientFilters } from '../types/patient'
import { Button } from './ui/Button'

interface FilterBarProps {
  filters: PatientFilters
  onChange: (filters: PatientFilters) => void
}

const selectClass =
  'h-11 w-full min-w-0 text-base sm:h-10 sm:text-sm rounded-lg border border-slate-200 bg-white px-3 text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30'

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const set = (key: keyof PatientFilters, value: string) => onChange({ ...filters, [key]: value })
  const hasFilters = Object.values(filters).some((v) => v)

  return (
    <div className="grid grid-cols-1 gap-3 border-b border-slate-200 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3 min-[1400px]:grid-cols-6">
      <div className="relative sm:col-span-2 lg:-order-2 lg:col-span-2 min-[1400px]:order-none min-[1400px]:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={filters.search ?? ''}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search patients by name..."
          aria-label="Search patients by name"
          className={`${selectClass} pl-9`}
        />
      </div>
      <FilterSelect label="Ward" value={filters.ward} options={WARDS} onChange={(v) => set('ward', v)} />
      <FilterSelect label="Department" value={filters.department} options={DEPARTMENTS} onChange={(v) => set('department', v)} />
      <FilterSelect label="Doctor" value={filters.doctor} options={DOCTORS} onChange={(v) => set('doctor', v)} />
      <div className="flex gap-2 lg:-order-1 min-[1400px]:order-none">
        <div className="min-w-0 flex-1">
          <FilterSelect label="Status" value={filters.status} options={STATUSES} onChange={(v) => set('status', v)} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 shrink-0 sm:h-10 sm:w-10"
          onClick={() => onChange({})}
          disabled={!hasFilters}
          aria-label="Clear filters"
          title="Clear filters"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value?: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <select aria-label={`Filter by ${label}`} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={selectClass}>
      <option value="">All {label === 'Status' ? 'Statuses' : label + 's'}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}
