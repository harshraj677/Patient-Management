import { api } from './api'
import type { Patient, PatientFilters, PatientPayload, PatientStatus } from '../types/patient'

export const patientService = {
  async list(filters: PatientFilters = {}): Promise<Patient[]> {
    // Only send filters that have a value
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v && String(v).trim() !== ''))
    const { data } = await api.get<Patient[]>('/patients', { params })
    return data
  },

  async get(id: string): Promise<Patient> {
    const { data } = await api.get<Patient>(`/patients/${id}`)
    return data
  },

  async create(payload: PatientPayload): Promise<Patient> {
    const { data } = await api.post<Patient>('/patients', payload)
    return data
  },

  async update(id: string, payload: PatientPayload): Promise<Patient> {
    const { data } = await api.put<Patient>(`/patients/${id}`, payload)
    return data
  },

  async updateStatus(id: string, status: PatientStatus): Promise<Patient> {
    const { data } = await api.patch<Patient>(`/patients/${id}/status`, { status })
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/patients/${id}`)
  },
}
