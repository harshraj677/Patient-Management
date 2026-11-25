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
      {/* Wide screens (xl+): full table. Below that, cards are easier to read than a squeezed table. */}
      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-3 min-[1400px]:px-4">Patient</th>
              <th className="px-3 py-3 min-[1400px]:px-4">Age</th>
              <th className="px-3 py-3 min-[1400px]:px-4">Gender</th>
              <th className="px-3 py-3 min-[1400px]:px-4">Ward</th>
              <th className="px-3 py-3 min-[1400px]:px-4">Department</th>
              <th className="px-3 py-3 min-[1400px]:px-4">Doctor</th>
              <th className="px-3 py-3 min-[1400px]:px-4">Admission Date</th>
              <th className="px-3 py-3 min-[1400px]:px-4">Status</th>
              <th className="px-3 py-3 min-[1400px]:px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <td className="max-w-[13rem] min-[1400px]:max-w-[15rem] px-3 py-3 min-[1400px]:px-4">
                  <PatientCell patient={p} />
                </td>
                <td className="px-3 py-3 min-[1400px]:px-4 text-slate-700">{p.age}</td>
                <td className="px-3 py-3 min-[1400px]:px-4 text-slate-700">{p.gender}</td>
                <td className="px-3 py-3 min-[1400px]:px-4 text-slate-700">{p.ward}</td>
                <td className="px-3 py-3 min-[1400px]:px-4 text-slate-700">{p.department}</td>
                <td className="px-3 py-3 min-[1400px]:px-4 text-slate-700 min-[1400px]:whitespace-nowrap">{p.doctor}</td>
                <td className="whitespace-nowrap px-3 py-3 min-[1400px]:px-4 text-slate-700">{formatDate(p.admissionDate)}</td>
                <td className="px-3 py-3 min-[1400px]:px-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-3 py-3 min-[1400px]:px-4 text-right">
                  <ActionsMenu patient={p} {...actions} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones and tablets: patient cards (1 column, 2 columns from sm) */}
      <ul className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:hidden">
        {patients.map((p) => (
          <li key={p.id} className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <PatientCell patient={p} />
              <div className="-mr-2 -mt-2 shrink-0">
                <ActionsMenu patient={p} {...actions} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-3 text-xs">
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
    <div className="flex min-w-0 flex-1 items-center gap-3">
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
  'flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-100'

function ActionsMenu({ patient, onView, onEdit, onDischarge, onDelete }: { patient: Patient } & PatientActions) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="flex h-11 w-11 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        aria-label={`Actions for ${patient.name}`}
      >
        <MoreVertical className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={4} collisionPadding={12} className="z-50 min-w-44 max-w-[calc(100vw-1.5rem)] rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
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
