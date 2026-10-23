import React from 'react';
interface VideoOverlayProps {
    visible: boolean;
    paused: boolean;
    onPlayPause: () => void;
    onExit: () => void;
    onSeekRelative: (seconds: number) => void;
    onSeekTo?: (seconds: number) => void;
    onOpenAssist: () => void;
    onSpeedChange?: (speed: number) => void;
    currentTime: number;
    duration: number;
    title?: string;
    previewImage?: string;
    isBuffering?: boolean;
}
declare const VideoOverlay: React.FC<VideoOverlayProps>;
export default VideoOverlay;
//# sourceMappingURL=VideoOverlay.d.ts.map