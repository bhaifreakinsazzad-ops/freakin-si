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
  const mobileZones = zones.map((z, i) => ({ ...z, topPct: 4 + (i * 11.5) }))

  return (
    <div className="lr-panel-premium p-3">
      <div className="launch-road-map-bg lr-map-stage hidden md:block relative h-[610px] overflow-hidden rounded-lg lr-metal-border">
        <div className="absolute left-[5%] top-[70%] h-28 w-56 -skew-x-12 rounded-lg border border-[rgba(201,164,73,0.16)] bg-[rgba(201,164,73,0.04)]" />
        <div className="absolute left-[38%] top-[42%] h-32 w-72 -skew-x-12 rounded-lg border border-[rgba(181,18,27,0.18)] bg-[rgba(181,18,27,0.05)]" />
        <div className="absolute left-[70%] top-[15%] h-28 w-52 -skew-x-12 rounded-lg border border-[rgba(202,208,218,0.14)] bg-[rgba(202,208,218,0.035)]" />

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <filter id="lrRoadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M8,82 C16,72 25,69 34,60 C43,51 50,49 60,42 C70,35 78,29 92,15" fill="none" stroke="rgba(4,5,8,0.82)" strokeWidth="8.2" strokeLinecap="round" />
          <path d="M8,82 C16,72 25,69 34,60 C43,51 50,49 60,42 C70,35 78,29 92,15" fill="none" stroke="rgba(74,79,90,0.72)" strokeWidth="5.8" strokeLinecap="round" />
          <path d="M8,82 C16,72 25,69 34,60 C43,51 50,49 60,42 C70,35 78,29 92,15" fill="none" stroke="rgba(181,18,27,0.82)" strokeWidth="2.2" strokeLinecap="round" filter="url(#lrRoadGlow)" />
          <path d="M8,82 C16,72 25,69 34,60 C43,51 50,49 60,42 C70,35 78,29 92,15" fill="none" stroke="rgba(201,164,73,0.7)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 3" />
        </svg>

        {zones.map((zone) => <JourneyZoneNode key={zone.id} zone={zone} onOpen={onOpenZone} />)}
        {stations.map((station, idx) => (
          <ToolStationNode key={`${station.zoneId}-${station.module.id}`} zoneId={station.zoneId} label={station.label} module={station.module} stationIndex={idx} onRun={onRunModule} />
        ))}

        <SheepAvatarProgress leftPct={avatarLeftPct} topPct={avatarTopPct} progressPct={progressPct} />
        <div className="absolute bottom-3 right-3 rounded-lg border border-[var(--fsi-border)] bg-[rgba(10,10,14,0.82)] px-3 py-2 text-[11px] text-[var(--fsi-text-muted)]">Current Zone: {activeZoneId}</div>
      </div>

      <div className="launch-road-map-bg lr-mobile-path md:hidden relative h-[1280px] overflow-y-auto overflow-x-hidden rounded-lg lr-metal-border">
        <div className="absolute left-1/2 top-[5%] bottom-[3%] w-[3px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,rgba(181,18,27,0.86),rgba(201,164,73,0.64))] shadow-[0_0_22px_rgba(181,18,27,0.32)]" />
        {mobileZones.map((zone) => <JourneyZoneNode key={`m-${zone.id}`} zone={zone} mobile onOpen={onOpenZone} />)}
        {stations.slice(0, 8).map((station, idx) => (
          <ToolStationNode key={`m-${station.zoneId}-${station.module.id}`} zoneId={station.zoneId} label={station.label} module={station.module} stationIndex={idx} mobile onRun={onRunModule} />
        ))}
        <SheepAvatarProgress leftPct={50} topPct={10 + ((progressPct / 100) * 78)} progressPct={progressPct} mobile />
      </div>
    </div>
  )
}
