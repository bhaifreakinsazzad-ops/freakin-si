import { useEffect, useState } from 'react'
import { superAdminService } from '@/services'
import type { AuditEntry } from '@/types/domain'

export default function SuperAdminPage() {
  const [overview, setOverview] = useState({ totalUsers: 0, activeSubscriptions: 0, monthlyRuns: 0, failedJobs: 0 })
  const [audits, setAudits] = useState<AuditEntry[]>([])

  useEffect(() => {
    ;(async () => {
      const [o, a] = await Promise.all([superAdminService.getPlatformOverview(), superAdminService.getAuditLogs()])
      if (o.success) setOverview(o.data)
      if (a.success) setAudits(a.data)
    })()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Super Admin Platform Overview</h1>
      <div className="grid md:grid-cols-4 gap-3">
        {[['Total Users', overview.totalUsers], ['Active Subscriptions', overview.activeSubscriptions], ['Monthly Module Runs', overview.monthlyRuns], ['Failed Jobs', overview.failedJobs]].map(([k, v]) => (
          <div key={String(k)} className="rounded-xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4"><p className="text-xs uppercase text-[var(--fsi-text-dim)]">{k}</p><p className="text-2xl font-bold mt-1">{String(v)}</p></div>
        ))}
      </div>
      <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
        <h2 className="font-semibold">Audit Logs</h2>
        <div className="space-y-2 mt-3">
          {audits.map((a) => (
            <div key={a.id} className="rounded-lg border border-[var(--fsi-border)] p-3 text-sm">
              <p><span className="font-semibold">{a.actor}</span> {a.action} on <span className="text-[var(--bs-gold)]">{a.target}</span></p>
              <p className="text-xs text-[var(--fsi-text-muted)] mt-1">{new Date(a.at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
