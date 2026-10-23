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
exports.default = PlayerScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const native_1 = require("@react-navigation/native");
const VideoPlayer_1 = __importDefault(require("../components/player/VideoPlayer"));
const VideoOverlay_1 = __importDefault(require("../components/player/VideoOverlay"));
const ViewEaseAssistOverlay_1 = require("../components/player/ViewEaseAssistOverlay");
const TVBridge_1 = require("../tvbridge/TVBridge");
const StorageService_1 = require("../services/StorageService");
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
const theme_1 = require("../theme");
function PlayerScreen() {
    const route = (0, native_1.useRoute)();
    const navigation = (0, native_1.useNavigation)();
    const isFocused = (0, native_1.useIsFocused)();
    const { movie, headerImage } = route.params;
    const titleParam = route.params?.title;
    const idParam = route.params?.id;
    // Resolve title metadata from catalog
    const catalogEntry = react_1.default.useMemo(() => {
        if (idParam)
            return (0, viewEaseCatalog_1.getTitleById)(idParam);
        const found = viewEaseCatalog_1.VIEWEASE_CATALOG.find((t) => t.movie === movie || t.title === titleParam);
        return found || viewEaseCatalog_1.VIEWEASE_CATALOG[0];
    }, [idParam, movie, titleParam]);
    const titleId = catalogEntry.id;
    const displayTitle = titleParam || catalogEntry.title;
    // Load saved initial playback position from StorageService
    const initialPosition = react_1.default.useMemo(() => {
        const saved = StorageService_1.StorageService.getPlaybackProgress(titleId);
        return saved?.positionSec || 0;
    }, [titleId]);
    const [duration, setDuration] = (0, react_1.useState)(catalogEntry.duration || 732);
    const [playbackError, setPlaybackError] = (0, react_1.useState)(null);
    const videoRef = (0, react_1.useRef)(null);
    const handleExit = (0, react_1.useCallback)(() => {
        // Save progress on exit
        if (currentTimeRef.current > 0 && duration > 0) {
            StorageService_1.StorageService.savePlaybackProgress(titleId, currentTimeRef.current, duration);
        }
        navigation.goBack();
    }, [navigation, titleId, duration]);
    const handleSeekInternal = (0, react_1.useCallback)((targetSec) => {
        videoRef.current?.seek(targetSec);
    }, []);
    // TVBridge Controller
    const { playbackState, setPlaybackState, currentTime, setCurrentTime, controlsVisible, assistVisible, isBuffering, setIsBuffering, showControls, seek, seekRelative, togglePlayPause, openAssist, closeAssist, } = (0, TVBridge_1.useTVPlayerController)({
        duration,
        initialTime: initialPosition,
        onSeek: handleSeekInternal,
        onExit: handleExit,
    });
    const currentTimeRef = (0, react_1.useRef)(currentTime);
    (0, react_1.useEffect)(() => {
        currentTimeRef.current = currentTime;
    }, [currentTime]);
    // Periodic progress saving every 10 seconds
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            if (currentTimeRef.current > 0 && duration > 0) {
                StorageService_1.StorageService.savePlaybackProgress(titleId, currentTimeRef.current, duration);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [titleId, duration]);
    const onVideoLoad = (0, react_1.useCallback)((loadedDuration) => {
        if (loadedDuration > 0) {
            setDuration(loadedDuration);
        }
        setIsBuffering(false);
        setPlaybackState(TVBridge_1.TVPlaybackState.PLAYING);
        // Seek to saved position if starting with prior history
        if (initialPosition > 0) {
            videoRef.current?.seek(initialPosition);
        }
    }, [initialPosition, setIsBuffering, setPlaybackState]);
    const onVideoProgress = (0, react_1.useCallback)((timeSec) => {
        setCurrentTime(timeSec);
    }, [setCurrentTime]);
    const onVideoEnd = (0, react_1.useCallback)(() => {
        setPlaybackState(TVBridge_1.TVPlaybackState.ENDED);
        StorageService_1.StorageService.savePlaybackProgress(titleId, duration, duration);
        handleExit();
    }, [titleId, duration, setPlaybackState, handleExit]);
    return (<react_tv_space_navigation_1.SpatialNavigationRoot isActive={isFocused}>
      <react_native_1.View style={styles.container}>
        {/* Real Video Player Component */}
        <VideoPlayer_1.default ref={videoRef} movie={movie || catalogEntry.movie} headerImage={headerImage || catalogEntry.headerImage} paused={playbackState === TVBridge_1.TVPlaybackState.PAUSED} controls={false} onBuffer={setIsBuffering} onProgress={onVideoProgress} onLoad={onVideoLoad} onEnd={onVideoEnd} onError={(e) => setPlaybackError("Playing fallback offline sample stream")}/>

        {/* Video Player Error State (Graceful fallback) */}
        {playbackError && (<react_native_1.View style={styles.errorOverlay}>
            <react_native_1.Text style={styles.errorTitle}>Media Playback Notice</react_native_1.Text>
            <react_native_1.Text style={styles.errorBody}>{playbackError}</react_native_1.Text>
          </react_native_1.View>)}

        {/* TV On-Screen Transport Controls Overlay */}
        <VideoOverlay_1.default visible={controlsVisible && !assistVisible} paused={playbackState === TVBridge_1.TVPlaybackState.PAUSED} onPlayPause={togglePlayPause} onExit={handleExit} onSeekRelative={seekRelative} onSeekTo={seek} onOpenAssist={openAssist} onSpeedChange={(speed) => videoRef.current?.setPlaybackRate?.(speed)} currentTime={currentTime} duration={duration} title={displayTitle} previewImage={headerImage || catalogEntry.headerImage} isBuffering={isBuffering}/>

        {/* ViewEase Assist - Contextual Viewing Companion Overlay */}
        <ViewEaseAssistOverlay_1.ViewEaseAssistOverlay visible={assistVisible} titleId={titleId} currentTime={currentTime} onClose={closeAssist} onSeekTo={(timeSec) => {
            seek(timeSec);
        }}/>
      </react_native_1.View>
    </react_tv_space_navigation_1.SpatialNavigationRoot>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    errorOverlay: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(11, 13, 17, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        zIndex: 5,
    },
    errorTitle: {
        color: theme_1.colors.primaryLight,
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 10,
    },
    errorBody: {
        color: theme_1.colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
    },
});
