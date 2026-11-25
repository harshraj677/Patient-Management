import { formatDate, initials } from '../lib/utils'
import type { Patient } from '../types/patient'
import { StatusBadge } from './StatusBadge'
import { Modal } from './ui/Modal'

interface Props {
  patient: Patient | null
  onOpenChange: (open: boolean) => void
}

export function PatientDetailsDialog({ patient, onOpenChange }: Props) {
  return (
    <Modal open={!!patient} onOpenChange={onOpenChange} title="Patient Details">
      {patient && (
        <div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-base font-semibold text-teal-700">
              {initials(patient.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900">{patient.name}</p>
              <p className="text-sm text-slate-500">{patient.patientId}</p>
            </div>
            <StatusBadge status={patient.status} />
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <Item label="Age" value={`${patient.age} years`} />
            <Item label="Gender" value={patient.gender} />
            <Item label="Ward" value={patient.ward} />
            <Item label="Department" value={patient.department} />
            <Item label="Doctor" value={patient.doctor} />
            <Item label="Admission Date" value={formatDate(patient.admissionDate)} />
            <Item label="Record Created" value={new Date(patient.createdAt).toLocaleString()} />
            <Item label="Last Updated" value={new Date(patient.updatedAt).toLocaleString()} />
          </dl>
        </div>
      )}
    </Modal>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-800">{value}</dd>
    </div>
  )
}
