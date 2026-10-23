import React from "react";
import { VideoRef } from "react-native-video";
interface VideoPlayerProps {
    movie: string;
    headerImage: string;
    paused: boolean;
    controls: boolean;
    onBuffer: (isBuffering: boolean) => void;
    onProgress: (currentTime: number) => void;
    onLoad: (duration: number) => void;
    onEnd: () => void;
}
declare const VideoPlayer: React.NamedExoticComponent<VideoPlayerProps & React.RefAttributes<VideoRef>>;
export default VideoPlayer;
//# sourceMappingURL=VideoPlayer.d.ts.map