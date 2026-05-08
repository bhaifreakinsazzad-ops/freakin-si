export { authService } from './httpApi'
export { projectService, journeyService, aiModuleService } from './journeyService'
import { runAdapter } from './adapter'
import { portalApi } from './httpApi'
import { mockProject } from '@/data/mockStore'
export {
  assetService,
  reviewService,
  supportService,
  marketplaceService,
  notificationService,
  adminService,
  superAdminService,
  analyticsService,
} from './domainServices'

export const onboardingService = {
  saveStep: async <T>(step: number, payload: T) =>
    runAdapter(
      async () => {
        const result = await portalApi.onboarding.save({
          project_id: mockProject.id,
          step,
          payload,
        })
        return { step: result.answer.step, payload: result.answer.payload }
      },
      async () => ({ step, payload }),
    ),
  listSteps: () =>
    runAdapter(
      async () => {
        const result = await portalApi.onboarding.list(mockProject.id)
        return result.answers ?? []
      },
      async () => [],
    ),
}

export const documentService = {
  list: () =>
    runAdapter(
      async () => {
        const result = await portalApi.documents.list(mockProject.id)
        return result.documents ?? []
      },
      async () => [],
    ),
  create: (payload: Record<string, unknown>) =>
    runAdapter(
      async () => {
        const result = await portalApi.documents.create({ project_id: mockProject.id, ...payload })
        return result.document
      },
      async () => payload,
    ),
}

export const trackingService = {
  track: (event: string, payload: Record<string, unknown>) =>
    runAdapter(
      async () => {
        const result = await portalApi.activity.create({
          project_id: mockProject.id,
          action_type: 'event',
          title: event,
          detail: JSON.stringify(payload),
          metadata: payload,
        })
        return result.activity
      },
      async () => ({ event, payload }),
    ),
}
