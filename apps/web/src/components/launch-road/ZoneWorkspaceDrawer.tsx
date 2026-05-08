import { useEffect, useMemo, useState } from 'react'
import { aiModuleService, assetService, journeyService, reviewService } from '@/services'
import type { JourneyStepState, ModuleDefinition } from '@/types/domain'
import type { ZoneWorkspaceZone } from '@/types/launchRoad'

interface ZoneWorkspaceDrawerProps {
  open: boolean
  zone: ZoneWorkspaceZone | null
  step?: JourneyStepState
  suggestedModule?: ModuleDefinition
  initialContent?: string
  onClose: () => void
  onRefresh: () => Promise<void>
}

const typeByStep: Record<number, 'document' | 'brand' | 'business_case' | 'website' | 'setup' | 'funding' | 'launch'> = {
  1: 'document',
  2: 'brand',
  3: 'business_case',
  4: 'website',
  5: 'setup',
  6: 'funding',
  7: 'launch',
}

export default function ZoneWorkspaceDrawer({ open, zone, step, suggestedModule, initialContent, onClose, onRefresh }: ZoneWorkspaceDrawerProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticketId, setTicketId] = useState('')

  const disabled = !zone || !zone.stepId

  const moduleId = useMemo(() => {
    if (suggestedModule?.id) return suggestedModule.id
    const sid = zone?.stepId || 1
    if (sid === 1) return '1'
    if (sid === 2) return '10'
    if (sid === 3) return '15'
    if (sid === 4) return '22'
    if (sid === 5) return '31'
    if (sid === 6) return '39'
    return '46'
  }, [zone, suggestedModule])

  useEffect(() => {
    setInput(initialContent || '')
    setOutput(initialContent || '')
    setTicketId('')
  }, [zone?.id, initialContent])

  const run = async () => {
    if (disabled) return
    setLoading(true)
    const res = await aiModuleService.runAIModule(moduleId, input || `Generate ${zone.label} output for the founder.`)
    if (res.success) {
      setOutput(res.data.output)
      if (zone.stepId) await journeyService.updateStepProgress(zone.stepId, Math.min(100, (step?.progress ?? 0) + 15))
      await onRefresh()
    }
    setLoading(false)
  }

  const saveDraft = async () => {
    if (disabled || !zone?.stepId) return
    await assetService.saveAssetDraft({
      id: `asset-${zone.stepId}`,
      projectId: 'proj-1',
      title: `${zone.label} Reward`,
      type: typeByStep[zone.stepId],
      content: output || input,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    })
    await onRefresh()
  }

  const submit = async () => {
    if (disabled || !zone?.stepId) return
    const res = await reviewService.submitForReview(`asset-${zone.stepId}`, zone.stepId)
    if (res.success) setTicketId(res.data.id)
    await journeyService.updateStepProgress(zone.stepId, 100)
    await onRefresh()
  }

  const approve = async () => {
    if (!ticketId || disabled || !zone?.stepId) return
    await reviewService.approveAsset(ticketId, 'Approved from launch road checkpoint')
    await journeyService.updateStepProgress(zone.stepId, 100)
    await onRefresh()
  }

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-xl border-l border-[var(--fsi-border)] bg-[var(--fsi-void)] p-4 transition-transform duration-300 overflow-y-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="lr-panel-premium p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--bs-gold)]">Zone Workspace</p>
              <h2 className="text-xl font-semibold mt-1">{zone?.label ?? 'Select a zone'}</h2>
              <p className="text-xs text-[var(--fsi-text-muted)] mt-1">{zone?.mission ?? 'Choose a zone on the road to continue the mission.'}</p>
            </div>
            <button onClick={onClose} className="rounded-lg border border-[var(--fsi-border)] px-3 py-1.5 text-xs hover:border-[var(--bs-gold)] transition">Close</button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-[var(--fsi-border)] bg-black/20 p-2">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--fsi-text-dim)]">Progress</p>
              <p className="text-sm font-semibold mt-1">{step?.progress ?? 0}%</p>
            </div>
            <div className="rounded-lg border border-[var(--fsi-border)] bg-black/20 p-2">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--fsi-text-dim)]">Status</p>
              <p className="text-sm font-semibold mt-1">{step?.status?.replace('_', ' ') ?? 'locked'}</p>
            </div>
            <div className="rounded-lg border border-[var(--fsi-border)] bg-black/20 p-2">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--fsi-text-dim)]">Review</p>
              <p className="text-sm font-semibold mt-1">{step?.reviewState?.replace('_', ' ') ?? 'none'}</p>
            </div>
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add mission context, constraints, goals, and inputs..."
          className="w-full min-h-[130px] rounded-xl mt-4 bg-black/30 border border-[var(--fsi-border)] p-3 text-sm"
        />

        <div className="sticky top-0 z-10 py-3 bg-[linear-gradient(180deg,rgba(8,8,11,0.96),rgba(8,8,11,0.7),transparent)]">
          <div className="flex flex-wrap gap-2">
            <button disabled={disabled || loading} onClick={run} className="lr-mission-btn rounded-lg px-4 py-2 text-sm disabled:opacity-50">{loading ? 'Generating...' : 'Generate / Regenerate'}</button>
            <button disabled={disabled} onClick={saveDraft} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm hover:border-[var(--bs-gold)] transition">Save Draft</button>
            <button disabled={disabled} onClick={submit} className="rounded-lg border border-[rgba(201,164,73,0.45)] bg-[rgba(201,164,73,0.12)] px-4 py-2 text-sm">Submit Review</button>
            <button disabled={!ticketId} onClick={approve} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm hover:border-[var(--bs-gold)] transition">Approve</button>
            <button onClick={() => navigator.clipboard.writeText(output)} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm hover:border-[var(--bs-gold)] transition">Copy</button>
            <button disabled={disabled || !zone?.stepId} onClick={async () => {
              if (!zone?.stepId) return
              await assetService.exportDocument(`asset-${zone.stepId}`)
            }} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm hover:border-[var(--bs-gold)] transition">Export</button>
          </div>
        </div>

        <pre className="whitespace-pre-wrap rounded-xl mt-1 bg-black/25 border border-[var(--fsi-border)] p-3 text-xs text-[var(--fsi-text-muted)] min-h-[220px] max-h-[52vh] overflow-auto">{output || 'Generated output appears here.'}</pre>

        <div className="mt-3 lr-panel-premium p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--fsi-text-dim)]">Next Action</p>
          <p className="text-xs text-[var(--bs-gold-soft)] mt-1">{disabled ? 'Select an unlocked zone checkpoint to continue mission flow.' : 'Generate output, save draft, and submit review to advance this zone.'}</p>
        </div>
      </aside>
    </div>
  )
}
