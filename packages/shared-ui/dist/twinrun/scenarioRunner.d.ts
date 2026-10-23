export interface VegaEquivalentTarget {
    screenId: string;
    focusedElementId: string;
    playerState: 'PLAYING' | 'PAUSED' | 'IDLE' | 'UNMOUNTED';
    overlayState: 'CLOSED' | 'ASSIST_OPEN' | 'ASSIST_EXPLAINING';
    assertionDescription: string;
    nominalLatencyMs: number;
}
export interface CheckpointExecutionResult {
    checkpointId: string;
    stepNumber: number;
    name: string;
    status: 'UNTESTED' | 'RUNNING' | 'PASSED' | 'FAILED';
    latencyMs: number;
    fireOsState: {
        screenId: string;
        focusedElementId: string;
        playerState: string;
        overlayState: string;
    };
    vegaOsState: {
        screenId: string;
        focusedElementId: string;
        playerState: string;
        overlayState: string;
        verified: boolean;
    };
    assertionNote: string;
    timestamp: string;
}
export interface ScenarioAuditLog {
    id: string;
    timestamp: string;
    level: 'INFO' | 'PASS' | 'RUN' | 'WARN';
    checkpointStep?: number;
    message: string;
}
/**
 * Expected equivalent state targets for Vega OS under Kepler runtime execution
 */
export declare const VEGA_EQUIVALENT_TARGETS: Record<string, VegaEquivalentTarget>;
/**
 * Initializes baseline untested map for all 12 checkpoints
 */
export declare function getInitialCheckpointResults(): Record<string, CheckpointExecutionResult>;
/**
 * Executes verification test for a single checkpoint
 */
export declare function executeSingleCheckpointTest(checkpointId: string, speed?: 'NORMAL' | 'FAST'): Promise<CheckpointExecutionResult>;
//# sourceMappingURL=scenarioRunner.d.ts.map