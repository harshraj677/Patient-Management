import { useState } from 'react'
import { toast } from 'sonner'
import { parseApiError } from '../services/api'
import { patientService } from '../services/patientService'
import type { Patient, PatientPayload } from '../types/patient'
import { PatientForm } from './PatientForm'
import { Modal } from './ui/Modal'

interface PatientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When set, the dialog edits this patient; otherwise it creates a new one. */
  patient?: Patient | null
  onSaved: (patient: Patient) => void
}

/** Add / Edit patient modal. Handles the API call, toasts and server-side validation errors. */
export function PatientDialog({ open, onOpenChange, patient, onSaved }: PatientDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const isEdit = !!patient

  const handleSubmit = async (payload: PatientPayload) => {
    setSubmitting(true)
    setServerErrors({})
    try {
      const saved = isEdit ? await patientService.update(patient.id, payload) : await patientService.create(payload)
      toast.success(isEdit ? 'Patient updated successfully' : `Patient ${saved.patientId} added successfully`)
      onSaved(saved)
      onOpenChange(false)
    } catch (err) {
      const { message, fieldErrors } = parseApiError(err)
      setServerErrors(fieldErrors)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) setServerErrors({})
    onOpenChange(next)
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? 'Edit Patient' : 'Add Patient'}
      description={isEdit ? `Update the details for ${patient.patientId}.` : 'Enter the admission details for the new patient.'}
    >
      <PatientForm
        patient={patient}
        submitting={submitting}
        serverErrors={serverErrors}
        onSubmit={handleSubmit}
        onCancel={() => handleOpenChange(false)}
      />
    </Modal>
  )
}
