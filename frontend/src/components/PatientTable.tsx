import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Eye, LogOut, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { formatDate, initials } from '../lib/utils'
import type { Patient } from '../types/patient'
import { StatusBadge } from './StatusBadge'

export interface PatientActions {
  onView: (p: Patient) => void
  onEdit: (p: Patient) => void
  onDischarge: (p: Patient) => void
  onDelete: (p: Patient) => void
}

interface PatientTableProps extends PatientActions {
  patients: Patient[]
}

export function PatientTable({ patients, ...actions }: PatientTableProps) {
  return (
    <>
      {/* Desktop / tablet: table (scrolls horizontally inside the card, never the page) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Ward</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Admission Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <PatientCell patient={p} />
                </td>
                <td className="px-4 py-3 text-slate-700">{p.age}</td>
                <td className="px-4 py-3 text-slate-700">{p.gender}</td>
                <td className="px-4 py-3 text-slate-700">{p.ward}</td>
                <td className="px-4 py-3 text-slate-700">{p.department}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{p.doctor}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(p.admissionDate)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionsMenu patient={p} {...actions} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {patients.map((p) => (
          <li key={p.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <PatientCell patient={p} />
              <ActionsMenu patient={p} {...actions} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <Meta label="Age / Gender" value={`${p.age} · ${p.gender}`} />
              <Meta label="Ward" value={p.ward} />
              <Meta label="Department" value={p.department} />
              <Meta label="Doctor" value={p.doctor} />
              <Meta label="Admitted" value={formatDate(p.admissionDate)} />
              <div>
                <StatusBadge status={p.status} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export function PatientCell({ patient }: { patient: Patient }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
        {initials(patient.name)}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{patient.name}</p>
        <p className="text-xs text-slate-500">{patient.patientId}</p>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-slate-400">{label}</p>
      <p className="truncate text-slate-700">{value}</p>
    </div>
  )
}

const itemClass =
  'flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-100'

function ActionsMenu({ patient, onView, onEdit, onDischarge, onDelete }: { patient: Patient } & PatientActions) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        aria-label={`Actions for ${patient.name}`}
      >
        <MoreVertical className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={4} className="z-50 min-w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
          <DropdownMenu.Item className={itemClass} onSelect={() => onView(patient)}>
            <Eye className="h-4 w-4" /> View Details
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={() => onEdit(patient)}>
            <Pencil className="h-4 w-4" /> Edit
          </DropdownMenu.Item>
          {patient.status === 'Admitted' && (
            <DropdownMenu.Item className={itemClass} onSelect={() => onDischarge(patient)}>
              <LogOut className="h-4 w-4" /> Mark Discharged
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
          <DropdownMenu.Item className={`${itemClass} text-red-600 data-[highlighted]:bg-red-50`} onSelect={() => onDelete(patient)}>
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
