import {
  DefaultAssistProvider,
  CuratedLocalAssistProvider,
} from '../../../packages/shared-ui/src/services/assist/ViewEaseAssistProvider';
import { StorageService } from '../../../packages/shared-ui/src/services/StorageService';
import {
  getTVPlatformCapabilities,
  FocusRestorationManager,
} from '../../../packages/shared-ui/src/tvbridge/TVBridge';
import {
  VIEWEASE_CATALOG,
  getTitleById,
  searchTitles,
} from '../../../packages/shared-ui/src/data/viewEaseCatalog';

describe('ViewEase TV — Core Architectural Suite', () => {
  describe('ViewEase Catalog & Search', () => {
    it('contains rich curated titles with transcript segments', () => {
      expect(VIEWEASE_CATALOG.length).toBeGreaterThanOrEqual(5);
      const quantum = getTitleById('quantum-horizon');
      expect(quantum).toBeDefined();
      expect(quantum.title).toBe('The Quantum Horizon');
      expect(quantum.transcript.length).toBeGreaterThanOrEqual(4);
      expect(quantum.hasAssist).toBe(true);
    });

    it('searches titles by keyword and genre correctly', () => {
      const results = searchTitles('Kyoto');
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Shadows of Kyoto');

      const sciFi = searchTitles('', 'Sci-Fi');
      expect(sciFi.length).toBeGreaterThanOrEqual(2);
      expect(sciFi.some((t) => t.id === 'quantum-horizon')).toBe(true);
    });
  });

  describe('ViewEase Assist (Contextual Viewing Companion)', () => {
    const provider = new CuratedLocalAssistProvider();

    it('locates correct timestamp segment for playback time', () => {
      // 10s is segment 0
      const seg0 = provider.getSegmentForTimestamp('quantum-horizon', 10);
      expect(seg0).toBeDefined();
      expect(seg0?.speaker).toBe('Kathryn Voss');

      // 40s is segment 1
      const seg1 = provider.getSegmentForTimestamp('quantum-horizon', 40);
      expect(seg1).toBeDefined();
      expect(seg1?.speaker).toBe('Eric Hayes');
    });

    it('generates plain language explanation of dialogue', async () => {
      const seg = provider.getSegmentForTimestamp('quantum-horizon', 10)!;
      const res = await provider.explainLine(seg);
      expect(res.action).toBe('explain');
      expect(res.sourceType).toBe('offline-deterministic');
      expect(res.content.length).toBeGreaterThan(20);
    });

    it('simplifies dialogue for cognitive accessibility', async () => {
      const seg = provider.getSegmentForTimestamp('quantum-horizon', 40)!;
      const res = await provider.simplifyLine(seg);
      expect(res.action).toBe('simplify');
      expect(res.content).toContain('engines');
    });

    it('translates dialogue into Hindi with phonetic transliteration', async () => {
      const seg = provider.getSegmentForTimestamp('quantum-horizon', 10)!;
      const res = await provider.translateLine(seg);
      expect(res.action).toBe('translate');
      expect(res.content).toBe(seg.hindiTranslation);
      expect(res.supplementary).toContain(seg.hindiPhonetic);
    });

    it('explains speaker identity and character stakes', async () => {
      const seg = provider.getSegmentForTimestamp('quantum-horizon', 60)!;
      const res = await provider.whoSaidThat(seg);
      expect(res.action).toBe('speaker');
      expect(res.title).toContain('Kavi Patel');
      expect(res.badge).toContain('Quantum Telemetry Specialist');
    });

    it('generates spoiler-free recap of earlier events', async () => {
      const res = await provider.previouslyInStory('quantum-horizon', 75);
      expect(res.action).toBe('recap');
      expect(res.badge).toContain('1:15');
      expect(res.content.length).toBeGreaterThan(20);
    });
  });

  describe('StorageService (Continue Watching & Watchlist)', () => {
    beforeEach(() => {
      StorageService.clearAll();
    });

    it('tracks playback progress and calculates percent', () => {
      StorageService.savePlaybackProgress('test-title-1', 150, 600);
      const progress = StorageService.getPlaybackProgress('test-title-1');
      expect(progress).not.toBeNull();
      expect(progress?.positionSec).toBe(150);
      expect(progress?.percent).toBe(25);

      const list = StorageService.getContinueWatching();
      expect(list.length).toBe(1);
      expect(list[0].id).toBe('test-title-1');
    });

    it('purges finished titles near end of video', () => {
      StorageService.savePlaybackProgress('test-title-2', 590, 600); // 98%
      const progress = StorageService.getPlaybackProgress('test-title-2');
      expect(progress).toBeNull();
    });

    it('toggles and persists watchlist items', () => {
      expect(StorageService.isInWatchlist('test-title-1')).toBe(false);
      const added = StorageService.toggleWatchlist('test-title-1');
      expect(added).toBe(true);
      expect(StorageService.isInWatchlist('test-title-1')).toBe(true);

      const removed = StorageService.toggleWatchlist('test-title-1');
      expect(removed).toBe(false);
      expect(StorageService.isInWatchlist('test-title-1')).toBe(false);
    });
  });

  describe('TVBridge Layer', () => {
    it('detects platform capabilities correctly', () => {
      const caps = getTVPlatformCapabilities();
      expect(caps.supportsSpatialNav).toBe(true);
      expect(caps.supportsHwKeyEvents).toBe(true);
      expect(caps.platformName).toBeDefined();
    });

    it('tracks and restores focused elements across navigation', () => {
      FocusRestorationManager.clearHistory();
      FocusRestorationManager.saveFocus('HomeScreen', 'card-quantum-horizon');
      FocusRestorationManager.saveFocus('DetailsScreen', 'btn-play-movie');

      expect(FocusRestorationManager.getSavedFocus('HomeScreen')).toBe('card-quantum-horizon');
      expect(FocusRestorationManager.getSavedFocus('DetailsScreen')).toBe('btn-play-movie');
      expect(FocusRestorationManager.getFocusHistory().length).toBe(2);
    });
  });
});
