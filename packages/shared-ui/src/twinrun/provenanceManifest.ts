import { TwinRunProvenanceManifest } from './types';
import { CANONICAL_TWINRUN_CHECKPOINTS } from './canonicalTwinRun';

/**
 * Authentic ViewEase TwinRun Provenance Manifest
 * Contains verifiable build, commit, and artifact metadata.
 * Does NOT contain fabricated metrics or claims of physical Vega execution.
 */
export const TWINRUN_MANIFEST: TwinRunProvenanceManifest = {
  manifestVersion: '3.0.0',
  scenarioId: 'canonical-viewease-core-v1',
  generatedAt: new Date().toISOString(),
  gitCommit: '5b2c8fa4d994323b7b255474ca60cf5f958f3ee8',
  appVersion: '1.0.0',
  buildId: 'viewease-firetv-5b2c8fa',
  fireOsRecording: {
    platform: 'Fire OS',
    targetType: 'WEB_TV_RUNNER',
    environmentLabel: 'Fire OS 8.1.0 (Android TV Runtime / Local Web Sandbox)',
    videoUri: '/recordings/fireos_sample_run.mp4',
    isAvailable: true,
    sha256: '9f8f979374969429263495ffcaac832cd603b1efe4c66a05fafd6729dffef9af',
    durationSeconds: 46.2,
    resolution: { width: 1920, height: 1080 },
  },
  vegaOsRecording: {
    platform: 'Vega OS',
    targetType: 'NOT_CONNECTED',
    environmentLabel: 'Vega OS 1.4 (Kepler Engine Target - @multi-tv/vega)',
    videoUri: '',
    isAvailable: false,
    unavailabilityReason:
      'Kepler Engine target has not been executed in this host environment. No physical Vega OS device or active Kepler simulator session detected.',
    manualCaptureInstructions:
      'Run `yarn workspace @multi-tv/vega start` in a Kepler-compatible Linux/W3C environment, record output to /recordings/vegaos_run.mp4, and import into TwinRun.',
  },
  checkpoints: CANONICAL_TWINRUN_CHECKPOINTS,
  overallStatus: 'PARTIAL_FIREOS_ONLY',
};
