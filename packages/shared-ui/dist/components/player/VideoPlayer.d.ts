import React from "react";
export interface VideoPlayerRef {
    seek: (timeInSeconds: number) => void;
    setPlaybackRate?: (rate: number) => void;
}
interface VideoPlayerProps {
    movie: string;
    headerImage: string;
    paused: boolean;
    controls: boolean;
    playbackRate?: number;
    onBuffer: (isBuffering: boolean) => void;
    onProgress: (currentTime: number) => void;
    onLoad: (duration: number) => void;
    onEnd: () => void;
    onError?: (error: any) => void;
}
declare const VideoPlayer: React.NamedExoticComponent<VideoPlayerProps & React.RefAttributes<VideoPlayerRef>>;
export default VideoPlayer;
//# sourceMappingURL=VideoPlayer.d.ts.map