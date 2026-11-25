import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { FilterBar } from '../components/FilterBar'
import { Header } from '../components/Header'
import { ErrorState, LoadingState } from '../components/LoadingState'
import { PatientDetailsDialog } from '../components/PatientDetailsDialog'
import { PatientDialog } from '../components/PatientDialog'
import { PatientTable } from '../components/PatientTable'
import { parseApiError } from '../services/api'
import { patientService } from '../services/patientService'
import type { Patient, PatientFilters } from '../types/patient'

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filters, setFilters] = useState<PatientFilters>({})
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Patient | null>(null)
  const [viewing, setViewing] = useState<Patient | null>(null)
  const [toDelete, setToDelete] = useState<Patient | null>(null)
  const [toDischarge, setToDischarge] = useState<Patient | null>(null)
  const [acting, setActing] = useState(false)

  // Debounce search typing so we don't call the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search ?? ''), 300)
    return () => clearTimeout(t)
  }, [filters.search])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await patientService.list({ ...filters, search: debouncedSearch })
      setPatients(data)
    } catch (err) {
      const { message } = parseApiError(err)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.ward, filters.department, filters.doctor, filters.status])

  useEffect(() => {
    load()
  }, [load])

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleDischarge = async () => {
    if (!toDischarge) return
    setActing(true)
    try {
      await patientService.updateStatus(toDischarge.id, 'Discharged')
      toast.success(`${toDischarge.name} has been discharged`)
      setToDischarge(null)
      load()
    } catch (err) {
      toast.error(parseApiError(err).message)
    } finally {
      setActing(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setActing(true)
    try {
      await patientService.remove(toDelete.id)
      toast.success(`${toDelete.name}'s record was deleted`)
      setToDelete(null)
      load()
    } catch (err) {
      toast.error(parseApiError(err).message)
    } finally {
      setActing(false)
    }
  }

  const hasFilters = Object.values(filters).some((v) => v)

  return (
    <div>
      <Header title="Patients" description="Manage patient admissions and records." onAdd={openAdd} />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <FilterBar filters={filters} onChange={setFilters} />

        {loading && patients.length === 0 ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : patients.length === 0 ? (
          hasFilters ? (
            <EmptyState title="No matching patients" description="Try a different name or clear the filters." />
          ) : (
            <EmptyState onAdd={openAdd} />
          )
        ) : (
          <>
            <PatientTable
              patients={patients}
              onView={setViewing}
              onEdit={(p) => {
                setEditing(p)
                setFormOpen(true)
              }}
              onDischarge={setToDischarge}
              onDelete={setToDelete}
            />
            <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
              Showing {patients.length} patient{patients.length === 1 ? '' : 's'}
              {loading && ' · Refreshing...'}
            </div>
          </>
        )}
      </div>

      <PatientDialog open={formOpen} onOpenChange={setFormOpen} patient={editing} onSaved={load} />
      <PatientDetailsDialog patient={viewing} onOpenChange={(o) => !o && setViewing(null)} />

      <ConfirmDialog
        open={!!toDischarge}
        onOpenChange={(o) => !o && setToDischarge(null)}
        title="Discharge patient?"
        description={`${toDischarge?.name} (${toDischarge?.patientId}) will be marked as discharged.`}
        confirmLabel="Mark Discharged"
        loading={acting}
        onConfirm={handleDischarge}
      />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete patient record?"
        description={`This will permanently delete ${toDelete?.name} (${toDelete?.patientId}). This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={acting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
