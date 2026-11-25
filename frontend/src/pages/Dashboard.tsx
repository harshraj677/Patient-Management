import { ArrowRight, BedDouble, CalendarPlus, LogOut, Plus, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { EmptyState } from '../components/EmptyState'
import { Header } from '../components/Header'
import { ErrorState, LoadingState } from '../components/LoadingState'
import { PatientDialog } from '../components/PatientDialog'
import { PatientCell } from '../components/PatientTable'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '../components/ui/Button'
import { formatDate } from '../lib/utils'
import { parseApiError } from '../services/api'
import { dashboardService } from '../services/dashboardService'
import type { DashboardStats, Patient } from '../types/patient'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>()
  const [recent, setRecent] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, r] = await Promise.all([dashboardService.stats(), dashboardService.recentPatients()])
      setStats(s)
      setRecent(r)
    } catch (err) {
      const { message } = parseApiError(err)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      <Header title="Welcome back" description={`Here's today's admissions overview · ${today}`} onAdd={() => setFormOpen(true)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Patients" value={stats?.totalPatients} icon={Users} tone="teal" />
        <StatCard label="Currently Admitted" value={stats?.admitted} icon={BedDouble} tone="emerald" />
        <StatCard label="Discharged" value={stats?.discharged} icon={LogOut} tone="slate" />
        <StatCard label="Today's Admissions" value={stats?.todaysAdmissions} icon={CalendarPlus} tone="sky" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Patients</h2>
              <p className="text-xs text-slate-500">The 5 most recently added records</p>
            </div>
            <Link to="/patients" className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading && !stats ? (
            <LoadingState message="Loading dashboard... (the server may take a moment to wake up)" />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : recent.length === 0 ? (
            <EmptyState onAdd={() => setFormOpen(true)} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((p) => (
                <li key={p.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <PatientCell patient={p} />
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 sm:justify-end">
                    <span>{p.ward}</span>
                    <span>{p.doctor}</span>
                    <span>{formatDate(p.admissionDate)}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-semibold text-slate-900">Quick Admission</h2>
            <p className="mt-1 text-sm text-slate-500">Register a new patient admission in a few seconds. A patient ID is generated automatically.</p>
          </div>
          <Button className="mt-5 w-full" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> Add Patient
          </Button>
        </section>
      </div>

      <PatientDialog open={formOpen} onOpenChange={setFormOpen} onSaved={load} />
    </div>
  )
}
