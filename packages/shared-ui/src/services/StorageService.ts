// ViewEase TV Local Storage Service
// Zero-cost, zero-dependency offline persistence with memory + web localStorage fallback

export interface PlaybackProgress {
  id: string;
  positionSec: number;
  durationSec: number;
  percent: number;
  updatedAt: number;
}

type StorageChangeListener = () => void;

class ViewEaseStorageService {
  private progressMap: Map<string, PlaybackProgress> = new Map();
  private watchlistSet: Set<string> = new Set(['quantum-horizon', 'shadows-of-kyoto']);
  private listeners: Set<StorageChangeListener> = new Set();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;
    this.initialized = true;

    // Load from localStorage if in web environment
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedProgress = window.localStorage.getItem('viewease_playback_progress');
        if (storedProgress) {
          const parsed = JSON.parse(storedProgress) as Record<string, PlaybackProgress>;
          Object.values(parsed).forEach((p) => this.progressMap.set(p.id, p));
        }

        const storedWatchlist = window.localStorage.getItem('viewease_watchlist');
        if (storedWatchlist) {
          const parsed = JSON.parse(storedWatchlist) as string[];
          this.watchlistSet = new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('Storage initialization fallback to memory store:', e);
    }

    // Default seeded continue watching so the user immediately sees a realistic experience
    if (this.progressMap.size === 0) {
      this.progressMap.set('quantum-horizon', {
        id: 'quantum-horizon',
        positionSec: 145,
        durationSec: 732,
        percent: 20,
        updatedAt: Date.now() - 3600000,
      });
      this.progressMap.set('aurora-borealis', {
        id: 'aurora-borealis',
        positionSec: 320,
        durationSec: 653,
        percent: 49,
        updatedAt: Date.now() - 7200000,
      });
    }
  }

  private persist() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const progressObj: Record<string, PlaybackProgress> = {};
        this.progressMap.forEach((v, k) => {
          progressObj[k] = v;
        });
        window.localStorage.setItem('viewease_playback_progress', JSON.stringify(progressObj));
        window.localStorage.setItem(
          'viewease_watchlist',
          JSON.stringify(Array.from(this.watchlistSet)),
        );
      }
    } catch {
      // Ignored in non-browser envs
    }

    this.notify();
  }

  public subscribe(listener: StorageChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    });
  }

  // Playback Progress & Continue Watching
  public savePlaybackProgress(id: string, positionSec: number, durationSec: number): void {
    if (!id || durationSec <= 0) return;
    const percent = Math.min(100, Math.round((positionSec / durationSec) * 100));

    // If near end (e.g. > 95%), consider it finished and remove from Continue Watching
    if (percent >= 95) {
      this.progressMap.delete(id);
    } else if (positionSec > 5) {
      this.progressMap.set(id, {
        id,
        positionSec: Math.round(positionSec),
        durationSec: Math.round(durationSec),
        percent,
        updatedAt: Date.now(),
      });
    }
    this.persist();
  }

  public getPlaybackProgress(id: string): PlaybackProgress | null {
    return this.progressMap.get(id) || null;
  }

  public getContinueWatching(): PlaybackProgress[] {
    return Array.from(this.progressMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // Watchlist (My List)
  public isInWatchlist(id: string): boolean {
    return this.watchlistSet.has(id);
  }

  public toggleWatchlist(id: string): boolean {
    let newState = false;
    if (this.watchlistSet.has(id)) {
      this.watchlistSet.delete(id);
      newState = false;
    } else {
      this.watchlistSet.add(id);
      newState = true;
    }
    this.persist();
    return newState;
  }

  public getWatchlist(): string[] {
    return Array.from(this.watchlistSet);
  }

  public clearAll(): void {
    this.progressMap.clear();
    this.watchlistSet.clear();
    this.persist();
  }
}

export const StorageService = new ViewEaseStorageService();
