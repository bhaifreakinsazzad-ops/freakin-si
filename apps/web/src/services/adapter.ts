import type { ServiceResponse } from '@/types/domain'

export type ServiceMode = 'mock' | 'live' | 'hybrid'

const serviceMode = (import.meta.env.VITE_SERVICE_MODE as ServiceMode | undefined) || 'hybrid'

export async function runAdapter<T>(
  liveFn: () => Promise<T>,
  mockFn: () => Promise<T> | T,
): Promise<ServiceResponse<T>> {
  if (serviceMode === 'mock') {
    return { success: true, data: await mockFn(), source: 'mock' }
  }

  if (serviceMode === 'live') {
    try {
      return { success: true, data: await liveFn(), source: 'live' }
    } catch (error) {
      return { success: false, data: null as unknown as T, source: 'live', error: (error as Error).message }
    }
  }

  try {
    return { success: true, data: await liveFn(), source: 'live' }
  } catch {
    return { success: true, data: await mockFn(), source: 'mock' }
  }
}
