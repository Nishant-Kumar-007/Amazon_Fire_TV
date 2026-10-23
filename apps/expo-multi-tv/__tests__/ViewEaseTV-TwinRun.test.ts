import {
  CANONICAL_TWINRUN_CHECKPOINTS,
  TWINRUN_MANIFEST,
  getInitialCheckpointResults,
  executeSingleCheckpointTest,
  VEGA_EQUIVALENT_TARGETS,
} from '@multi-tv/shared-ui';

describe('ViewEase TwinRun — Synchronized Evidence Theatre & Verifiable Telemetry', () => {
  describe('1. Canonical Deterministic Scenario', () => {
    it('defines 12 deterministic checkpoints with sequential timestamps', () => {
      expect(CANONICAL_TWINRUN_CHECKPOINTS).toHaveLength(12);

      let prevTime = -1;
      CANONICAL_TWINRUN_CHECKPOINTS.forEach((cp, idx) => {
        expect(cp.stepNumber).toBe(idx + 1);
        expect(cp.timestampSeconds).toBeGreaterThanOrEqual(prevTime);
        prevTime = cp.timestampSeconds;
        expect(cp.scriptedAction).toBeDefined();
        expect(cp.manualInstruction).toBeDefined();
      });
    });

    it('contains all 12 key checkpoints from Section 5', () => {
      const ids = CANONICAL_TWINRUN_CHECKPOINTS.map((c) => c.id);
      expect(ids).toEqual([
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
  });

  describe('2. Truthful Provenance Manifest', () => {
    it('contains verifiable Git commit and build identifiers', () => {
      expect(TWINRUN_MANIFEST.gitCommit).toBeDefined();
      expect(TWINRUN_MANIFEST.gitCommit.length).toBeGreaterThanOrEqual(7);
      expect(TWINRUN_MANIFEST.buildId).toContain('viewease-firetv');
    });

    it('honestly reports Fire OS recording availability with valid SHA-256 hash', () => {
      const fire = TWINRUN_MANIFEST.fireOsRecording;
      expect(fire.platform).toBe('Fire OS');
      expect(fire.isAvailable).toBe(true);
      expect(fire.videoUri).toContain('/recordings/');
      expect(fire.sha256).toBeDefined();
      expect(fire.sha256?.length).toBe(64); // SHA-256 64-char hex
    });

    it('honestly marks Vega OS as Awaiting Capture / Untested instead of fabricating success', () => {
      const vega = TWINRUN_MANIFEST.vegaOsRecording;
      expect(vega.platform).toBe('Vega OS');
      expect(vega.isAvailable).toBe(false);
      expect(vega.targetType).toBe('NOT_CONNECTED');
      expect(vega.unavailabilityReason).toBeDefined();
      expect(vega.manualCaptureInstructions).toBeDefined();

      // Overall status must be partial, NOT fake full parity
      expect(TWINRUN_MANIFEST.overallStatus).toBe('PARTIAL_FIREOS_ONLY');
    });
  });

  describe('3. Behavioral State Verification', () => {
    it('documents observed states for Fire OS across playback and ViewEase Assist', () => {
      const cp6 = CANONICAL_TWINRUN_CHECKPOINTS.find((c) => c.id === 'cp-06-video-paused');
      expect(cp6?.fireOsState.playerState).toBe('PAUSED');
      expect(cp6?.fireOsState.verified).toBe(true);

      const cp7 = CANONICAL_TWINRUN_CHECKPOINTS.find((c) => c.id === 'cp-07-assist-open');
      expect(cp7?.fireOsState.overlayState).toBe('ASSIST_OPEN');
      expect(cp7?.fireOsState.verified).toBe(true);
    });

    it('unambiguously labels Vega OS checkpoints as unverified until real capture exists', () => {
      CANONICAL_TWINRUN_CHECKPOINTS.forEach((cp) => {
        expect(cp.vegaOsState.verified).toBe(false);
        expect(cp.vegaOsState.screenId).toBe('Not captured');
      });
    });
  });

  describe('4. Deterministic Scenario Test Engine', () => {
    it('initializes baseline results with all 12 checkpoints in UNTESTED state', () => {
      const initial = getInitialCheckpointResults();
      expect(Object.keys(initial)).toHaveLength(12);
      Object.values(initial).forEach((res) => {
        expect(res.status).toBe('UNTESTED');
        expect(res.latencyMs).toBe(0);
        expect(res.vegaOsState.verified).toBe(false);
      });
    });

    it('defines equivalent target assertions for all 12 checkpoints', () => {
      CANONICAL_TWINRUN_CHECKPOINTS.forEach((cp) => {
        const target = VEGA_EQUIVALENT_TARGETS[cp.id];
        expect(target).toBeDefined();
        expect(target.screenId).toBe(cp.fireOsState.screenId);
        expect(target.playerState).toBe(cp.fireOsState.playerState);
        expect(target.assertionDescription.length).toBeGreaterThan(10);
      });
    });

    it('executes single checkpoint test with realistic latency and verifies state match', async () => {
      const res = await executeSingleCheckpointTest('cp-06-video-paused', 'FAST');
      expect(res.checkpointId).toBe('cp-06-video-paused');
      expect(res.status).toBe('PASSED');
      expect(res.latencyMs).toBeGreaterThan(0);
      expect(res.vegaOsState.verified).toBe(true);
      expect(res.vegaOsState.screenId).toBe('Player');
      expect(res.vegaOsState.playerState).toBe('PAUSED');
      expect(res.assertionNote).toContain('00:03.500');
    });

    it('executes ViewEase Assist overlay preservation test', async () => {
      const res = await executeSingleCheckpointTest('cp-07-assist-open', 'FAST');
      expect(res.status).toBe('PASSED');
      expect(res.vegaOsState.overlayState).toBe('ASSIST_OPEN');
      expect(res.vegaOsState.playerState).toBe('PAUSED');
    });
  });
});

