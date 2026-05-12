import { useEffect, useMemo, useState } from 'react'
import { aiModuleService, assetService, journeyService, reviewService } from '@/services'
import type { AssetRecord, JourneyStepState } from '@/types/domain'

const stepInputLabels: Record<number, string> = {
  1: 'Raw idea and market context',
  2: 'Brand vibe, tone, colors, competitors',
  3: 'Offer structure, pricing and roadmap',
  4: 'Landing copy, FAQ, CTA and content plan',
  5: 'U.S. setup checklist and docs',
  6: 'Funding assumptions and projection',
  7: 'Launch board, CRM and KPI cadence',
}

export default function JourneyPage() {
  const [steps, setSteps] = useState<JourneyStepState[]>([])
  const [active, setActive] = useState<number>(1)
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [draftAssets, setDraftAssets] = useState<AssetRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [lastTicketId, setLastTicketId] = useState('')

  useEffect(() => {
    ;(async () => {
      const [s, a] = await Promise.all([journeyService.getSteps(), assetService.listAssets()])
      if (s.success) setSteps(s.data)
      if (a.success) setDraftAssets(a.data)
    })()
  }, [])

  const current = useMemo(() => steps.find((s) => s.id === active), [steps, active])

  const refreshSteps = async () => {
    const updated = await journeyService.getSteps()
    if (updated.success) setSteps(updated.data)
  }

  const generate = async () => {
    setLoading(true)
    const mapper: Record<number, (input: string) => Promise<any>> = {
      1: aiModuleService.generateIdeaStrategy,
      2: aiModuleService.generateBrandKit,
      3: aiModuleService.generateBusinessCase,
      4: aiModuleService.generateWebsitePreview,
      5: aiModuleService.generateSetupChecklist,
      6: aiModuleService.generateFundingPrep,
      7: aiModuleService.generateLaunchPlan,
    }
    const fn = mapper[active]
    const run = await fn(prompt || `Generate ${current?.title} output for project.`)
    if (run.success) {
      setOutput(run.data.output)
      await journeyService.updateStepProgress(active, Math.min(100, (current?.progress ?? 0) + 18))
      await refreshSteps()
    }
    setLoading(false)
  }

  const saveDraft = async () => {
    const asset: AssetRecord = {
      id: `asset-${active}`,
      projectId: 'proj-1',
      title: `${current?.title} Draft`,
      type: active === 2 ? 'brand' : active === 3 ? 'business_case' : active === 4 ? 'website' : active === 5 ? 'setup' : active === 6 ? 'funding' : active === 7 ? 'launch' : 'document',
      content: output || prompt,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    }
    await assetService.saveAssetDraft(asset)
    const res = await assetService.listAssets()
    if (res.success) setDraftAssets(res.data)
  }

  const submitReview = async () => {
    const r = await reviewService.submitForReview(`asset-${active}`, active)
    if (r.success) setLastTicketId(r.data.id)
    await journeyService.updateStepProgress(active, 100)
    await refreshSteps()
  }

  const approve = async () => {
    if (!lastTicketId) return
    await reviewService.approveAsset(lastTicketId, 'Approved from workspace')
    await journeyService.updateStepProgress(active, 100)
    await refreshSteps()
  }

  const reject = async () => {
    if (!lastTicketId) return
    await reviewService.rejectAsset(lastTicketId, 'Needs revision')
    await journeyService.updateStepProgress(active, Math.max(0, (current?.progress ?? 0) - 20))
    await refreshSteps()
  }

  const nextStep = () => setActive((v) => Math.min(7, v + 1))

  return (
    <div className="grid xl:grid-cols-[340px,1fr] gap-4">
      <aside className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-3">
        <h2 className="text-sm font-semibold px-2 py-1">My 7-Step Journey</h2>
        <div className="space-y-2 mt-2">
          {steps.map((step) => (
            <button key={step.id} onClick={() => setActive(step.id)} className={`w-full text-left rounded-xl border p-3 transition ${active === step.id ? 'border-[var(--bs-gold)] bg-[rgba(201,164,73,0.08)]' : 'border-[var(--fsi-border)]'}`}>
              <p className="text-sm font-medium">{step.id}. {step.title}</p>
              <p className="text-xs text-[var(--fsi-text-muted)] mt-1">{step.description}</p>
              <div className="h-1.5 bg-black/40 rounded-full mt-2"><div className="h-1.5 rounded-full bg-[var(--bs-red)]" style={{ width: `${step.progress}%` }} /></div>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-2xl border border-[var(--fsi-border)] bg-[var(--fsi-surface)] p-4">
        <h1 className="text-xl font-semibold">{current?.title}</h1>
        <p className="text-sm text-[var(--fsi-text-muted)] mt-1">{stepInputLabels[active]}</p>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full min-h-[110px] rounded-xl mt-4 bg-black/30 border border-[var(--fsi-border)] p-3 text-sm" placeholder="Enter guided input, context, and constraints..." />
        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={generate} disabled={loading} className="rounded-lg bg-[var(--bs-red)] px-4 py-2 text-sm font-semibold disabled:opacity-60">{loading ? 'Generating...' : 'Generate / Regenerate'}</button>
          <button onClick={saveDraft} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Save Draft</button>
          <button onClick={submitReview} className="rounded-lg border border-[rgba(201,164,73,0.5)] bg-[rgba(201,164,73,0.12)] px-4 py-2 text-sm">Submit for Review</button>
          <button onClick={approve} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Approve</button>
          <button onClick={reject} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Reject</button>
          <button onClick={() => navigator.clipboard.writeText(output)} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Copy Output</button>
          <button onClick={async () => { await assetService.exportDocument(`asset-${active}`) }} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Download/Export</button>
          <button onClick={nextStep} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm">Next Step</button>
        </div>

        <div className="mt-4 grid lg:grid-cols-2 gap-4">
          <article className="rounded-xl border border-[var(--fsi-border)] bg-black/20 p-3">
            <h3 className="text-sm font-medium">AI Output Preview</h3>
            <pre className="whitespace-pre-wrap text-xs text-[var(--fsi-text-muted)] mt-2">{output || 'No output yet. Generate to see structured results.'}</pre>
          </article>
          <article className="rounded-xl border border-[var(--fsi-border)] bg-black/20 p-3">
            <h3 className="text-sm font-medium">Version / Draft History</h3>
            <div className="mt-2 space-y-2 text-xs">
              {draftAssets.slice(0, 6).map((a) => <div key={a.id} className="rounded-lg border border-[var(--fsi-border)] p-2"><p className="font-medium">{a.title}</p><p className="text-[var(--fsi-text-muted)]">{a.status} • {new Date(a.updatedAt).toLocaleString()}</p></div>)}
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
