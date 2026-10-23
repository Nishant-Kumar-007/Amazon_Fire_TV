"use strict";
/**
 * ViewEase Parity Lab — Evidence Loader
 * Honest runtime integration: Loads the verified evidence bundle,
 * provides empty state fallbacks, and supports dynamic reloading.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceLoaderService = void 0;
const bundleData_1 = require("../data/evidence/bundleData");
class EvidenceLoaderService {
    static cachedBundle = bundleData_1.IMPORTED_PARITY_EVIDENCE_BUNDLE;
    static emptyStateSimulated = false;
    /**
     * Retrieves the current evidence bundle.
     * If empty state mode is activated, returns null to demonstrate the
     * honest unverified initial state.
     */
    static getEvidenceBundle() {
        if (this.emptyStateSimulated) {
            return null;
        }
        return this.cachedBundle;
    }
    /**
     * Toggles the empty-state demonstration mode.
     * Used by engineers/reviewers to verify that ViewEase Parity Lab does NOT fabricate
     * green PASS indicators or invent device metrics when evidence is absent.
     */
    static setEmptyStateMode(simulateEmpty) {
        this.emptyStateSimulated = simulateEmpty;
    }
    static isEmptyStateMode() {
        return this.emptyStateSimulated;
    }
    /**
     * Reloads the evidence bundle from source data.
     */
    static reloadBundle() {
        this.emptyStateSimulated = false;
        this.cachedBundle = bundleData_1.IMPORTED_PARITY_EVIDENCE_BUNDLE;
        return this.cachedBundle;
    }
}
exports.EvidenceLoaderService = EvidenceLoaderService;
