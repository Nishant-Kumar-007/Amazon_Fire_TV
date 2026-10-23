import React from 'react';
/**
 * VideoHandler for non-Kepler platforms (Android, iOS, Web)
 *
 * This is a stub implementation that provides the same interface as VideoHandler.kepler.ts
 * but is designed for platforms that don't use Kepler/W3C Media APIs.
 *
 * For actual video playback on these platforms, react-native-video is used directly
 * in the VideoPlayer component.
 */
export declare enum VideoFileTypes {
    MP4 = "MP4",
    HLS = "HLS",
    DASH = "DASH"
}
/**
 * Stub VideoHandler for non-Kepler platforms
 * This class provides compatibility but most functionality is handled by react-native-video directly
 */
export declare class VideoHandler {
    videoUri: string;
    posterUri: string;
    selectedFileType: VideoFileTypes;
    constructor(videoRef: any, videoUri: string, posterUri: string, setIsVideoInitialized: React.Dispatch<React.SetStateAction<boolean>>, setIsVideoEnded: React.Dispatch<React.SetStateAction<boolean>>, setIsVideoError: React.Dispatch<React.SetStateAction<boolean>>, setCurrentTime: React.Dispatch<React.SetStateAction<number>>, setDuration: React.Dispatch<React.SetStateAction<number>>, setShowBuffering: React.Dispatch<React.SetStateAction<boolean>>);
    private detectVideoFormat;
    setVideoUri: (uri: string, posterUri?: string) => void;
    preBufferVideo: (componentInstance?: any) => Promise<void>;
    destroyVideoElements: () => boolean;
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
    isPaused: () => boolean;
}
//# sourceMappingURL=VideoHandler.d.ts.map