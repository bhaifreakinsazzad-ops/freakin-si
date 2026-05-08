import type { CSSProperties } from 'react'
import type { ModuleDefinition } from '@/types/domain'
import { Sparkles } from 'lucide-react'

interface ToolStationNodeProps {
  label: string
  zoneId: number
  stationIndex: number
  module: ModuleDefinition
  mobile?: boolean
  onRun: (module: ModuleDefinition) => void
}

export default function ToolStationNode({ label, zoneId, stationIndex, module, mobile = false, onRun }: ToolStationNodeProps) {
  const left = 8 + ((zoneId - 1) * 11.4) + (stationIndex * 4)
  const top = 14 + ((zoneId - 1) * 9.6) + (stationIndex * 1.6)
  const style: CSSProperties = mobile
    ? { top: `${Math.min(92, top)}%`, left: `${stationIndex % 2 === 0 ? 14 : 70}%` }
    : { left: `${left}%`, top: `${top}%` }

  return (
    <button
      onClick={() => onRun(module)}
      className="absolute z-10 rounded-lg lr-panel-premium border border-[rgba(201,164,73,0.35)] px-2 py-1.5 text-left hover:border-[var(--bs-gold)] hover:bg-[rgba(22,25,33,0.92)] transition max-w-[148px]"
      style={style}
      title={`Run ${module.name}`}
    >
      <div className="flex items-center gap-1.5">
        <Sparkles size={11} className="text-[var(--bs-gold-soft)]" />
        <p className="text-[9px] uppercase tracking-[0.14em] text-[var(--fsi-text-dim)]">{label}</p>
      </div>
      <p className="text-[11px] text-[var(--fsi-text-muted)] max-w-[130px] truncate mt-0.5">{module.name}</p>
    </button>
  )
}
