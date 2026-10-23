"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoHandler = exports.VideoFileTypes = void 0;
/**
 * VideoHandler for non-Kepler platforms (Android, iOS, Web)
 *
 * This is a stub implementation that provides the same interface as VideoHandler.kepler.ts
 * but is designed for platforms that don't use Kepler/W3C Media APIs.
 *
 * For actual video playback on these platforms, react-native-video is used directly
 * in the VideoPlayer component.
 */
var VideoFileTypes;
(function (VideoFileTypes) {
    VideoFileTypes["MP4"] = "MP4";
    VideoFileTypes["HLS"] = "HLS";
    VideoFileTypes["DASH"] = "DASH";
})(VideoFileTypes || (exports.VideoFileTypes = VideoFileTypes = {}));
/**
 * Stub VideoHandler for non-Kepler platforms
 * This class provides compatibility but most functionality is handled by react-native-video directly
 */
class VideoHandler {
    videoUri;
    posterUri;
    selectedFileType;
    constructor(videoRef, videoUri, posterUri, setIsVideoInitialized, setIsVideoEnded, setIsVideoError, setCurrentTime, setDuration, setShowBuffering) {
        this.videoUri = videoUri;
        this.posterUri = posterUri;
        this.selectedFileType = this.detectVideoFormat(videoUri);
    }
    detectVideoFormat(uri) {
        const lowerUri = uri.toLowerCase();
        if (lowerUri.includes('.m3u8')) {
            return VideoFileTypes.HLS;
        }
        else if (lowerUri.includes('.mpd')) {
            return VideoFileTypes.DASH;
        }
        return VideoFileTypes.MP4;
    }
    setVideoUri = (uri, posterUri) => {
        this.videoUri = uri;
        if (posterUri) {
            this.posterUri = posterUri;
        }
        this.selectedFileType = this.detectVideoFormat(uri);
    };
    // Stub methods - not used on non-Kepler platforms
    preBufferVideo = async (componentInstance) => {
        console.log('[VideoHandler] - preBufferVideo not implemented for this platform');
    };
    destroyVideoElements = () => {
        console.log('[VideoHandler] - destroyVideoElements not implemented for this platform');
        return true;
    };
    play = () => {
        console.log('[VideoHandler] - play not implemented for this platform');
    };
    pause = () => {
        console.log('[VideoHandler] - pause not implemented for this platform');
    };
    seek = (time) => {
        console.log('[VideoHandler] - seek not implemented for this platform');
    };
    isPaused = () => {
        return true;
    };
}
exports.VideoHandler = VideoHandler;
