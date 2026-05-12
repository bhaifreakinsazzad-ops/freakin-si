import { mockProject } from '@/data/mockStore'
import { portalApi } from '@/services/httpApi'

let activeProjectId: string | null = null

export async function getActiveProjectId(): Promise<string> {
  if (activeProjectId) return activeProjectId

  const list = await portalApi.projects.list()
  if (Array.isArray(list?.projects) && list.projects.length) {
    activeProjectId = String(list.projects[0].id)
    return activeProjectId
  }

  const created = await portalApi.projects.create({
    name: 'Black Sheep Founder Project',
    idea: '',
    audience: '',
    location: 'United States',
  })
  activeProjectId = String(created.project?.id || mockProject.id)
  return activeProjectId
}

export function getPreviewProjectId() {
  return mockProject.id
}
