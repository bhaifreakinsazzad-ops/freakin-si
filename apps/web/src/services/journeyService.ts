import { moduleCatalog } from '@/data/moduleCatalog'
import { mockProject, mockRuns, mockSteps } from '@/data/mockStore'
import type { JourneyStepState, ModuleDefinition, ModuleRun } from '@/types/domain'
import { runAdapter } from '@/services/adapter'
import { businessesApi, portalApi } from '@/services/httpApi'
import { getActiveProjectId, getPreviewProjectId } from '@/services/projectContext'

const PROJECT_ID = getPreviewProjectId()

const stepMap: Record<number, JourneyStepState['key']> = {
  1: 'idea',
  2: 'brand',
  3: 'case',
  4: 'preview',
  5: 'setup',
  6: 'funding',
  7: 'launch',
}

const stepTitles: Record<JourneyStepState['key'], string> = {
  idea: 'Idea Generator',
  brand: 'Brand Builder',
  case: 'Business Case',
  preview: 'Live Preview',
  setup: 'U.S. Setup',
  funding: 'Funding Prep',
  launch: 'Launch & Manage',
}

const stepDescriptions: Record<JourneyStepState['key'], string> = {
  idea: 'Refine raw idea into business direction.',
  brand: 'Name, voice, palette and positioning.',
  case: 'Offer, pricing, SWOT and roadmap.',
  preview: 'Website and content preview.',
  setup: 'Checklist and compliance readiness.',
  funding: 'Readiness, assumptions and funding docs.',
  launch: 'Launch board, CRM, KPI, support.',
}

function fromLiveSteps(rows: any[]): JourneyStepState[] {
  const keyed = new Map<string, any>()
  for (const r of rows) keyed.set(String(r.step_key || ''), r)
  return Object.entries(stepMap).map(([id, key]) => {
    const row = keyed.get(key)
    return {
      id: Number(id),
      key,
      title: stepTitles[key],
      description: stepDescriptions[key],
      progress: row?.progress ?? 0,
      status: row?.status ?? 'not_started',
      reviewState: row?.review_state ?? 'none',
      lastUpdatedAt: row?.updated_at ?? new Date().toISOString(),
    }
  })
}

export const journeyService = {
  getSteps: () => runAdapter<JourneyStepState[]>(
    async () => {
      const projectId = await getActiveProjectId()
      const r = await portalApi.steps.list(projectId)
      return fromLiveSteps(r.steps || [])
    },
    () => mockSteps,
  ),
  updateStepProgress: async (stepId: number, progress: number) => {
    const key = stepMap[stepId]
    const status = progress >= 100 ? 'review' : progress > 0 ? 'in_progress' : 'not_started'
    const review_state = progress >= 100 ? 'submitted' : 'none'
    return runAdapter(
      async () => {
        const projectId = await getActiveProjectId()
        const r = await portalApi.steps.save({ project_id: projectId, step_key: key, progress: Math.max(0, Math.min(100, progress)), status, review_state })
        return {
          id: stepId,
          key,
          title: stepTitles[key],
          description: stepDescriptions[key],
          progress: r.step.progress,
          status: r.step.status,
          reviewState: r.step.review_state,
          lastUpdatedAt: r.step.updated_at,
        }
      },
      async () => {
        const step = mockSteps.find((s) => s.id === stepId)
        if (step) {
          step.progress = Math.max(0, Math.min(100, progress))
          step.status = status as any
          step.reviewState = review_state as any
          step.lastUpdatedAt = new Date().toISOString()
        }
        return step ?? null
      },
    )
  },
}

export const aiModuleService = {
  listModules: () => runAdapter<ModuleDefinition[]>(async () => moduleCatalog, () => moduleCatalog),
  getRecentRuns: () => runAdapter<ModuleRun[]>(
    async () => {
      const projectId = await getActiveProjectId()
      const r = await portalApi.moduleRuns.list(projectId)
      return (r.runs || []).map((run: any) => ({ id: run.id, moduleId: String(run.module_id), projectId: run.project_id, input: JSON.stringify(run.input), output: JSON.stringify(run.output, null, 2), createdAt: run.created_at }))
    },
    () => mockRuns,
  ),
  runAIModule: async (moduleId: string, input: string) => {
    const module = moduleCatalog.find((m) => m.id === moduleId)
    await new Promise((r) => setTimeout(r, 600))
    const outputObj = {
      module: module?.name ?? 'Module',
      summary: `Structured output generated for ${module?.name ?? 'module'}.`,
      recommendations: [
        'Clarify ICP and positioning statement.',
        'Define primary offer and conversion goal.',
        'Attach next action to 7-step journey.',
      ],
      input,
    }

    return runAdapter(
      async () => {
        const projectId = await getActiveProjectId()
        const created = await portalApi.moduleRuns.create({ module_id: moduleId, project_id: projectId, input: { text: input }, output: outputObj })
        const m = moduleCatalog.find((x) => x.id === moduleId)
        if (m) m.usageCount += 1
        return { id: created.run.id, moduleId, projectId, input, output: JSON.stringify(outputObj, null, 2), createdAt: created.run.created_at }
      },
      async () => {
        const run: ModuleRun = {
          id: `run-${Date.now()}`,
          moduleId,
          projectId: PROJECT_ID,
          input,
          output: JSON.stringify(outputObj, null, 2),
          createdAt: new Date().toISOString(),
        }
        mockRuns.unshift(run)
        const m = moduleCatalog.find((x) => x.id === moduleId)
        if (m) m.usageCount += 1
        return run
      },
    )
  },
  generateIdeaStrategy: (input: string) => aiModuleService.runAIModule('1', input),
  generateBrandKit: (input: string) => aiModuleService.runAIModule('10', input),
  generateBusinessCase: (input: string) => aiModuleService.runAIModule('15', input),
  generateWebsitePreview: (input: string) => aiModuleService.runAIModule('22', input),
  generateSetupChecklist: (input: string) => aiModuleService.runAIModule('31', input),
  generateFundingPrep: (input: string) => aiModuleService.runAIModule('39', input),
  generateLaunchPlan: (input: string) => aiModuleService.runAIModule('46', input),
}

export const projectService = {
  getActiveProject: () => runAdapter(
    async () => {
      const list = await portalApi.projects.list()
      if (Array.isArray(list?.projects) && list.projects.length) {
        const p = list.projects[0]
        return {
          id: p.id,
          userId: p.user_id,
          name: p.name,
          idea: p.idea || '',
          audience: p.audience || '',
          location: p.location || '',
          currentStep: p.current_step || 1,
          progress: p.progress || 0,
          readinessScore: p.readiness_score || 0,
          status: p.status || 'draft',
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }
      }
      if (!Array.isArray(list?.projects)) {
        return mockProject
      }
      const created = await portalApi.projects.create({ name: 'Black Sheep Founder Project', idea: '', audience: '', location: 'United States' })
      const p = created.project
      return {
        id: p.id,
        userId: p.user_id,
        name: p.name,
        idea: p.idea || '',
        audience: p.audience || '',
        location: p.location || '',
        currentStep: p.current_step || 1,
        progress: p.progress || 0,
        readinessScore: p.readiness_score || 0,
        status: p.status || 'draft',
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }
    },
    async () => mockProject,
  ),
  saveBusinessIdea: async (idea: string, targetAudience: string, budget: string) => {
    return runAdapter(
      async () => businessesApi.generate({ businessIdea: idea, targetAudience, budget, goal: 'Launch-ready business system' }),
      () => ({ blueprint: { businessName: 'Mock Blueprint' }, saved: true }),
    )
  },
}
