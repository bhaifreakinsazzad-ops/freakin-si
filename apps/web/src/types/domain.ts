export type AdapterSource = 'mock' | 'live'

export interface ServiceResponse<T> {
  success: boolean
  data: T
  error?: string
  source: AdapterSource
}

export type UserRole = 'client' | 'admin' | 'super_admin'

export interface ActivityEntry {
  id: string
  type: 'module_run' | 'review' | 'support' | 'asset' | 'progress'
  title: string
  detail: string
  at: string
}

export interface BusinessProject {
  id: string
  userId: string
  name: string
  idea: string
  audience: string
  location: string
  currentStep: number
  progress: number
  readinessScore: number
  status: 'draft' | 'in_review' | 'approved' | 'launched'
  createdAt: string
  updatedAt: string
}

export interface JourneyStepState {
  id: number
  key: 'idea' | 'brand' | 'case' | 'preview' | 'setup' | 'funding' | 'launch'
  title: string
  description: string
  progress: number
  status: 'not_started' | 'in_progress' | 'review' | 'approved'
  reviewState: 'none' | 'submitted' | 'changes_requested' | 'approved'
  lastUpdatedAt: string
}

export interface AssetRecord {
  id: string
  projectId: string
  title: string
  type: 'brand' | 'business_case' | 'website' | 'setup' | 'funding' | 'launch' | 'document'
  content: string
  status: 'draft' | 'in_review' | 'approved'
  updatedAt: string
}

export interface ModuleDefinition {
  id: string
  name: string
  category: 'Business Creation' | 'Brand' | 'Strategy' | 'Website & Content' | 'Setup & Operations' | 'Funding' | 'Launch & Management'
  description: string
  locked: boolean
  usageCount: number
  status: 'ready' | 'beta'
}

export interface ModuleRun {
  id: string
  moduleId: string
  projectId: string
  input: string
  output: string
  createdAt: string
}

export interface ReviewTicket {
  id: string
  projectId: string
  stepId?: number
  assetId?: string
  status: 'pending' | 'approved' | 'rejected'
  adminNote?: string
  createdAt: string
}

export interface SupportThread {
  id: string
  projectId: string
  subject: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'resolved'
  messages: Array<{ id: string; sender: 'client' | 'admin'; body: string; at: string }>
}

export interface MarketplaceListing {
  id: string
  title: string
  category: 'Business Setup' | 'Branding' | 'Website' | 'Marketing' | 'Funding Prep' | 'Consulting' | 'Launch Support' | 'Done-for-You Packages'
  description: string
  price: string
  status: 'active' | 'paused'
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  read: boolean
  at: string
}

export interface AuditEntry {
  id: string
  actor: string
  action: string
  target: string
  at: string
}
