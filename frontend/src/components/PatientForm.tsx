import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { forwardRef, useEffect, type ReactNode, type SelectHTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DEPARTMENTS, DOCTORS, GENDERS, WARDS } from '../lib/options'
import { cn, todayISO } from '../lib/utils'
import type { Patient, PatientPayload } from '../types/patient'
import { Button } from './ui/Button'

/** Frontend validation rules. The backend enforces the same rules independently. */
export const patientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Patient name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[A-Za-z ]+$/, 'Name can contain only letters and spaces'),
  age: z
    .string()
    .trim()
    .min(1, 'Age is required')
    .regex(/^\d+$/, 'Age must be a whole number')
    .refine((v) => Number(v) >= 0 && Number(v) <= 120, 'Age must be between 0 and 120'),
  gender: z.string().min(1, 'Gender is required'),
  ward: z.string().min(1, 'Ward is required'),
  department: z.string().min(1, 'Department is required'),
  doctor: z.string().min(1, 'Doctor is required'),
  admissionDate: z
    .string()
    .min(1, 'Admission date is required')
    .refine((v) => v <= todayISO(), 'Admission date cannot be in the future'),
})

export type PatientFormValues = z.infer<typeof patientSchema>

const emptyValues: PatientFormValues = {
  name: '',
  age: '',
  gender: '',
  ward: '',
  department: '',
  doctor: '',
  admissionDate: todayISO(),
}

interface PatientFormProps {
  patient?: Patient | null
  submitting: boolean
  serverErrors: Record<string, string>
  onSubmit: (payload: PatientPayload) => void
  onCancel: () => void
}

export function PatientForm({ patient, submitting, serverErrors, onSubmit, onCancel }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    reset(
      patient
        ? {
            name: patient.name,
            age: String(patient.age),
            gender: patient.gender,
            ward: patient.ward,
            department: patient.department,
            doctor: patient.doctor,
            admissionDate: patient.admissionDate,
          }
        : { ...emptyValues, admissionDate: todayISO() },
    )
  }, [patient, reset])

  // Show backend validation errors next to the matching field
  useEffect(() => {
    Object.entries(serverErrors).forEach(([field, message]) => {
      if (field in emptyValues) setError(field as keyof PatientFormValues, { type: 'server', message })
    })
  }, [serverErrors, setError])

  const submit = handleSubmit((values) =>
    onSubmit({
      ...values,
      name: values.name.replace(/\s+/g, ' '),
      age: Number(values.age),
    }),
  )

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label="Patient Name" error={errors.name?.message} htmlFor="name">
        <input id="name" placeholder="e.g. Aarav Mehta" autoComplete="off" className={inputClass(errors.name)} {...register('name')} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Age" error={errors.age?.message} htmlFor="age">
          <input id="age" type="number" inputMode="numeric" min={0} max={120} step={1} placeholder="0 - 120" className={inputClass(errors.age)} {...register('age')} />
        </Field>
        <Field label="Gender" error={errors.gender?.message} htmlFor="gender">
          <SelectInput id="gender" options={GENDERS} placeholder="Select gender" invalid={!!errors.gender} {...register('gender')} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ward" error={errors.ward?.message} htmlFor="ward">
          <SelectInput id="ward" options={WARDS} placeholder="Select ward" invalid={!!errors.ward} {...register('ward')} />
        </Field>
        <Field label="Department" error={errors.department?.message} htmlFor="department">
          <SelectInput id="department" options={DEPARTMENTS} placeholder="Select department" invalid={!!errors.department} {...register('department')} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Doctor" error={errors.doctor?.message} htmlFor="doctor">
          <SelectInput id="doctor" options={DOCTORS} placeholder="Select doctor" invalid={!!errors.doctor} {...register('doctor')} />
        </Field>
        <Field label="Admission Date" error={errors.admissionDate?.message} htmlFor="admissionDate">
          <input id="admissionDate" type="date" max={todayISO()} className={inputClass(errors.admissionDate)} {...register('admissionDate')} />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {patient ? 'Save Changes' : 'Add Patient'}
        </Button>
      </div>
    </form>
  )
}

function inputClass(error?: unknown) {
  return cn(
    'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-teal-500/30',
    error ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-teal-500',
  )
}

function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly string[]
  placeholder: string
  invalid?: boolean
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(({ options, placeholder, invalid, ...props }, ref) => (
  <select ref={ref} className={inputClass(invalid)} {...props}>
    <option value="">{placeholder}</option>
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
))
SelectInput.displayName = 'SelectInput'
