import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Building2, CheckCircle2, CircleDot, FileText, Hammer, Landmark, Lightbulb, Lock, Monitor, Mountain, Rocket } from 'lucide-react'

export type ZoneStatus = 'locked' | 'active' | 'complete'

export interface ZoneNodeData {
  id: number
  label: string
  subtitle: string
  mission: string
  stepId?: number
  leftPct: number
  topPct: number
  status: ZoneStatus
}

interface JourneyZoneNodeProps {
  zone: ZoneNodeData
  mobile?: boolean
  onOpen: (zone: ZoneNodeData) => void
}

export default function JourneyZoneNode({ zone, mobile = false, onOpen }: JourneyZoneNodeProps) {
  const style: CSSProperties = mobile
    ? { top: `${zone.topPct}%` }
    : { left: `${zone.leftPct}%`, top: `${zone.topPct}%` }

  const badgeClass = zone.status === 'complete' ? 'complete' : zone.status === 'active' ? 'active' : 'locked'
  const progress = zone.status === 'complete' ? 100 : zone.status === 'active' ? 55 : 8
  const Icon = zoneIconById[zone.id] || CircleDot
  const ringStyle = {
    '--lr-ring-progress': `${progress}%`,
    '--lr-ring-color': zone.status === 'complete' ? '#5ec386' : zone.status === 'active' ? '#c9a449' : '#5a5f69',
  } as CSSProperties

  return (
    <button
      onClick={() => onOpen(zone)}
      className={`absolute z-10 lr-iso-node ${zone.status} px-3 py-2 text-left transition hover:scale-[1.02] hover:border-[var(--bs-gold)] ${mobile ? 'left-1/2 w-[78%] -translate-x-1/2' : 'w-[178px] -translate-x-1/2 -translate-y-1/2'}`}
      style={style}
    >
      {zone.status === 'locked' && <span className="lr-locked-overlay" />}
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`lr-zone-icon zone-icon-${zone.id}`} data-zone-icon={zone.label}>
            <Icon size={16} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">Zone {zone.id}</p>
            <p className="truncate text-sm font-semibold leading-tight">{zone.label}</p>
          </div>
        </div>
        <span className={`lr-status-badge ${badgeClass}`}>{zone.status}</span>
      </div>

      <div className={`relative mt-2 flex items-start gap-2 ${mobile ? 'hidden min-[430px]:flex' : ''}`}>
        <div className="lr-progress-ring h-8 w-8 shrink-0" style={ringStyle}>
          <span />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-[var(--fsi-text-muted)]">{zone.subtitle}</p>
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[var(--bs-gold-soft)]">{zone.mission}</p>
        </div>
      </div>

      <div className={mobile ? 'relative mt-2' : 'relative mt-2'}>
        <div className="h-1.5 overflow-hidden rounded-full bg-black/45">
          <div className={`h-1.5 rounded-full ${zone.status === 'complete' ? 'bg-[var(--bs-success)]' : zone.status === 'active' ? 'bg-[var(--bs-gold)]' : 'bg-[var(--fsi-text-dim)]'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={`relative mt-1.5 flex items-center gap-1.5 text-[10px] text-[var(--fsi-text-muted)] ${mobile ? 'sr-only min-[430px]:not-sr-only' : ''}`}>
        {zone.status === 'complete' && <CheckCircle2 size={11} className="text-[var(--bs-success)]" />}
        {zone.status === 'locked' && <Lock size={10} />}
        <span>{zone.status === 'complete' ? 'Checkpoint Cleared' : zone.status === 'active' ? 'Mission In Progress' : 'Future Checkpoint'}</span>
      </div>
    </button>
  )
}

const zoneIconById: Record<number, LucideIcon> = {
  1: Lightbulb,
  2: Hammer,
  3: FileText,
  4: Monitor,
  5: Landmark,
  6: Mountain,
  7: Rocket,
  8: Building2,
}
