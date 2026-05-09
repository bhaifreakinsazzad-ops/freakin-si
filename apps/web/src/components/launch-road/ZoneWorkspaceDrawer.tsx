import { useEffect, useMemo, useState } from 'react'
import { Copy, Download, Save, Send, WandSparkles, X } from 'lucide-react'
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
      <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside className={`lr-drawer-surface absolute right-0 top-0 h-full w-full max-w-xl max-w-[min(100vw,36rem)] border-l border-[rgba(202,208,218,0.22)] p-4 transition-transform duration-300 overflow-y-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="lr-panel-premium p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-[var(--bs-gold)]">Zone Workspace</p>
              <h2 className="mt-1 text-xl font-semibold">{zone?.label ?? 'Select a zone'}</h2>
              <p className="mt-1 text-xs leading-5 text-[var(--fsi-text-muted)]">{zone?.mission ?? 'Choose a zone on the road to continue the mission.'}</p>
            </div>
            <button onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--fsi-border)] text-[var(--fsi-text-muted)] transition hover:border-[var(--bs-gold)] hover:text-white" aria-label="Close workspace">
              <X size={15} />
            </button>
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
          className="mt-4 min-h-[130px] w-full rounded-lg border border-[var(--fsi-border)] bg-black/35 p-3 text-sm outline-none transition focus:border-[var(--bs-gold)]"
        />

        <div className="sticky top-0 z-10 bg-[linear-gradient(180deg,rgba(8,8,11,0.98),rgba(8,8,11,0.8),transparent)] py-3">
          <div className="flex flex-wrap gap-2">
            <button disabled={disabled || loading} onClick={run} className="lr-mission-btn inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-50">
              <WandSparkles size={14} />
              {loading ? 'Generating...' : 'Generate / Regenerate'}
            </button>
            <button disabled={disabled} onClick={saveDraft} className="inline-flex items-center gap-2 rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm transition hover:border-[var(--bs-gold)] disabled:opacity-50">
              <Save size={14} />
              Save Draft
            </button>
            <button disabled={disabled} onClick={submit} className="inline-flex items-center gap-2 rounded-lg border border-[rgba(201,164,73,0.45)] bg-[rgba(201,164,73,0.12)] px-4 py-2 text-sm disabled:opacity-50">
              <Send size={14} />
              Submit Review
            </button>
            <button disabled={!ticketId} onClick={approve} className="rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm transition hover:border-[var(--bs-gold)] disabled:opacity-50">Approve</button>
            <button onClick={() => navigator.clipboard.writeText(output)} className="inline-flex items-center gap-2 rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm transition hover:border-[var(--bs-gold)]">
              <Copy size={14} />
              Copy
            </button>
            <button disabled={disabled || !zone?.stepId} onClick={async () => {
              if (!zone?.stepId) return
              await assetService.exportDocument(`asset-${zone.stepId}`)
            }} className="inline-flex items-center gap-2 rounded-lg border border-[var(--fsi-border)] px-4 py-2 text-sm transition hover:border-[var(--bs-gold)] disabled:opacity-50">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        <pre className="mt-1 max-h-[52vh] min-h-[220px] overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--fsi-border)] bg-black/30 p-3 text-xs leading-5 text-[var(--fsi-text-muted)]">{output || 'Generated output appears here.'}</pre>

        <div className="mt-3 lr-panel-premium p-3">
          <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">Next Action</p>
          <p className="mt-1 text-xs text-[var(--bs-gold-soft)]">{disabled ? 'Select an unlocked zone checkpoint to continue mission flow.' : 'Generate output, save draft, and submit review to advance this zone.'}</p>
        </div>
      </aside>
    </div>
  )
}
