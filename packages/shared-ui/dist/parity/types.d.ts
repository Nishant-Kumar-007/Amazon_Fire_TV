/**
 * ViewEase Parity Lab — TypeScript Type Definitions
 * Cross-Platform Evidence, Checkpoints & Visual Comparison Models
 */
export type CheckpointStatus = 'CAPTURED' | 'PASSED' | 'FAILED' | 'MANUALLY_VERIFIED' | 'UNTESTED' | 'MISSING';
export type TargetType = 'PHYSICAL_DEVICE' | 'SIMULATOR' | 'HEADLESS_RUNNER' | 'NOT_CONNECTED';
export type CheckpointId = 'cp-01-launch' | 'cp-02-home' | 'cp-03-featured' | 'cp-04-details' | 'cp-05-video-start' | 'cp-06-video-paused' | 'cp-07-assist-open' | 'cp-08-assist-explain' | 'cp-09-assist-close' | 'cp-10-playback-preserved' | 'cp-11-focus-restored' | 'cp-12-return-home';
export interface SemanticState {
    screenId: string;
    focusedElementId: string;
    playerState?: 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'IDLE' | 'UNMOUNTED';
    overlayState?: 'CLOSED' | 'ASSIST_OPEN' | 'ASSIST_EXPLAINING' | 'VIEW_ALL_MODAL';
    playbackTimestamp?: number;
    restoredFocusTarget?: string;
}
export interface CheckpointDefinition {
    id: CheckpointId;
    stepNumber: number;
    name: string;
    description: string;
    expectedSemanticState: SemanticState;
    scriptedAction: string;
    manualVerificationInstruction?: string;
}
export interface CheckpointCapture {
    checkpointId: CheckpointId;
    status: CheckpointStatus;
    timestamp: string;
    screenshotUri?: string;
    screenshotDimensions?: {
        width: number;
        height: number;
    };
    sha256?: string;
    scriptedInputs: string[];
    observedSemanticState: SemanticState;
    notes?: string;
    error?: string;
}
export interface PlatformRunEvidence {
    platformName: 'Fire OS' | 'Vega OS';
    targetType: TargetType;
    deviceOrSimulator: string;
    osVersion: string;
    appVersion: string;
    buildId: string;
    commitHash: string;
    captureMethod: string;
    runTimestamp: string;
    screenRecordingUri?: string;
    isAvailable: boolean;
    unavailabilityReason?: string;
    checkpoints: Record<CheckpointId, CheckpointCapture>;
}
export interface VisualComparisonResult {
    checkpointId: CheckpointId;
    imageSimilarityPercent: number;
    rmse: number;
    pixelMismatchCount: number;
    behavioralEquivalence: 'EQUIVALENT' | 'DIVERGENT' | 'UNVERIFIED';
    behavioralNotes: string;
    heatmapUri?: string;
}
export interface ParityEvidenceBundle {
    scenarioId: 'canonical-viewease-core-v1';
    bundleVersion: string;
    generatedAt: string;
    gitCommit: string;
    fireOsRun: PlatformRunEvidence;
    vegaOsRun: PlatformRunEvidence;
    comparisons: Record<CheckpointId, VisualComparisonResult>;
    summary: {
        totalCheckpoints: number;
        capturedCount: number;
        passedCount: number;
        failedCount: number;
        manualCount: number;
        missingCount: number;
        averageSimilarity: number;
        overallEquivalence: 'EQUIVALENT' | 'PARTIAL' | 'DIVERGENT' | 'UNTESTED';
    };
}
//# sourceMappingURL=types.d.ts.map