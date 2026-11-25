import axios, { AxiosError } from 'axios'
import type { ApiErrorBody } from '../types/patient'

/**
 * VITE_API_URL is the backend address, e.g. https://my-api.onrender.com
 * ("/api" is appended automatically if missing, so both forms work).
 */
export function buildApiBaseUrl(raw: string | undefined): string {
  const url = (raw?.trim() || 'http://localhost:8080').replace(/\/+$/, '')
  return url.endsWith('/api') ? url : `${url}/api`
}

/** Central Axios instance used by every service. */
export const api = axios.create({
  baseURL: buildApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: { 'Content-Type': 'application/json' },
  // Free-tier backends can take up to a minute to wake up after being idle.
  timeout: 70000,
})

/** Converts any Axios error into a user-friendly message plus optional per-field errors. */
export function parseApiError(error: unknown): { message: string; fieldErrors: Record<string, string> } {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return {
        message: 'Cannot reach the server. Check your connection or try again in a moment.',
        fieldErrors: {},
      }
    }
    const body = error.response.data as Partial<ApiErrorBody> | undefined
    const fieldErrors = body?.errors ?? {}
    const hasFieldErrors = Object.keys(fieldErrors).length > 0
    return {
      message: hasFieldErrors
        ? 'Please fix the highlighted fields.'
        : body?.message || `Request failed (${error.response.status})`,
      fieldErrors,
    }
  }
  return { message: 'Something went wrong. Please try again.', fieldErrors: {} }
}
