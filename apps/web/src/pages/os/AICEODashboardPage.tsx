import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { aiModuleService, adminService, analyticsService, assetService, journeyService, projectService, reviewService, supportService } from '@/services'
import { brand } from '@/config/brand'
import type { ActivityEntry, AssetRecord, JourneyStepState } from '@/types/domain'

export default function AICEODashboardPage() {
  const [steps, setSteps] = useState<JourneyStepState[]>([])
  const [assets, setAssets] = useState<AssetRecord[]>([])
  const [projectName, setProjectName] = useState('')
  const [adminStats, setAdminStats] = useState({ totalClients: 0, activeProjects: 0, pendingReviews: 0, supportRequests: 0 })
  const [moduleRuns, setModuleRuns] = useState(0)
  const [activity, setActivity] = useState<ActivityEntry[]>([])

  useEffect(() => {
    ;(async () => {
      const [proj, stepRes, assetRes, reviewRes, supportRes, moduleRes, adm, act] = await Promise.all([
        projectService.getActiveProject(),
        journeyService.getSteps(),
        assetService.listAssets(),
        reviewService.listTickets(),
        supportService.listThreads(),
        aiModuleService.getRecentRuns(),
        adminService.getOverview(),
        analyticsService.listActivity(),
      ])
      if (proj.success) setProjectName((proj.data as any).name)
      if (stepRes.success) setSteps(stepRes.data)
      if (assetRes.success) setAssets(assetRes.data)
      if (moduleRes.success) setModuleRuns(moduleRes.data.length)
      if (adm.success) setAdminStats(adm.data)
      if (act.success) setActivity(act.data)
      void reviewRes
      void supportRes
    })()
  }, [])

  const progress = useMemo(() => {
    if (!steps.length) return 0
    return Math.round(steps.reduce((sum, s) => sum + s.progress, 0) / steps.length)
  }, [steps])

  const readiness = Math.min(100, Math.round((progress * 0.65) + (assets.length * 6) + (moduleRuns * 1.5)))

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--fsi-border)] bg-gradient-to-br from-[rgba(181,18,27,0.15)] to-[rgba(201,164,73,0.08)] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--bs-gold)]">AI CEO Command Center</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">{projectName || `${brand.brandName} Business Project`}</h1>
        <p className="text-sm text-[var(--fsi-text-muted)] mt-2">Answer guided questions. Let AI build your business assets. Review, approve, and launch with expert support.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/journey" className="rounded-full bg-[var(--bs-red)] px-5 py-2.5 text-sm font-semibold">Continue Building</Link>
          <Link to="/modules" className="rounded-full border border-[var(--fsi-border)] px-5 py-2.5 text-sm">Open AI Modules</Link>
          <Link to="/support" className="rounded-full border border-[var(--fsi-border)] px-5 py-2.5 text-sm">Request Support</Link>
        </div>
      </section>

      <section className="grid lg:grid-cols-4 sm:grid-cols-2 gap-3">
        {[['Business Progress Score', `${progress}%`], ['Launch Readiness', `${readiness}%`], ['Pending Reviews', String(adminStats.pendingReviews)], ['Support Status', `${adminStats.supportRequests} Open`]].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--fsi-text-dim)]">{k}</p>
            <p className="text-2xl font-bold mt-1">{v}</p>
          </div>
        ))}
      </section>

      <section className="grid xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
          <h2 className="font-semibold">7-Step Journey Tracker</h2>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {steps.map((step) => (
              <Link key={step.id} to="/journey" className="rounded-xl border border-[var(--fsi-border)] bg-[rgba(255,255,255,0.02)] p-3 text-left hover:border-[var(--bs-gold)] transition">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{step.id}. {step.title}</p>
                  <span className="text-[11px] uppercase text-[var(--fsi-text-muted)]">{step.status.replace('_', ' ')}</span>
                </div>
                <p className="text-xs text-[var(--fsi-text-muted)] mt-1">{step.description}</p>
                <div className="h-2 rounded-full bg-black/40 mt-3"><div className="h-2 rounded-full bg-[var(--bs-gold)]" style={{ width: `${step.progress}%` }} /></div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
            <h3 className="font-semibold">AI CEO Brief</h3>
            <p className="text-xs text-[var(--fsi-text-muted)] mt-2">Modules run this week: {moduleRuns}</p>
            <p className="text-xs text-[var(--fsi-text-muted)]">Assets in review: {assets.filter((a) => a.status === 'in_review').length}</p>
            <p className="text-xs text-[var(--fsi-text-muted)]">Approved assets: {assets.filter((a) => a.status === 'approved').length}</p>
          </div>
          <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
            <h3 className="font-semibold">KPI Snapshot</h3>
            <p className="text-xs text-[var(--fsi-text-muted)] mt-2">Active Clients: {adminStats.totalClients}</p>
            <p className="text-xs text-[var(--fsi-text-muted)]">Active Projects: {adminStats.activeProjects}</p>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
          <h2 className="font-semibold">Recent Activity</h2>
          <div className="space-y-2 mt-3">
            {activity.slice(0, 8).map((a) => (
              <div key={a.id} className="rounded-lg border border-[var(--fsi-border)] p-2">
                <p className="text-sm">{a.title}</p>
                <p className="text-xs text-[var(--fsi-text-muted)]">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
          <h2 className="font-semibold">Asset Summary</h2>
          <div className="space-y-2 mt-3">
            {assets.slice(0, 8).map((asset) => (
              <div key={asset.id} className="rounded-lg border border-[var(--fsi-border)] p-2 flex items-center justify-between">
                <div>
                  <p className="text-sm">{asset.title}</p>
                  <p className="text-xs text-[var(--fsi-text-muted)]">{asset.type}</p>
                </div>
                <span className="text-[11px] uppercase text-[var(--fsi-text-muted)]">{asset.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
