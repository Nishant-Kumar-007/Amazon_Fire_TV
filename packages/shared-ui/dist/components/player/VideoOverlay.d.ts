import React from 'react';
interface VideoOverlayProps {
    visible: boolean;
    paused: boolean;
    onPlayPause: () => void;
    onExit: () => void;
    onSeekRelative: (seconds: number) => void;
    onOpenAssist: () => void;
    currentTime: number;
    duration: number;
    title?: string;
    isBuffering?: boolean;
}
declare const VideoOverlay: React.FC<VideoOverlayProps>;
export default VideoOverlay;
//# sourceMappingURL=VideoOverlay.d.ts.map