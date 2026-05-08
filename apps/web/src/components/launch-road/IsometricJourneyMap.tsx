import JourneyZoneNode, { type ZoneNodeData } from '@/components/launch-road/JourneyZoneNode'
import SheepAvatarProgress from '@/components/launch-road/SheepAvatarProgress'
import ToolStationNode from '@/components/launch-road/ToolStationNode'
import type { ModuleDefinition } from '@/types/domain'

interface IsometricJourneyMapProps {
  zones: ZoneNodeData[]
  stations: Array<{ zoneId: number; label: string; module: ModuleDefinition }>
  progressPct: number
  avatarLeftPct: number
  avatarTopPct: number
  activeZoneId: number
  onOpenZone: (zone: ZoneNodeData) => void
  onRunModule: (module: ModuleDefinition) => void
}

export default function IsometricJourneyMap({
  zones,
  stations,
  progressPct,
  avatarLeftPct,
  avatarTopPct,
  activeZoneId,
  onOpenZone,
  onRunModule,
}: IsometricJourneyMapProps) {
  const mobileZones = zones.map((z, i) => ({ ...z, topPct: 8 + (i * 11) }))

  return (
    <div className="lr-panel-premium p-3">
      <div className="hidden md:block relative h-[560px] overflow-hidden rounded-xl lr-metal-border bg-[radial-gradient(85%_130%_at_50%_2%,rgba(181,18,27,0.22),rgba(12,15,21,0.96))]">
        <div className="absolute inset-0 opacity-45" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(201,164,73,0.13),transparent_35%)]" />

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path d="M7,84 C17,73 24,72 33,62 C42,52 49,51 59,44 C68,37 76,32 93,21" fill="none" stroke="rgba(71,74,84,0.82)" strokeWidth="4.3" strokeLinecap="round" />
          <path d="M7,84 C17,73 24,72 33,62 C42,52 49,51 59,44 C68,37 76,32 93,21" fill="none" stroke="rgba(201,164,73,0.62)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 1" />
          <path d="M7,84 C17,73 24,72 33,62 C42,52 49,51 59,44 C68,37 76,32 93,21" fill="none" stroke="rgba(181,18,27,0.52)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>

        {zones.map((zone) => <JourneyZoneNode key={zone.id} zone={zone} onOpen={onOpenZone} />)}
        {stations.map((station, idx) => (
          <ToolStationNode key={`${station.zoneId}-${station.module.id}`} zoneId={station.zoneId} label={station.label} module={station.module} stationIndex={idx % 2} onRun={onRunModule} />
        ))}

        <SheepAvatarProgress leftPct={avatarLeftPct} topPct={avatarTopPct} progressPct={progressPct} />
        <div className="absolute bottom-3 right-3 rounded-lg border border-[var(--fsi-border)] bg-[rgba(10,10,14,0.8)] px-3 py-2 text-[11px] text-[var(--fsi-text-muted)]">Current Zone: {activeZoneId}</div>
      </div>

      <div className="md:hidden relative h-[640px] overflow-y-auto overflow-x-hidden rounded-xl lr-metal-border bg-[radial-gradient(80%_120%_at_50%_0%,rgba(181,18,27,0.2),rgba(15,18,22,0.95))]">
        <div className="absolute left-1/2 -translate-x-1/2 top-[5%] bottom-[4%] w-[2px] bg-[linear-gradient(180deg,rgba(181,18,27,0.72),rgba(201,164,73,0.58))]" />
        {mobileZones.map((zone) => <JourneyZoneNode key={`m-${zone.id}`} zone={zone} mobile onOpen={onOpenZone} />)}
        {stations.slice(0, 8).map((station, idx) => (
          <ToolStationNode key={`m-${station.zoneId}-${station.module.id}`} zoneId={station.zoneId} label={station.label} module={station.module} stationIndex={idx} mobile onRun={onRunModule} />
        ))}
        <SheepAvatarProgress leftPct={50} topPct={10 + ((progressPct / 100) * 78)} progressPct={progressPct} mobile />
      </div>
    </div>
  )
}
