export interface PlaybackProgress {
    id: string;
    positionSec: number;
    durationSec: number;
    percent: number;
    updatedAt: number;
}
type StorageChangeListener = () => void;
declare class ViewEaseStorageService {
    private progressMap;
    private watchlistSet;
    private listeners;
    private initialized;
    constructor();
    private init;
    private persist;
    subscribe(listener: StorageChangeListener): () => void;
    private notify;
    savePlaybackProgress(id: string, positionSec: number, durationSec: number): void;
    getPlaybackProgress(id: string): PlaybackProgress | null;
    getContinueWatching(): PlaybackProgress[];
    isInWatchlist(id: string): boolean;
    toggleWatchlist(id: string): boolean;
    getWatchlist(): string[];
    clearAll(): void;
}
export declare const StorageService: ViewEaseStorageService;
export {};
//# sourceMappingURL=StorageService.d.ts.map