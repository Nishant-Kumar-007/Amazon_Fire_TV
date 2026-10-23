/**
 * ViewEase Parity Lab — Visual & Behavioral Comparison Engine
 * Computes reproducible image similarity metrics, difference heatmaps,
 * and behavioral equivalence across Fire OS and Vega OS runs.
 */
import { CheckpointCapture, VisualComparisonResult } from './types';
export interface ComparisonConfig {
    /** Color difference threshold (0-255 per channel or 0-441 RGB Euclidean distance) below which noise/antialiasing is tolerated */
    noiseToleranceThreshold: number;
    /** Downsample factor for fast client-side rendering (1 = full res, 2 = half res) */
    sampleStep: number;
}
export declare const DEFAULT_COMPARISON_CONFIG: ComparisonConfig;
/**
 * Calculates behavioral equivalence between two checkpoint captures.
 * Behavioral equivalence evaluates semantic state (screen, focus, player, overlay)
 * independently from visual pixel rendering.
 */
export declare function evaluateBehavioralEquivalence(fireCapture?: CheckpointCapture, vegaCapture?: CheckpointCapture): {
    equivalence: 'EQUIVALENT' | 'DIVERGENT' | 'UNVERIFIED';
    notes: string;
};
/**
 * Computes visual image similarity from raw RGBA pixel buffers.
 *
 * Mathematical Metric:
 * 1. Euclidean Color Distance: ΔE_i = √((R1_i - R2_i)² + (G1_i - G2_i)² + (B1_i - B2_i)²)
 * 2. Root Mean Square Error (RMSE): RMSE = √( (1 / N) * Σ ( (R1_i-R2_i)² + (G1_i-G2_i)² + (B1_i-B2_i)² ) / 3 )
 * 3. Normalized Similarity Metric:
 *    If ΔE_i <= tolerance: considered matching (ignoring OS rendering antialiasing)
 *    Similarity % = (1 - (mismatchCount / totalSampledPixels)) * 100
 */
export declare function computeImageSimilarityFromPixels(pixelsA: Uint8ClampedArray, pixelsB: Uint8ClampedArray, width: number, height: number, config?: ComparisonConfig): {
    similarityPercent: number;
    rmse: number;
    pixelMismatchCount: number;
    totalPixels: number;
    heatmapPixels: Uint8ClampedArray;
};
/**
 * Normalizes comparison results across a pair of checkpoints
 */
export declare function buildVisualComparisonResult(checkpointId: CheckpointCapture['checkpointId'], fireCapture?: CheckpointCapture, vegaCapture?: CheckpointCapture, metricOverride?: {
    similarityPercent: number;
    rmse: number;
}): VisualComparisonResult;
//# sourceMappingURL=comparisonEngine.d.ts.map