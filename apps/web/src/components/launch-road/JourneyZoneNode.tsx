import type { CSSProperties } from 'react'
import { CheckCircle2, Lock, MapPin } from 'lucide-react'

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

  return (
    <button
      onClick={() => onOpen(zone)}
      className={`absolute z-10 lr-iso-node px-3 py-2 text-left transition hover:scale-[1.02] hover:border-[var(--bs-gold)] ${zone.status === 'active' ? 'lr-crimson-glow lr-metal-border' : ''} ${mobile ? 'left-1/2 -translate-x-1/2 w-[80%]' : 'w-[208px] -translate-x-1/2 -translate-y-1/2'}`}
      style={style}
    >
      {zone.status === 'locked' && <span className="lr-locked-overlay" />}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-[var(--bs-gold-soft)]" />
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--fsi-text-dim)]">Zone {zone.id}</p>
        </div>
        <span className={`lr-status-badge ${badgeClass}`}>{zone.status}</span>
      </div>

      <div className="relative mt-1.5">
        <p className="text-sm font-semibold leading-tight">{zone.label}</p>
        <p className="text-[11px] text-[var(--fsi-text-muted)] mt-0.5">{zone.subtitle}</p>
        <p className="text-[11px] text-[var(--bs-gold-soft)] mt-1.5 line-clamp-2">{zone.mission}</p>
      </div>

      <div className="relative mt-2">
        <div className="h-1.5 rounded-full bg-black/45 overflow-hidden">
          <div className={`h-1.5 rounded-full ${zone.status === 'complete' ? 'bg-[var(--bs-success)]' : zone.status === 'active' ? 'bg-[var(--bs-gold)]' : 'bg-[var(--fsi-text-dim)]'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="relative mt-1.5 flex items-center gap-1.5 text-[10px] text-[var(--fsi-text-muted)]">
        {zone.status === 'complete' && <CheckCircle2 size={11} className="text-[var(--bs-success)]" />}
        {zone.status === 'locked' && <Lock size={10} />}
        <span>{zone.status === 'complete' ? 'Checkpoint Cleared' : zone.status === 'active' ? 'Mission In Progress' : 'Future Checkpoint'}</span>
      </div>
    </button>
  )
}
