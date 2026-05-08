import type { ModuleDefinition, JourneyStepState } from '@/types/domain'
import type { ZoneNodeData } from '@/components/launch-road/JourneyZoneNode'

export interface ZoneWorkspaceZone extends ZoneNodeData {}

export interface ZoneModuleStation {
  zoneId: number
  label: string
  module: ModuleDefinition
}

export interface LaunchRoadState {
  steps: JourneyStepState[]
  missionStep?: JourneyStepState
}
