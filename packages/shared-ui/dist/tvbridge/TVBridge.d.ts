export declare enum TVPlaybackState {
    IDLE = "IDLE",
    BUFFERING = "BUFFERING",
    READY = "READY",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
    ENDED = "ENDED",
    ERROR = "ERROR"
}
export interface TVPlatformCapabilities {
    platformName: 'Fire OS' | 'Vega OS' | 'Apple TV' | 'Web TV';
    isTV: boolean;
    supportsHwKeyEvents: boolean;
    supportsNativeVideo: boolean;
    supportsSpatialNav: boolean;
    audioPassthrough: boolean;
}
export declare function getTVPlatformCapabilities(): TVPlatformCapabilities;
declare class FocusRestorationManagerClass {
    private lastFocusedMap;
    private focusHistory;
    saveFocus(screenName: string, focusId: string): void;
    getSavedFocus(screenName: string): string | null;
    getFocusHistory(): {
        screen: string;
        focusId: string;
        timestamp: number;
    }[];
    clearHistory(): void;
}
export declare const FocusRestorationManager: FocusRestorationManagerClass;
export interface UseTVPlayerControllerOptions {
    duration: number;
    initialTime?: number;
    onSeek?: (time: number) => void;
    onExit?: () => void;
    onToggleAssist?: (open: boolean) => void;
    controlsTimeoutMs?: number;
}
export declare function useTVPlayerController(options: UseTVPlayerControllerOptions): {
    playbackState: TVPlaybackState;
    setPlaybackState: import("react").Dispatch<import("react").SetStateAction<TVPlaybackState>>;
    currentTime: number;
    setCurrentTime: (t: number) => void;
    controlsVisible: boolean;
    assistVisible: boolean;
    isBuffering: boolean;
    setIsBuffering: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    showControls: () => void;
    hideControls: () => void;
    seek: (targetTime: number) => void;
    seekRelative: (deltaSec: number) => void;
    togglePlayPause: () => void;
    openAssist: () => void;
    closeAssist: () => void;
    toggleAssist: () => void;
};
export {};
//# sourceMappingURL=TVBridge.d.ts.map