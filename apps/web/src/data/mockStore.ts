import type {
  ActivityEntry,
  AssetRecord,
  BusinessProject,
  JourneyStepState,
  MarketplaceListing,
  ModuleRun,
  NotificationItem,
  ReviewTicket,
  SupportThread,
} from '@/types/domain'
import { moduleCatalog } from '@/data/moduleCatalog'

const now = () => new Date().toISOString()

export const mockProject: BusinessProject = {
  id: 'proj-1',
  userId: 'current',
  name: 'Black Sheep Founder Project',
  idea: 'Guided AI-powered business launch operating system',
  audience: 'First-time and growth-stage founders',
  location: 'United States',
  currentStep: 3,
  progress: 42,
  readinessScore: 61,
  status: 'in_review',
  createdAt: now(),
  updatedAt: now(),
}

export const mockSteps: JourneyStepState[] = [
  { id: 1, key: 'idea', title: 'Idea Generator', description: 'Refine raw idea into business direction.', progress: 100, status: 'approved', reviewState: 'approved', lastUpdatedAt: now() },
  { id: 2, key: 'brand', title: 'Brand Builder', description: 'Name, voice, palette and positioning.', progress: 78, status: 'review', reviewState: 'submitted', lastUpdatedAt: now() },
  { id: 3, key: 'case', title: 'Business Case', description: 'Offer, pricing, SWOT and roadmap.', progress: 46, status: 'in_progress', reviewState: 'none', lastUpdatedAt: now() },
  { id: 4, key: 'preview', title: 'Live Preview', description: 'Website and content preview.', progress: 12, status: 'in_progress', reviewState: 'none', lastUpdatedAt: now() },
  { id: 5, key: 'setup', title: 'U.S. Setup', description: 'Checklist and compliance readiness.', progress: 0, status: 'not_started', reviewState: 'none', lastUpdatedAt: now() },
  { id: 6, key: 'funding', title: 'Funding Prep', description: 'Readiness, assumptions and funding docs.', progress: 0, status: 'not_started', reviewState: 'none', lastUpdatedAt: now() },
  { id: 7, key: 'launch', title: 'Launch & Manage', description: 'Launch board, CRM, KPI, support.', progress: 0, status: 'not_started', reviewState: 'none', lastUpdatedAt: now() },
]

export const mockAssets: AssetRecord[] = [
  { id: 'a1', projectId: 'proj-1', title: 'Brand Kit v2', type: 'brand', content: 'Brand voice, palette, logo direction', status: 'approved', updatedAt: now() },
  { id: 'a2', projectId: 'proj-1', title: 'Business Case Draft', type: 'business_case', content: 'Roadmap + pricing strategy', status: 'in_review', updatedAt: now() },
  { id: 'a3', projectId: 'proj-1', title: 'Funding Snapshot', type: 'funding', content: 'Readiness score and assumptions', status: 'draft', updatedAt: now() },
]

export const mockReviews: ReviewTicket[] = [
  { id: 'r1', projectId: 'proj-1', stepId: 2, assetId: 'a2', status: 'pending', createdAt: now() },
]

export const mockSupport: SupportThread[] = [
  {
    id: 's1',
    projectId: 'proj-1',
    subject: 'Need help choosing setup state',
    priority: 'high',
    status: 'in_progress',
    messages: [
      { id: 'm1', sender: 'client', body: 'Which state is better for launch?', at: now() },
      { id: 'm2', sender: 'admin', body: 'We added state comparison inside your setup step.', at: now() },
    ],
  },
]

export const mockListings: MarketplaceListing[] = [
  { id: 'l1', title: 'Done-For-You Launch Blueprint', category: 'Done-for-You Packages', description: 'CGWS team builds and launches complete funnel.', price: '$1,999', status: 'active' },
  { id: 'l2', title: 'Funding Prep Intensive', category: 'Funding Prep', description: 'Readiness audit + lender pack support.', price: '$599', status: 'active' },
  { id: 'l3', title: 'Brand Sprint', category: 'Branding', description: 'Name + positioning + visual direction in 72h.', price: '$399', status: 'active' },
  { id: 'l4', title: 'Website Launch Pack', category: 'Website', description: 'Landing page + CTA + analytics setup.', price: '$799', status: 'active' },
]

export const mockNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Review Submitted', body: 'Brand Builder assets submitted for admin review.', read: false, at: now() },
  { id: 'n2', title: 'Support Reply', body: 'Admin replied to your setup request.', read: false, at: now() },
]

export const mockRuns: ModuleRun[] = moduleCatalog.slice(0, 8).map((module, idx) => ({
  id: `run-${module.id}`,
  moduleId: module.id,
  projectId: 'proj-1',
  input: `Generate output for ${module.name}`,
  output: `${module.name} output drafted with structured recommendations.`,
  createdAt: new Date(Date.now() - idx * 3600_000).toISOString(),
}))

export const mockActivity: ActivityEntry[] = [
  { id: 'ac1', type: 'review', title: 'Review submitted', detail: 'Brand Builder sent for admin review.', at: now() },
  { id: 'ac2', type: 'module_run', title: 'Module run complete', detail: 'Business Case Generator produced output.', at: now() },
  { id: 'ac3', type: 'support', title: 'Support response received', detail: 'Admin updated setup guidance.', at: now() },
]
