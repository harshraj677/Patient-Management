export type PatientStatus = 'Admitted' | 'Discharged'

export interface Patient {
  id: string
  patientId: string
  name: string
  age: number
  gender: string
  ward: string
  department: string
  doctor: string
  admissionDate: string // YYYY-MM-DD
  status: PatientStatus
  createdAt: string
  updatedAt: string
}

/** Body sent to POST / PUT /api/patients */
export interface PatientPayload {
  name: string
  age: number
  gender: string
  ward: string
  department: string
  doctor: string
  admissionDate: string
}

export interface PatientFilters {
  search?: string
  ward?: string
  department?: string
  doctor?: string
  status?: string
}

export interface DashboardStats {
  totalPatients: number
  admitted: number
  discharged: number
  todaysAdmissions: number
}

export interface ApiErrorBody {
  status: number
  message: string
  errors?: Record<string, string> | null
}
