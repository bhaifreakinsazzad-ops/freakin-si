interface CurrentMissionPanelProps {
  zoneLabel: string
  mission: string
  nextAction: string
  progressPct: number
  readinessPct: number
  onContinue: () => void
}

export default function CurrentMissionPanel({ zoneLabel, mission, nextAction, progressPct, readinessPct, onContinue }: CurrentMissionPanelProps) {
  return (
    <div className="lr-cockpit-panel p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase text-[var(--bs-gold)]">Mission Control</p>
          <p className="mt-1 text-sm font-semibold">{zoneLabel}</p>
        </div>
        <div className="grid grid-cols-2 gap-1 text-center">
          <div className="rounded-lg border border-[var(--fsi-border)] bg-black/20 px-2 py-1">
            <p className="text-[9px] uppercase text-[var(--fsi-text-dim)]">Road</p>
            <p className="text-sm font-semibold">{progressPct}%</p>
          </div>
          <div className="rounded-lg border border-[rgba(201,164,73,0.3)] bg-[rgba(201,164,73,0.07)] px-2 py-1">
            <p className="text-[9px] uppercase text-[var(--fsi-text-dim)]">Ready</p>
            <p className="text-sm font-semibold">{readinessPct}%</p>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs leading-5 text-[var(--fsi-text-muted)]">{mission}</p>
      <div className="mt-3 rounded-lg border border-[rgba(201,164,73,0.35)] bg-[rgba(201,164,73,0.08)] p-2">
        <p className="text-[10px] uppercase text-[var(--fsi-text-dim)]">Next Best Action</p>
        <p className="mt-1 text-xs text-[var(--bs-gold-soft)]">{nextAction}</p>
      </div>
      <button onClick={onContinue} className="lr-mission-btn mt-3 w-full rounded-lg px-3 py-2 text-xs">
        Continue To Current Zone
      </button>
    </div>
  )
}
