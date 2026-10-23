/**
 * ViewEase Parity Lab — Evidence Loader
 * Honest runtime integration: Loads the verified evidence bundle,
 * provides empty state fallbacks, and supports dynamic reloading.
 */
import { ParityEvidenceBundle } from './types';
export declare class EvidenceLoaderService {
    private static cachedBundle;
    private static emptyStateSimulated;
    /**
     * Retrieves the current evidence bundle.
     * If empty state mode is activated, returns null to demonstrate the
     * honest unverified initial state.
     */
    static getEvidenceBundle(): ParityEvidenceBundle | null;
    /**
     * Toggles the empty-state demonstration mode.
     * Used by engineers/reviewers to verify that ViewEase Parity Lab does NOT fabricate
     * green PASS indicators or invent device metrics when evidence is absent.
     */
    static setEmptyStateMode(simulateEmpty: boolean): void;
    static isEmptyStateMode(): boolean;
    /**
     * Reloads the evidence bundle from source data.
     */
    static reloadBundle(): ParityEvidenceBundle;
}
//# sourceMappingURL=evidenceLoader.d.ts.map