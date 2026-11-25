import { api } from './api'
import type { DashboardStats, Patient } from '../types/patient'

export const dashboardService = {
  async stats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/dashboard/stats')
    return data
  },

  async recentPatients(): Promise<Patient[]> {
    const { data } = await api.get<Patient[]>('/dashboard/recent-patients')
    return data
  },
}
