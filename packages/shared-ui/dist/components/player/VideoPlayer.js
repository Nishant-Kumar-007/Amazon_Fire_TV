"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_video_1 = __importDefault(require("react-native-video"));
const VideoPlayer = react_1.default.memo(react_1.default.forwardRef(({ movie, headerImage, paused, controls = false, playbackRate = 1.0, onBuffer, onProgress, onLoad, onEnd, onError, }, ref) => {
    const { width, height } = (0, react_native_1.useWindowDimensions)();
    const nativeVideoRef = (0, react_1.useRef)(null);
    const webVideoRef = (0, react_1.useRef)(null);
    // Expose imperative methods (seek, setPlaybackRate) to parent
    (0, react_1.useImperativeHandle)(ref, () => ({
        seek: (timeInSeconds) => {
            if (react_native_1.Platform.OS === "web" && webVideoRef.current) {
                webVideoRef.current.currentTime = timeInSeconds;
            }
            else if (nativeVideoRef.current) {
                nativeVideoRef.current.seek(timeInSeconds);
            }
        },
        setPlaybackRate: (rate) => {
            if (react_native_1.Platform.OS === "web" && webVideoRef.current) {
                webVideoRef.current.playbackRate = rate;
            }
        },
    }));
    // Web-specific play / pause / playbackRate sync
    (0, react_1.useEffect)(() => {
        if (react_native_1.Platform.OS === "web" && webVideoRef.current) {
            webVideoRef.current.playbackRate = playbackRate;
            if (paused) {
                webVideoRef.current.pause();
            }
            else {
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
    if (react_native_1.Platform.OS === "web") {
        return (<react_native_1.View style={styles.webContainer}>
            <video ref={webVideoRef} src={movie} poster={headerImage} playsInline autoPlay muted preload="auto" crossOrigin="anonymous" style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "#000000",
            }} onWaiting={() => onBuffer(true)} onPlaying={() => onBuffer(false)} onCanPlay={(e) => {
                // Unmute after autoplay starts to satisfy browser policy
                const vid = e.target;
                if (vid && vid.muted) {
                    vid.muted = false;
                }
                onBuffer(false);
            }} onTimeUpdate={(e) => {
                const target = e.target;
                if (target) {
                    onProgress(target.currentTime);
                }
            }} onLoadedMetadata={(e) => {
                const target = e.target;
                if (target && target.duration) {
                    onLoad(target.duration);
                    onBuffer(false);
                }
            }} onEnded={() => onEnd()} onError={(e) => {
                console.warn("Web video loading error:", e);
                if (onError)
                    onError(e);
            }}/>
          </react_native_1.View>);
    }
    // Native React Native Video (ExoPlayer for Fire TV / Android TV)
    const videoSource = (0, react_1.useMemo)(() => ({ uri: movie }), [movie]);
    const posterConfig = (0, react_1.useMemo)(() => headerImage
        ? {
            source: { uri: headerImage },
            resizeMode: "cover",
        }
        : undefined, [headerImage]);
    const videoStyle = (0, react_1.useMemo)(() => [styles.nativeVideo, { height: width * (9 / 16) }], [width]);
    return (<react_native_video_1.default ref={nativeVideoRef} source={videoSource} style={videoStyle} controls={controls} paused={paused} rate={playbackRate} onBuffer={({ isBuffering }) => onBuffer(isBuffering)} onProgress={({ currentTime }) => onProgress(currentTime)} onLoad={({ duration }) => onLoad(duration)} onEnd={onEnd} poster={posterConfig} resizeMode="cover"/>);
}));
const styles = react_native_1.StyleSheet.create({
    webContainer: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    nativeVideo: {
        width: "100%",
    },
});
exports.default = VideoPlayer;
