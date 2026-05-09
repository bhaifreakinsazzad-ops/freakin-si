import type { CSSProperties } from 'react'
import type { ModuleDefinition } from '@/types/domain'
import { WandSparkles } from 'lucide-react'

interface ToolStationNodeProps {
  label: string
  zoneId: number
  stationIndex: number
  module: ModuleDefinition
  mobile?: boolean
  onRun: (module: ModuleDefinition) => void
}

export default function ToolStationNode({ label, zoneId, stationIndex, module, mobile = false, onRun }: ToolStationNodeProps) {
  const base = stationBase[zoneId] || { left: 50, top: 50 }
  const local = stationIndex % 2
  const desktopOffset = local === 0 ? { left: -3, top: -8 } : { left: 6, top: 6 }
  const style: CSSProperties = mobile
    ? { top: `${Math.min(94, 8 + ((zoneId - 1) * 11.5) + (local * 4.2))}%`, left: `${local === 0 ? 6 : 62}%` }
    : { left: `${base.left + desktopOffset.left}%`, top: `${base.top + desktopOffset.top}%` }

  return (
    <button
      onClick={() => onRun(module)}
      className={`lr-tool-station absolute z-10 px-2 py-1.5 text-left transition ${mobile ? 'w-[112px]' : 'w-[136px]'}`}
      style={style}
      title={`Run ${module.name}`}
      data-tool-station={module.id}
    >
      <div className="flex items-center gap-1.5">
        <span className="tool-station-icon inline-flex h-5 w-5 items-center justify-center rounded-md border border-[rgba(201,164,73,0.3)] bg-[rgba(201,164,73,0.1)] text-[var(--bs-gold-soft)]">
          <WandSparkles size={11} />
        </span>
        <p className="text-[9px] uppercase text-[var(--fsi-text-dim)]">{label}</p>
      </div>
      <p className="mt-1 truncate text-[11px] text-[var(--fsi-text-muted)]">{module.name}</p>
    </button>
  )
}

const stationBase: Record<number, { left: number; top: number }> = {
  1: { left: 12, top: 74 },
  2: { left: 23, top: 62 },
  3: { left: 36, top: 54 },
  4: { left: 49, top: 46 },
  5: { left: 61, top: 38 },
  6: { left: 73, top: 30 },
  7: { left: 84, top: 22 },
  8: { left: 88, top: 12 },
}
