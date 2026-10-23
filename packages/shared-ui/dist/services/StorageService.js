"use strict";
// ViewEase TV Local Storage Service
// Zero-cost, zero-dependency offline persistence with memory + web localStorage fallback
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
class ViewEaseStorageService {
    progressMap = new Map();
    watchlistSet = new Set(['quantum-horizon', 'shadows-of-kyoto']);
    listeners = new Set();
    initialized = false;
    constructor() {
        this.init();
    }
    init() {
        if (this.initialized)
            return;
        this.initialized = true;
        // Load from localStorage if in web environment
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const storedProgress = window.localStorage.getItem('viewease_playback_progress');
                if (storedProgress) {
                    const parsed = JSON.parse(storedProgress);
                    Object.values(parsed).forEach((p) => this.progressMap.set(p.id, p));
                }
                const storedWatchlist = window.localStorage.getItem('viewease_watchlist');
                if (storedWatchlist) {
                    const parsed = JSON.parse(storedWatchlist);
                    this.watchlistSet = new Set(parsed);
                }
            }
        }
        catch (e) {
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
    persist() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const progressObj = {};
                this.progressMap.forEach((v, k) => {
                    progressObj[k] = v;
                });
                window.localStorage.setItem('viewease_playback_progress', JSON.stringify(progressObj));
                window.localStorage.setItem('viewease_watchlist', JSON.stringify(Array.from(this.watchlistSet)));
            }
        }
        catch {
            // Ignored in non-browser envs
        }
        this.notify();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    notify() {
        this.listeners.forEach((fn) => {
            try {
                fn();
            }
            catch (err) {
                console.error('Storage listener error:', err);
            }
        });
    }
    // Playback Progress & Continue Watching
    savePlaybackProgress(id, positionSec, durationSec) {
        if (!id || durationSec <= 0)
            return;
        const percent = Math.min(100, Math.round((positionSec / durationSec) * 100));
        // If near end (e.g. > 95%), consider it finished and remove from Continue Watching
        if (percent >= 95) {
            this.progressMap.delete(id);
        }
        else if (positionSec > 5) {
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
    getPlaybackProgress(id) {
        return this.progressMap.get(id) || null;
    }
    getContinueWatching() {
        return Array.from(this.progressMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    }
    // Watchlist (My List)
    isInWatchlist(id) {
        return this.watchlistSet.has(id);
    }
    isInMyList(id) {
        return this.isInWatchlist(id);
    }
    toggleWatchlist(id) {
        let newState = false;
        if (this.watchlistSet.has(id)) {
            this.watchlistSet.delete(id);
            newState = false;
        }
        else {
            this.watchlistSet.add(id);
            newState = true;
        }
        this.persist();
        return newState;
    }
    toggleMyList(titleOrId) {
        const id = typeof titleOrId === 'string' ? titleOrId : titleOrId.id;
        return this.toggleWatchlist(id);
    }
    getWatchlist() {
        return Array.from(this.watchlistSet);
    }
    clearAll() {
        this.progressMap.clear();
        this.watchlistSet.clear();
        this.persist();
    }
}
exports.StorageService = new ViewEaseStorageService();
