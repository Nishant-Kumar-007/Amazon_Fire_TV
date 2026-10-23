/**
 * ViewEase TwinRun — TypeScript Type Definitions
 * Verifiable Cross-Platform Evidence Theatre & Interaction Telemetry
 */

export type RunStatus = 'VERIFIED' | 'AWAITING_CAPTURE' | 'UNTESTED' | 'FAILED' | 'MANUAL';

export interface CheckpointTelemetry {
  id: string;
  stepNumber: number;
  name: string;
  timestampSeconds: number;
  scriptedAction: string;
  manualInstruction?: string;
  fireOsState: {
    screenId: string;
    focusedElementId: string;
    playerState: 'PLAYING' | 'PAUSED' | 'IDLE' | 'UNMOUNTED';
    overlayState: 'CLOSED' | 'ASSIST_OPEN' | 'ASSIST_EXPLAINING';
    verified: boolean;
  };
  vegaOsState: {
    screenId?: string;
    focusedElementId?: string;
    playerState?: 'PLAYING' | 'PAUSED' | 'IDLE' | 'UNMOUNTED';
    overlayState?: 'CLOSED' | 'ASSIST_OPEN' | 'ASSIST_EXPLAINING';
    verified: boolean;
    note?: string;
  };
}

export interface PlatformEvidenceRecording {
  platform: 'Fire OS' | 'Vega OS';
  targetType: 'PHYSICAL_DEVICE' | 'SIMULATOR' | 'WEB_TV_RUNNER' | 'NOT_CONNECTED';
  environmentLabel: string;
  videoUri: string;
  isAvailable: boolean;
  sha256?: string;
  durationSeconds?: number;
  resolution?: { width: number; height: number };
  unavailabilityReason?: string;
  manualCaptureInstructions?: string;
}

export interface TwinRunProvenanceManifest {
  manifestVersion: string;
  scenarioId: 'canonical-viewease-core-v1';
  generatedAt: string;
  gitCommit: string;
  appVersion: string;
  buildId: string;
  fireOsRecording: PlatformEvidenceRecording;
  vegaOsRecording: PlatformEvidenceRecording;
  checkpoints: CheckpointTelemetry[];
  overallStatus: 'FULL_VERIFIED' | 'PARTIAL_FIREOS_ONLY' | 'AWAITING_ALL_EVIDENCE';
}
