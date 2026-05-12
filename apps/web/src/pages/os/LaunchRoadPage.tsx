import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CurrentMissionPanel from '@/components/launch-road/CurrentMissionPanel'
import ContextualPowerUpCard from '@/components/launch-road/ContextualPowerUpCard'
import IsometricJourneyMap from '@/components/launch-road/IsometricJourneyMap'
import ReviewGatePanel from '@/components/launch-road/ReviewGatePanel'
import RewardAssetStrip from '@/components/launch-road/RewardAssetStrip'
import ZoneWorkspaceDrawer from '@/components/launch-road/ZoneWorkspaceDrawer'
import type { ZoneNodeData } from '@/components/launch-road/JourneyZoneNode'
import { aiModuleService, analyticsService, assetService, journeyService, marketplaceService, projectService, reviewService, supportService } from '@/services'
import type { ActivityEntry, AssetRecord, JourneyStepState, MarketplaceListing, ModuleDefinition, ModuleRun, ReviewTicket, SupportThread } from '@/types/domain'
import { brand } from '@/config/brand'

const zoneBlueprint: Array<{ id: number; label: string; subtitle: string; mission: string; stepId?: number; leftPct: number; topPct: number }> = [
  { id: 1, label: 'Idea Valley', subtitle: 'Raw Idea', mission: 'Turn your raw concept into a clear business direction.', stepId: 1, leftPct: 9, topPct: 78 },
  { id: 2, label: 'Brand Forge', subtitle: 'Identity & Voice', mission: 'Craft naming, tone, positioning, and visuals.', stepId: 2, leftPct: 22, topPct: 66 },
  { id: 3, label: 'Business Case Bridge', subtitle: 'Strategy', mission: 'Define pricing, economics, and competitive plan.', stepId: 3, leftPct: 35, topPct: 57 },
  { id: 4, label: 'Preview Studio', subtitle: 'Live Preview', mission: 'Generate the first customer-facing experience.', stepId: 4, leftPct: 49, topPct: 48 },
  { id: 5, label: 'U.S. Setup Gate', subtitle: 'Compliance', mission: 'Complete setup checklist and readiness verification.', stepId: 5, leftPct: 61, topPct: 40 },
  { id: 6, label: 'Funding Mountain', subtitle: 'Capital Prep', mission: 'Build funding story, assumptions, and doc pack.', stepId: 6, leftPct: 74, topPct: 32 },
  { id: 7, label: 'Launch City', subtitle: 'Go Live', mission: 'Execute launch board, CRM, and service operations.', stepId: 7, leftPct: 85, topPct: 24 },
  { id: 8, label: 'Growth Command Center', subtitle: 'Scale', mission: 'Track KPI rhythm and optimize for recurring growth.', leftPct: 91, topPct: 14 },
]

const categoryByZone: Record<number, ModuleDefinition['category']> = {
  1: 'Business Creation',
  2: 'Brand',
  3: 'Strategy',
  4: 'Website & Content',
  5: 'Setup & Operations',
  6: 'Funding',
  7: 'Launch & Management',
  8: 'Launch & Management',
}

const listingByZone: Partial<Record<number, MarketplaceListing['category']>> = {
  1: 'Consulting',
  2: 'Branding',
  3: 'Consulting',
  4: 'Website',
  5: 'Business Setup',
  6: 'Funding Prep',
  7: 'Launch Support',
  8: 'Done-for-You Packages',
}

function stepStatus(step?: JourneyStepState): ZoneNodeData['status'] {
  if (!step) return 'locked'
  if (step.progress >= 100 || step.status === 'approved') return 'complete'
  if (step.progress > 0 || step.status === 'in_progress' || step.status === 'review') return 'active'
  return 'locked'
}

export default function LaunchRoadPage() {
  const [projectName, setProjectName] = useState(`${brand.brandName} Founder Project`)
  const [steps, setSteps] = useState<JourneyStepState[]>([])
  const [assets, setAssets] = useState<AssetRecord[]>([])
  const [reviews, setReviews] = useState<ReviewTicket[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [modules, setModules] = useState<ModuleDefinition[]>([])
  const [runs, setRuns] = useState<ModuleRun[]>([])
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [supportThreads, setSupportThreads] = useState<SupportThread[]>([])
  const [activeZone, setActiveZone] = useState<ZoneNodeData | null>(null)
  const [drawerSeedContent, setDrawerSeedContent] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const refresh = async () => {
    const [proj, s, a, r, m, runRes, act, mk, st] = await Promise.all([
      projectService.getActiveProject(),
      journeyService.getSteps(),
      assetService.listAssets(),
      reviewService.listTickets(),
      aiModuleService.listModules(),
      aiModuleService.getRecentRuns(),
      analyticsService.listActivity(),
      marketplaceService.listListings(),
      supportService.listThreads(),
    ])

    if (proj.success) setProjectName((proj.data as any).name)
    if (s.success) setSteps(s.data)
    if (a.success) setAssets(a.data)
    if (r.success) setReviews(r.data)
    if (m.success) setModules(m.data)
    if (runRes.success) setRuns(runRes.data)
    if (act.success) setActivity(act.data)
    if (mk.success) setListings(mk.data)
    if (st.success) setSupportThreads(st.data)
  }

  useEffect(() => { void refresh() }, [])

  const missionStep = useMemo(() => steps.find((s) => s.status === 'in_progress' || s.status === 'review') || steps.find((s) => s.progress < 100) || steps[steps.length - 1], [steps])

  const zones = useMemo<ZoneNodeData[]>(() => zoneBlueprint.map((z) => {
    const step = z.stepId ? steps.find((s) => s.id === z.stepId) : undefined
    const status = z.stepId ? stepStatus(step) : (steps.every((s) => s.progress >= 100) ? 'active' : 'locked')
    return { ...z, status }
  }), [steps])

  const progressPct = useMemo(() => {
    if (!steps.length) return 0
    return Math.round(steps.reduce((sum, step) => sum + step.progress, 0) / steps.length)
  }, [steps])

  const readinessPct = useMemo(() => Math.min(100, Math.round((progressPct * 0.62) + (assets.length * 5) + (runs.length * 1.2))), [progressPct, assets.length, runs.length])

  const activeZoneId = missionStep?.id ?? 1
  const activeZoneData = zones.find((z) => z.id === activeZoneId) || zones[0]

  const avatarPosition = useMemo(() => {
    if (!zones.length) return { left: 8, top: 82 }
    const pct = progressPct / 100
    const idx = Math.min(zones.length - 1, Math.floor(pct * (zones.length - 1)))
    const nextIdx = Math.min(zones.length - 1, idx + 1)
    const localT = (pct * (zones.length - 1)) - idx
    const current = zones[idx]
    const next = zones[nextIdx]
    return {
      left: current.leftPct + ((next.leftPct - current.leftPct) * localT),
      top: current.topPct + ((next.topPct - current.topPct) * localT),
    }
  }, [zones, progressPct])

  const stations = useMemo(() => {
    return zones.flatMap((zone) => {
      const cat = categoryByZone[zone.id]
      const scoped = modules.filter((m) => m.category === cat).slice(0, 2)
      return scoped.map((module, idx) => ({ zoneId: zone.id, label: `Station ${idx + 1}`, module }))
    })
  }, [zones, modules])

  const currentListing = useMemo(() => {
    const category = listingByZone[activeZoneId]
    if (!category) return undefined
    return listings.find((l) => l.category === category)
  }, [listings, activeZoneId])

  const pendingReviews = reviews.filter((r) => r.status === 'pending').length
  const openSupport = supportThreads.filter((s) => s.status !== 'resolved').length

  const onRunModule = async (module: ModuleDefinition) => {
    const res = await aiModuleService.runAIModule(module.id, `Run ${module.name} for ${activeZoneData.label}`)
    if (res.success) await refresh()
  }

  const onUsePowerup = async (listing: MarketplaceListing) => {
    await marketplaceService.requestListing(listing.id, `Support request from ${activeZoneData.label}`)
    await supportService.createSupportRequest(`Power-up request: ${listing.title}`, `Need this offer for ${activeZoneData.label}.`)
    await refresh()
  }

  return (
    <div className="space-y-4 overflow-x-hidden">
      <section className="lr-panel-premium lr-crimson-glow relative overflow-hidden p-4 md:p-5">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_80%_20%,rgba(181,18,27,0.22),transparent_42%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[1fr,auto] lg:items-end">
          <div>
            <p className="text-[11px] uppercase text-[var(--bs-gold)]">{brand.brandName} Launch Road</p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">{projectName}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--fsi-text-muted)]">
              Navigate the premium launch world from Raw Idea to Growth Command Center with AI guidance, checkpoints, and unlocks.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="lr-cockpit-panel px-3 py-2">
              <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">Launch</p>
              <p className="text-lg font-semibold">{progressPct}%</p>
            </div>
            <div className="lr-cockpit-panel px-3 py-2">
              <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">Ready</p>
              <p className="text-lg font-semibold">{readinessPct}%</p>
            </div>
            <div className="lr-cockpit-panel px-3 py-2">
              <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">Zone</p>
              <p className="text-lg font-semibold">{activeZoneId}</p>
            </div>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => { setActiveZone(activeZoneData); setDrawerSeedContent(''); setDrawerOpen(true) }}
            className="lr-mission-btn rounded-full px-4 py-2 text-sm"
          >
            Continue Mission
          </button>
          <Link to="/modules" className="rounded-full border border-[var(--fsi-border)] px-4 py-2 text-sm transition hover:border-[var(--bs-gold)]">Full AI Module Library</Link>
          <Link to="/assets" className="rounded-full border border-[var(--fsi-border)] px-4 py-2 text-sm transition hover:border-[var(--bs-gold)]">Open Asset Vault</Link>
          <Link to="/marketplace" className="rounded-full border border-[var(--fsi-border)] px-4 py-2 text-sm transition hover:border-[var(--bs-gold)]">Marketplace Power-Ups</Link>
        </div>
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[1.8fr,0.72fr]">
        <div className="space-y-3 min-w-0">
          <IsometricJourneyMap
            zones={zones}
            stations={stations}
            progressPct={progressPct}
            avatarLeftPct={avatarPosition.left}
            avatarTopPct={avatarPosition.top}
            activeZoneId={activeZoneId}
            onOpenZone={(zone) => { setActiveZone(zone); setDrawerSeedContent(''); setDrawerOpen(true) }}
            onRunModule={onRunModule}
          />
          <RewardAssetStrip assets={assets} onOpen={(asset) => {
            const fromStep = asset.id.match(/asset-(\d+)/)?.[1]
            const zone = zones.find((z) => String(z.stepId) === fromStep) || activeZoneData
            setActiveZone(zone)
            setDrawerSeedContent(asset.content)
            setDrawerOpen(true)
          }} />
        </div>

        <div className="space-y-3 min-w-0">
          <CurrentMissionPanel
            zoneLabel={activeZoneData.label}
            mission={activeZoneData.mission}
            nextAction={pendingReviews > 0 ? 'Resolve pending review gate to unlock faster movement.' : `Open ${activeZoneData.label} workspace and generate the next asset.`}
            progressPct={progressPct}
            readinessPct={readinessPct}
            onContinue={() => { setActiveZone(activeZoneData); setDrawerSeedContent(''); setDrawerOpen(true) }}
          />

          <div className="lr-cockpit-panel grid grid-cols-2 gap-2 p-3">
            <div className="rounded-lg border border-[var(--fsi-border)] bg-black/20 p-3">
              <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">AI CEO Brief</p>
              <p className="mt-1 text-sm">{runs.length} runs</p>
            </div>
            <div className="rounded-lg border border-[var(--fsi-border)] bg-black/20 p-3">
              <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">Activity</p>
              <p className="mt-1 text-sm">{activity.length} actions</p>
            </div>
            <div className="col-span-2 rounded-lg border border-[rgba(201,164,73,0.3)] bg-[rgba(201,164,73,0.07)] p-3">
              <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">Mission Support</p>
              <p className="mt-1 text-sm text-[var(--bs-gold-soft)]">{openSupport} open requests</p>
            </div>
          </div>

          <ReviewGatePanel reviews={reviews} />
          <ContextualPowerUpCard listing={currentListing} onUse={onUsePowerup} />
        </div>
      </div>

      <ZoneWorkspaceDrawer
        open={drawerOpen}
        zone={activeZone}
        step={activeZone?.stepId ? steps.find((s) => s.id === activeZone.stepId) : undefined}
        suggestedModule={stations.find((s) => s.zoneId === activeZone?.id)?.module}
        initialContent={drawerSeedContent}
        onClose={() => setDrawerOpen(false)}
        onRefresh={refresh}
      />
    </div>
  )
}
