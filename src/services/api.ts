import axios from 'axios'
import { supabase } from './supabase'
import { env } from '@/config/env'

// Converts snake_case keys to camelCase recursively
function deepCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(deepCamelCase)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
        deepCamelCase(v),
      ])
    )
  }
  return value
}

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }

    const method = config.method?.toUpperCase()
    const url = `${config.baseURL}${config.url}`
    console.log(`[API REQUEST] ➡️  ${method} ${url}`)
    if (config.params && Object.keys(config.params).length > 0) {
      console.log(`[API REQUEST] params:`, config.params)
    }
    if (config.data) {
      console.log(`[API REQUEST] body:`, config.data)
    }
    console.log(`[API REQUEST] auth: ${session?.access_token ? '✅ token presente' : '❌ sin token'}`)

    return config
  },
  (error) => {
    console.error('[API REQUEST] 🔴 Error en interceptor de request:', error)
    return Promise.reject(error)
  },
)

// Response interceptor - Unwrap envelope + camelCase + error handling
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase()
    const url = response.config.url
    console.log(`[API RESPONSE] ✅ ${method} ${url} — status: ${response.status}`)
    console.log(`[API RESPONSE] data:`, response.data)

    // Unwrap { success: true, data: T } → T and convert snake_case keys to camelCase
    const body = response.data
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      response.data = deepCamelCase(body.data)
    }

    return response
  },
  (error) => {
    const method = error.config?.method?.toUpperCase()
    const url = error.config?.url
    const status = error.response?.status
    const message = error.response?.data?.message ?? error.message

    console.error(`[API RESPONSE] 🔴 ${method} ${url} — status: ${status}, mensaje: ${message}`)
    if (error.response?.data) {
      console.error('[API RESPONSE] error data:', error.response.data)
    }

    if (status === 401) {
      console.warn('[API RESPONSE] 401 detectado — redirigiendo a /login')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
