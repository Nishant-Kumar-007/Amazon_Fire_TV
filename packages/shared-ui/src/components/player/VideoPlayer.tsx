import React, { useMemo, useRef, useEffect, useImperativeHandle } from "react";
import {
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
} from "react-native";
import Video, { VideoRef } from "react-native-video";

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

const VideoPlayer = React.memo(
  React.forwardRef<VideoPlayerRef, VideoPlayerProps>(
    (
      {
        movie,
        headerImage,
        paused,
        controls = false,
        playbackRate = 1.0,
        onBuffer,
        onProgress,
        onLoad,
        onEnd,
        onError,
      },
      ref,
    ) => {
      const { width, height } = useWindowDimensions();
      const nativeVideoRef = useRef<VideoRef>(null);
      const webVideoRef = useRef<HTMLVideoElement | null>(null);

      // Expose imperative methods (seek, setPlaybackRate) to parent
      useImperativeHandle(ref, () => ({
        seek: (timeInSeconds: number) => {
          if (Platform.OS === "web" && webVideoRef.current) {
            webVideoRef.current.currentTime = timeInSeconds;
          } else if (nativeVideoRef.current) {
            nativeVideoRef.current.seek(timeInSeconds);
          }
        },
        setPlaybackRate: (rate: number) => {
          if (Platform.OS === "web" && webVideoRef.current) {
            webVideoRef.current.playbackRate = rate;
          }
        },
      }));

      // Web-specific play / pause / playbackRate sync
      useEffect(() => {
        if (Platform.OS === "web" && webVideoRef.current) {
          webVideoRef.current.playbackRate = playbackRate;
          if (paused) {
            webVideoRef.current.pause();
          } else {
            const playPromise = webVideoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                // Autoplay policy or user gesture requirement
                console.warn("Video playback error or policy restriction:", err);
              });
            }
          }
        }
      }, [paused, playbackRate]);

      // Web HTML5 Video Implementation
      if (Platform.OS === "web") {
        return (
          <View style={styles.webContainer}>
            <video
              ref={webVideoRef as any}
              src={movie}
              poster={headerImage}
              playsInline
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "#000000",
              }}
              onWaiting={() => onBuffer(true)}
              onPlaying={() => onBuffer(false)}
              onTimeUpdate={(e: any) => {
                const target = e.target as HTMLVideoElement;
                if (target) {
                  onProgress(target.currentTime);
                }
              }}
              onLoadedMetadata={(e: any) => {
                const target = e.target as HTMLVideoElement;
                if (target && target.duration) {
                  onLoad(target.duration);
                  onBuffer(false);
                }
              }}
              onEnded={() => onEnd()}
              onError={(e) => {
                console.warn("Web video loading error:", e);
                if (onError) onError(e);
              }}
            />
          </View>
        );
      }

      // Native React Native Video (ExoPlayer for Fire TV / Android TV)
      const videoSource = useMemo(() => ({ uri: movie }), [movie]);
      const posterConfig = useMemo(
        () =>
          headerImage
            ? {
                source: { uri: headerImage },
                resizeMode: "cover" as const,
              }
            : undefined,
        [headerImage],
      );

      const videoStyle = useMemo(
        () => [styles.nativeVideo, { height: width * (9 / 16) }],
        [width],
      );

      return (
        <Video
          ref={nativeVideoRef}
          source={videoSource}
          style={videoStyle}
          controls={controls}
          paused={paused}
          rate={playbackRate}
          onBuffer={({ isBuffering }) => onBuffer(isBuffering)}
          onProgress={({ currentTime }) => onProgress(currentTime)}
          onLoad={({ duration }) => onLoad(duration)}
          onEnd={onEnd}
          poster={posterConfig}
          resizeMode="cover"
        />
      );
    },
  ),
);

const styles = StyleSheet.create({
  webContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  nativeVideo: {
    width: "100%",
  },
});

export default VideoPlayer;
