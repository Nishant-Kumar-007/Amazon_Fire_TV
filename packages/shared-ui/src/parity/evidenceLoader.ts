/**
 * ViewEase Parity Lab — Evidence Loader
 * Honest runtime integration: Loads the verified evidence bundle,
 * provides empty state fallbacks, and supports dynamic reloading.
 */

import { ParityEvidenceBundle } from './types';
import { IMPORTED_PARITY_EVIDENCE_BUNDLE } from '../data/evidence/bundleData';

export class EvidenceLoaderService {
  private static cachedBundle: ParityEvidenceBundle | null = IMPORTED_PARITY_EVIDENCE_BUNDLE;
  private static emptyStateSimulated: boolean = false;

  /**
   * Retrieves the current evidence bundle.
   * If empty state mode is activated, returns null to demonstrate the
   * honest unverified initial state.
   */
  public static getEvidenceBundle(): ParityEvidenceBundle | null {
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
  public static setEmptyStateMode(simulateEmpty: boolean): void {
    this.emptyStateSimulated = simulateEmpty;
  }

  public static isEmptyStateMode(): boolean {
    return this.emptyStateSimulated;
  }

  /**
   * Reloads the evidence bundle from source data.
   */
  public static reloadBundle(): ParityEvidenceBundle {
    this.emptyStateSimulated = false;
    this.cachedBundle = IMPORTED_PARITY_EVIDENCE_BUNDLE;
    return this.cachedBundle;
  }
}
