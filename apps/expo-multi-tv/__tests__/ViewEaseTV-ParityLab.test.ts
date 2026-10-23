import {
  CANONICAL_CHECKPOINTS,
  evaluateBehavioralEquivalence,
  computeImageSimilarityFromPixels,
  EvidenceLoaderService,
  DEFAULT_COMPARISON_CONFIG,
  CheckpointCapture,
} from '@multi-tv/shared-ui';

describe('ViewEase Parity Lab — Cross-Platform Evidence & Comparison Engine', () => {
  beforeEach(() => {
    EvidenceLoaderService.setEmptyStateMode(false);
  });

  describe('1. Canonical Replay Scenario Specification', () => {
    it('defines exactly 12 deterministic canonical checkpoints', () => {
      expect(CANONICAL_CHECKPOINTS).toHaveLength(12);
    });

    it('contains all required canonical checkpoints from Section B', () => {
      const checkpointIds = CANONICAL_CHECKPOINTS.map((cp) => cp.id);
      expect(checkpointIds).toEqual([
        'cp-01-launch',
        'cp-02-home',
        'cp-03-featured',
        'cp-04-details',
        'cp-05-video-start',
        'cp-06-video-paused',
        'cp-07-assist-open',
        'cp-08-assist-explain',
        'cp-09-assist-close',
        'cp-10-playback-preserved',
        'cp-11-focus-restored',
        'cp-12-return-home',
      ]);
    });

    it('specifies semantic states and scripted actions for each checkpoint', () => {
      CANONICAL_CHECKPOINTS.forEach((cp) => {
        expect(cp.name).toBeDefined();
        expect(cp.scriptedAction).toBeDefined();
        expect(cp.expectedSemanticState.screenId).toBeDefined();
        expect(cp.expectedSemanticState.focusedElementId).toBeDefined();
        expect(cp.manualVerificationInstruction).toBeDefined();
      });
    });
  });

  describe('2. Behavioral Equivalence Evaluator', () => {
    it('reports EQUIVALENT when semantic screen, focus target, player, and overlay match', () => {
      const fireCapture: CheckpointCapture = {
        checkpointId: 'cp-06-video-paused',
        status: 'PASSED',
        timestamp: new Date().toISOString(),
        scriptedInputs: ['send_key KEY_PLAY_PAUSE'],
        observedSemanticState: {
          screenId: 'Player',
          focusedElementId: 'player-pause-btn',
          playerState: 'PAUSED',
          overlayState: 'CLOSED',
          playbackTimestamp: 3.5,
        },
      };

      const vegaCapture: CheckpointCapture = {
        checkpointId: 'cp-06-video-paused',
        status: 'PASSED',
        timestamp: new Date().toISOString(),
        scriptedInputs: ['send_key KEY_PLAY_PAUSE'],
        observedSemanticState: {
          screenId: 'Player',
          focusedElementId: 'player-pause-btn',
          playerState: 'PAUSED',
          overlayState: 'CLOSED',
          playbackTimestamp: 3.5,
        },
      };

      const result = evaluateBehavioralEquivalence(fireCapture, vegaCapture);
      expect(result.equivalence).toBe('EQUIVALENT');
    });

    it('reports DIVERGENT when semantic screen or player states diverge', () => {
      const fireCapture: CheckpointCapture = {
        checkpointId: 'cp-06-video-paused',
        status: 'PASSED',
        timestamp: new Date().toISOString(),
        scriptedInputs: [],
        observedSemanticState: {
          screenId: 'Player',
          focusedElementId: 'player-pause-btn',
          playerState: 'PAUSED',
        },
      };

      const vegaCapture: CheckpointCapture = {
        checkpointId: 'cp-06-video-paused',
        status: 'PASSED',
        timestamp: new Date().toISOString(),
        scriptedInputs: [],
        observedSemanticState: {
          screenId: 'Player',
          focusedElementId: 'player-pause-btn',
          playerState: 'PLAYING', // Divergent!
        },
      };

      const result = evaluateBehavioralEquivalence(fireCapture, vegaCapture);
      expect(result.equivalence).toBe('DIVERGENT');
      expect(result.notes).toContain('Player state mismatch');
    });

    it('reports UNVERIFIED when capture evidence is missing', () => {
      const result = evaluateBehavioralEquivalence(undefined, undefined);
      expect(result.equivalence).toBe('UNVERIFIED');
    });
  });

  describe('3. Visual Image Similarity & Difference Heatmap Engine', () => {
    it('tolerates GPU subpixel rendering noise below configured threshold', () => {
      // 2x2 image buffer (4 pixels, 16 bytes RGBA)
      const pixelsA = new Uint8ClampedArray([
        200, 100, 50, 255,
        200, 100, 50, 255,
        200, 100, 50, 255,
        200, 100, 50, 255,
      ]);

      // Minor variation (ΔE ~ 5 < 18 threshold)
      const pixelsB = new Uint8ClampedArray([
        203, 102, 51, 255,
        201, 100, 52, 255,
        202, 101, 50, 255,
        204, 103, 51, 255,
      ]);

      const result = computeImageSimilarityFromPixels(pixelsA, pixelsB, 2, 2, DEFAULT_COMPARISON_CONFIG);
      expect(result.pixelMismatchCount).toBe(0);
      expect(result.similarityPercent).toBe(100);
      expect(result.rmse).toBeLessThan(5);
    });

    it('detects significant visual layout deltas and highlights mismatched pixels in heatmap', () => {
      const pixelsA = new Uint8ClampedArray([
        255, 0, 0, 255, // Red
        0, 0, 0, 255,
      ]);

      const pixelsB = new Uint8ClampedArray([
        0, 255, 0, 255, // Green (large color delta > 300)
        0, 0, 0, 255,
      ]);

      const result = computeImageSimilarityFromPixels(pixelsA, pixelsB, 2, 1, DEFAULT_COMPARISON_CONFIG);
      expect(result.pixelMismatchCount).toBe(1);
      expect(result.similarityPercent).toBe(50);
      expect(result.heatmapPixels[0]).toBe(255); // Red highlight in heatmap
    });
  });

  describe('4. Honest Evidence Loader & Empty State', () => {
    it('loads the verified evidence bundle with metadata', () => {
      const bundle = EvidenceLoaderService.getEvidenceBundle();
      expect(bundle).not.toBeNull();
      expect(bundle?.scenarioId).toBe('canonical-viewease-core-v1');
      expect(bundle?.summary.totalCheckpoints).toBe(12);
      expect(bundle?.fireOsRun.platformName).toBe('Fire OS');
      expect(bundle?.vegaOsRun.platformName).toBe('Vega OS');
    });

    it('honestly returns null in empty state mode to avoid fabricating PASS indicators', () => {
      EvidenceLoaderService.setEmptyStateMode(true);
      expect(EvidenceLoaderService.getEvidenceBundle()).toBeNull();

      // Restore
      EvidenceLoaderService.setEmptyStateMode(false);
      expect(EvidenceLoaderService.getEvidenceBundle()).not.toBeNull();
    });
  });
});
