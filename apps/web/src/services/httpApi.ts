import api, { adminApi, authApi } from '@/lib/api'

export const authService = {
  login: authApi.login,
  register: authApi.register,
  me: authApi.me,
  updateProfile: authApi.updateProfile,
}

export const businessesApi = {
  generate: (data: { businessIdea: string; targetAudience?: string; budget?: string; goal?: string }) =>
    api.post('/businesses/generate', data).then((r) => r.data),
}

export const portalApi = {
  projects: {
    list: () => api.get('/portal/projects').then((r) => r.data),
    create: (payload: Record<string, unknown>) => api.post('/portal/projects', payload).then((r) => r.data),
    update: (id: string, payload: Record<string, unknown>) => api.patch(`/portal/projects/${id}`, payload).then((r) => r.data),
  },
  onboarding: {
    list: (projectId: string) => api.get(`/portal/onboarding/${projectId}`).then((r) => r.data),
    save: (payload: Record<string, unknown>) => api.post('/portal/onboarding', payload).then((r) => r.data),
  },
  steps: {
    list: (projectId: string) => api.get(`/portal/steps/${projectId}`).then((r) => r.data),
    save: (payload: Record<string, unknown>) => api.post('/portal/steps', payload).then((r) => r.data),
  },
  assets: {
    list: (projectId: string) => api.get(`/portal/assets/${projectId}`).then((r) => r.data),
    create: (payload: Record<string, unknown>) => api.post('/portal/assets', payload).then((r) => r.data),
    update: (id: string, payload: Record<string, unknown>) => api.patch(`/portal/assets/${id}`, payload).then((r) => r.data),
  },
  moduleRuns: {
    list: (projectId: string) => api.get(`/portal/modules/runs/${projectId}`).then((r) => r.data),
    create: (payload: Record<string, unknown>) => api.post('/portal/modules/runs', payload).then((r) => r.data),
  },
  reviews: {
    list: (projectId: string) => api.get(`/portal/reviews/${projectId}`).then((r) => r.data),
    create: (payload: Record<string, unknown>) => api.post('/portal/reviews', payload).then((r) => r.data),
    update: (id: string, payload: Record<string, unknown>) => api.patch(`/portal/reviews/${id}`, payload).then((r) => r.data),
  },
  support: {
    listThreads: (projectId: string) => api.get(`/portal/support/threads/${projectId}`).then((r) => r.data),
    createThread: (payload: Record<string, unknown>) => api.post('/portal/support/threads', payload).then((r) => r.data),
    updateThread: (id: string, payload: Record<string, unknown>) => api.patch(`/portal/support/threads/${id}`, payload).then((r) => r.data),
    listMessages: (threadId: string) => api.get(`/portal/support/messages/${threadId}`).then((r) => r.data),
    createMessage: (payload: Record<string, unknown>) => api.post('/portal/support/messages', payload).then((r) => r.data),
  },
  marketplace: {
    createOrder: (payload: Record<string, unknown>) => api.post('/portal/marketplace/orders', payload).then((r) => r.data),
    listOrders: (projectId: string) => api.get(`/portal/marketplace/orders/${projectId}`).then((r) => r.data),
  },
  documents: {
    list: (projectId: string) => api.get(`/portal/documents/${projectId}`).then((r) => r.data),
    create: (payload: Record<string, unknown>) => api.post('/portal/documents', payload).then((r) => r.data),
  },
  notifications: {
    list: () => api.get('/portal/notifications').then((r) => r.data),
    create: (payload: Record<string, unknown>) => api.post('/portal/notifications', payload).then((r) => r.data),
    markRead: (id: string) => api.patch(`/portal/notifications/${id}/read`, {}).then((r) => r.data),
  },
  activity: {
    list: (projectId: string) => api.get(`/portal/activity/${projectId}`).then((r) => r.data),
    create: (payload: Record<string, unknown>) => api.post('/portal/activity', payload).then((r) => r.data),
  },
  adminNotes: {
    list: (projectId: string) => api.get(`/portal/admin-notes/${projectId}`).then((r) => r.data),
    create: (payload: Record<string, unknown>) => api.post('/portal/admin-notes', payload).then((r) => r.data),
  },
  pricing: {
    listPlans: () => api.get('/portal/pricing-plans').then((r) => r.data),
    listSubscriptions: () => api.get('/portal/subscriptions').then((r) => r.data),
  },
}

export const reviewApi = {
  getAdminStats: adminApi.getStats,
}
