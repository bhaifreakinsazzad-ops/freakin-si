import { useEffect, useState } from 'react'
import { adminService, reviewService, supportService } from '@/services'
import type { ReviewTicket, SupportThread } from '@/types/domain'

export default function AdminCommandCenterPage() {
  const [overview, setOverview] = useState({ totalClients: 0, activeProjects: 0, pendingReviews: 0, supportRequests: 0 })
  const [tickets, setTickets] = useState<ReviewTicket[]>([])
  const [support, setSupport] = useState<SupportThread[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [replies, setReplies] = useState<Record<string, string>>({})

  const refresh = async () => {
    const [o, t, s] = await Promise.all([adminService.getOverview(), reviewService.listTickets(), supportService.listThreads()])
    if (o.success) setOverview(o.data)
    if (t.success) setTickets(t.data)
    if (s.success) setSupport(s.data)
  }

  useEffect(() => { void refresh() }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Command Center</h1>
      <div className="grid md:grid-cols-5 gap-3">
        {[['Total Clients', overview.totalClients], ['Active Projects', overview.activeProjects], ['Pending Reviews', overview.pendingReviews], ['Support Requests', overview.supportRequests], ['Project Health', '78%']].map(([k, v]) => (
          <div key={String(k)} className="rounded-xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4"><p className="text-xs text-[var(--fsi-text-dim)] uppercase">{k}</p><p className="text-2xl font-bold mt-1">{String(v)}</p></div>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
          <h2 className="font-semibold">Review Queue</h2>
          <div className="space-y-2 mt-3">
            {tickets.map((t) => (
              <div key={t.id} className="rounded-lg border border-[var(--fsi-border)] p-3">
                <p className="text-sm">Ticket {t.id} • Step {t.stepId ?? '-'}</p>
                <p className="text-xs text-[var(--fsi-text-muted)]">Status: {t.status}</p>
                <textarea value={notes[t.id] ?? ''} onChange={(e) => setNotes((prev) => ({ ...prev, [t.id]: e.target.value }))} className="w-full rounded-lg border border-[var(--fsi-border)] bg-black/30 px-2 py-1.5 text-xs mt-2" placeholder="Admin note..." />
                <div className="mt-2 flex gap-2">
                  <button onClick={async () => { await reviewService.approveAsset(t.id, notes[t.id] || 'Approved by admin'); await refresh() }} className="text-xs rounded-lg border border-[var(--fsi-border)] px-3 py-1.5">Approve</button>
                  <button onClick={async () => { await reviewService.rejectAsset(t.id, notes[t.id] || 'Need revision'); await refresh() }} className="text-xs rounded-lg border border-[var(--fsi-border)] px-3 py-1.5">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
          <h2 className="font-semibold">Support Queue</h2>
          <div className="space-y-2 mt-3">
            {support.map((s) => <div key={s.id} className="rounded-lg border border-[var(--fsi-border)] p-3"><p className="text-sm">{s.subject}</p><p className="text-xs text-[var(--fsi-text-muted)]">{s.status} • {s.priority}</p><textarea value={replies[s.id] ?? ''} onChange={(e) => setReplies((prev) => ({ ...prev, [s.id]: e.target.value }))} className="w-full rounded-lg border border-[var(--fsi-border)] bg-black/30 px-2 py-1.5 text-xs mt-2" placeholder="Reply to client..." /><button onClick={async () => { await supportService.addAdminReply(s.id, replies[s.id] || 'Thanks, we are reviewing now.'); await refresh() }} className="mt-2 text-xs rounded-lg border border-[var(--fsi-border)] px-3 py-1.5">Send Reply</button></div>)}
          </div>
        </section>
      </div>
    </div>
  )
}
