interface CurrentMissionPanelProps {
  zoneLabel: string
  mission: string
  nextAction: string
  onContinue: () => void
}

export default function CurrentMissionPanel({ zoneLabel, mission, nextAction, onContinue }: CurrentMissionPanelProps) {
  return (
    <div className="lr-panel-premium p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--bs-gold)]">Current Mission</p>
      <p className="text-sm font-semibold mt-1">{zoneLabel}</p>
      <p className="text-xs text-[var(--fsi-text-muted)] mt-1">{mission}</p>
      <div className="mt-3 rounded-lg border border-[rgba(201,164,73,0.35)] bg-[rgba(201,164,73,0.08)] p-2">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--fsi-text-dim)]">Next Best Action</p>
        <p className="text-xs text-[var(--bs-gold-soft)] mt-1">{nextAction}</p>
      </div>
      <button onClick={onContinue} className="lr-mission-btn mt-3 w-full rounded-lg px-3 py-2 text-xs">
        Continue To Current Zone
      </button>
    </div>
  )
}
