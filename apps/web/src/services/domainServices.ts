import { mockAssets, mockReviews, mockSupport, mockNotifications, mockListings, mockActivity, mockProject, mockRuns, mockSteps } from '@/data/mockStore'
import { runAdapter } from '@/services/adapter'
import { portalApi } from '@/services/httpApi'
import type { ActivityEntry, AssetRecord, NotificationItem, ReviewTicket, SupportThread, MarketplaceListing, AuditEntry } from '@/types/domain'

const PROJECT_ID = mockProject.id

function logActivity(type: ActivityEntry['type'], title: string, detail: string) {
  mockActivity.unshift({ id: `ac-${Date.now()}-${Math.random()}`, type, title, detail, at: new Date().toISOString() })
}

export const assetService = {
  listAssets: () => runAdapter<AssetRecord[]>(
    async () => {
      const r = await portalApi.assets.list(PROJECT_ID)
      return (r.assets || []).map((a: any) => ({ id: a.id, projectId: a.project_id, title: a.title, type: a.asset_type, content: typeof a.content === 'string' ? a.content : JSON.stringify(a.content), status: a.status, updatedAt: a.updated_at }))
    },
    () => mockAssets,
  ),
  saveAssetDraft: async (asset: AssetRecord) => {
    return runAdapter(
      async () => {
        const payload = { id: asset.id, project_id: asset.projectId, title: asset.title, asset_type: asset.type, content: { text: asset.content }, status: 'draft' }
        await portalApi.assets.create(payload)
        await portalApi.activity.create({ project_id: asset.projectId, actor_role: 'client', action_type: 'asset', title: 'Draft saved', detail: asset.title })
        return asset
      },
      async () => {
        const idx = mockAssets.findIndex((a) => a.id === asset.id)
        if (idx >= 0) mockAssets[idx] = { ...asset, status: 'draft', updatedAt: new Date().toISOString() }
        else mockAssets.unshift({ ...asset, status: 'draft', updatedAt: new Date().toISOString() })
        logActivity('asset', 'Draft saved', `${asset.title} was saved as draft.`)
        return asset
      },
    )
  },
  exportDocument: async (assetId: string) => {
    return runAdapter(
      async () => {
        const document = await portalApi.documents.create({ project_id: PROJECT_ID, asset_id: assetId, name: `Export ${assetId}`, document_type: 'generated', status: 'ready' })
        return JSON.stringify(document.document || {})
      },
      async () => {
        const asset = mockAssets.find((a) => a.id === assetId)
        logActivity('asset', 'Document exported', `${asset?.title ?? assetId} prepared for export.`)
        return asset?.content ?? 'No content'
      },
    )
  },
}

export const reviewService = {
  listTickets: () => runAdapter<ReviewTicket[]>(
    async () => {
      const r = await portalApi.reviews.list(PROJECT_ID)
      const stepKeyMap: Record<string, number> = {
        idea: 1,
        brand: 2,
        case: 3,
        preview: 4,
        setup: 5,
        funding: 6,
        launch: 7,
      }
      return (r.tickets || []).map((t: any) => {
        const stepNum = t.step_key ? Number(t.step_key) : undefined
        return {
          id: t.id,
          projectId: t.project_id,
          stepId: Number.isFinite(stepNum) ? stepNum : stepKeyMap[String(t.step_key)] ?? undefined,
          assetId: t.asset_id || undefined,
          status: t.status,
          adminNote: t.admin_note || undefined,
          createdAt: t.created_at,
        }
      })
    },
    () => mockReviews,
  ),
  submitForReview: async (assetId: string, stepId?: number) => {
    return runAdapter<ReviewTicket>(
      async () => {
        const r = await portalApi.reviews.create({ project_id: PROJECT_ID, asset_id: assetId, step_key: stepId ? String(stepId) : null })
        await portalApi.activity.create({ project_id: PROJECT_ID, actor_role: 'client', action_type: 'review', title: 'Review submitted', detail: `Asset ${assetId}` })
        return { id: r.ticket.id, projectId: PROJECT_ID, stepId, assetId, status: 'pending', createdAt: r.ticket.created_at }
      },
      async () => {
        const ticket: ReviewTicket = { id: `r-${Date.now()}`, projectId: PROJECT_ID, assetId, stepId, status: 'pending', createdAt: new Date().toISOString() }
        mockReviews.unshift(ticket)
        logActivity('review', 'Review submitted', `Asset ${assetId} submitted for review.`)
        return ticket
      },
    )
  },
  approveAsset: async (ticketId: string, adminNote?: string) => runAdapter<ReviewTicket | null>(
    async () => {
      const r = await portalApi.reviews.update(ticketId, { status: 'approved', admin_note: adminNote || null })
      await portalApi.adminNotes.create({ project_id: PROJECT_ID, review_ticket_id: ticketId, note: adminNote || 'Approved' })
      return { id: r.ticket.id, projectId: PROJECT_ID, status: 'approved', createdAt: r.ticket.created_at, adminNote: r.ticket.admin_note }
    },
    async () => {
      const t = mockReviews.find((r) => r.id === ticketId)
      if (t) { t.status = 'approved'; t.adminNote = adminNote }
      logActivity('review', 'Review approved', `Ticket ${ticketId} approved.`)
      return t ?? null
    },
  ),
  rejectAsset: async (ticketId: string, adminNote?: string) => runAdapter<ReviewTicket | null>(
    async () => {
      const r = await portalApi.reviews.update(ticketId, { status: 'rejected', admin_note: adminNote || null })
      await portalApi.adminNotes.create({ project_id: PROJECT_ID, review_ticket_id: ticketId, note: adminNote || 'Rejected' })
      return { id: r.ticket.id, projectId: PROJECT_ID, status: 'rejected', createdAt: r.ticket.created_at, adminNote: r.ticket.admin_note }
    },
    async () => {
      const t = mockReviews.find((r) => r.id === ticketId)
      if (t) { t.status = 'rejected'; t.adminNote = adminNote }
      logActivity('review', 'Review rejected', `Ticket ${ticketId} requires revision.`)
      return t ?? null
    },
  ),
}

export const supportService = {
  listThreads: () => runAdapter<SupportThread[]>(
    async () => {
      const r = await portalApi.support.listThreads(PROJECT_ID)
      const threads = r.threads || []
      const withMessages = await Promise.all(threads.map(async (t: any) => {
        const m = await portalApi.support.listMessages(t.id)
        return {
          id: t.id,
          projectId: t.project_id,
          subject: t.subject,
          priority: t.priority,
          status: t.status,
          messages: (m.messages || []).map((x: any) => ({ id: x.id, sender: x.sender_role === 'admin' ? 'admin' : 'client', body: x.body, at: x.created_at })),
        }
      }))
      return withMessages
    },
    () => mockSupport,
  ),
  createSupportRequest: async (subject: string, body: string) => runAdapter(
    async () => {
      const t = await portalApi.support.createThread({ project_id: PROJECT_ID, subject, priority: 'medium', status: 'open' })
      await portalApi.support.createMessage({ thread_id: t.thread.id, sender_role: 'client', body })
      await portalApi.activity.create({ project_id: PROJECT_ID, actor_role: 'client', action_type: 'support', title: 'Support request created', detail: subject })
      return {
        id: t.thread.id,
        projectId: PROJECT_ID,
        subject: t.thread.subject,
        priority: t.thread.priority,
        status: t.thread.status,
        messages: [{ id: `m-${Date.now()}`, sender: 'client', body, at: new Date().toISOString() }],
      }
    },
    async () => {
      const thread: SupportThread = { id: `s-${Date.now()}`, projectId: PROJECT_ID, subject, priority: 'medium', status: 'open', messages: [{ id: 'm-new', sender: 'client', body, at: new Date().toISOString() }] }
      mockSupport.unshift(thread)
      logActivity('support', 'Support request created', subject)
      return thread
    },
  ),
  addAdminReply: async (threadId: string, body: string) => runAdapter<SupportThread | null>(
    async () => {
      await portalApi.support.createMessage({ thread_id: threadId, sender_role: 'admin', body })
      const updated = await portalApi.support.updateThread(threadId, { status: 'in_progress' })
      return {
        id: updated.thread.id,
        projectId: updated.thread.project_id,
        subject: updated.thread.subject,
        priority: updated.thread.priority,
        status: updated.thread.status,
        messages: [],
      }
    },
    async () => {
      const thread = mockSupport.find((t) => t.id === threadId)
      if (thread) {
        thread.messages.push({ id: `m-${Date.now()}`, sender: 'admin', body, at: new Date().toISOString() })
        thread.status = 'in_progress'
      }
      logActivity('support', 'Support replied', `Thread ${threadId} updated.`)
      return thread ?? null
    },
  ),
}

export const marketplaceService = {
  listListings: () => runAdapter<MarketplaceListing[]>(
    async () => {
      // fallback to local curated listings until listing management endpoint exists
      return mockListings
    },
    () => mockListings,
  ),
  requestListing: async (listingId: string, note: string) => runAdapter(
    async () => {
      const order = await portalApi.marketplace.createOrder({ project_id: PROJECT_ID, listing_id: listingId, note, status: 'requested' })
      await portalApi.activity.create({ project_id: PROJECT_ID, actor_role: 'client', action_type: 'marketplace', title: 'Marketplace request sent', detail: listingId })
      return { listingId, note, orderId: order.order.id }
    },
    async () => {
      const listing = mockListings.find((l) => l.id === listingId)
      logActivity('support', 'Marketplace request sent', `${listing?.title ?? listingId}: ${note}`)
      return { listingId, note }
    },
  ),
}

export const notificationService = {
  list: () => runAdapter<NotificationItem[]>(
    async () => {
      const r = await portalApi.notifications.list()
      return (r.notifications || []).map((n: any) => ({ id: n.id, title: n.title, body: n.body, read: !!n.read, at: n.created_at }))
    },
    () => mockNotifications,
  ),
  markRead: async (id: string) => runAdapter(
    async () => {
      const r = await portalApi.notifications.markRead(id)
      const n = r.notification
      return { id: n.id, title: n.title, body: n.body, read: !!n.read, at: n.created_at }
    },
    async () => {
      const n = mockNotifications.find((x) => x.id === id)
      if (n) n.read = true
      return n ?? null
    },
  ),
}

export const analyticsService = {
  listActivity: () => runAdapter<ActivityEntry[]>(
    async () => {
      const r = await portalApi.activity.list(PROJECT_ID)
      return (r.activity || []).map((a: any) => ({ id: a.id, type: (a.action_type || 'progress') as ActivityEntry['type'], title: a.title, detail: a.detail, at: a.created_at }))
    },
    () => mockActivity,
  ),
}

export const adminService = {
  getOverview: async () => ({ success: true, source: 'mock' as const, data: { totalClients: 124, activeProjects: 38, pendingReviews: mockReviews.filter((r) => r.status === 'pending').length, supportRequests: mockSupport.filter((s) => s.status !== 'resolved').length } }),
}

export const superAdminService = {
  getPlatformOverview: async () => ({ success: true, source: 'mock' as const, data: { totalUsers: 1420, activeSubscriptions: 377, monthlyRuns: mockRuns.length, failedJobs: 13 } }),
  getAuditLogs: async (): Promise<{ success: boolean; source: 'mock'; data: AuditEntry[] }> => ({
    success: true,
    source: 'mock',
    data: [
      { id: 'a1', actor: 'super-admin', action: 'updated pricing', target: 'pro plan', at: new Date().toISOString() },
      { id: 'a2', actor: 'admin', action: 'approved review', target: 'Brand Kit v2', at: new Date().toISOString() },
    ],
  }),
}
