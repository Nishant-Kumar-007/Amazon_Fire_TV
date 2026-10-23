"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusRestorationManager = exports.TVPlaybackState = void 0;
exports.getTVPlatformCapabilities = getTVPlatformCapabilities;
exports.useTVPlayerController = useTVPlayerController;
const react_native_1 = require("react-native");
const react_1 = require("react");
const RemoteControlManager_1 = __importDefault(require("../app/remote-control/RemoteControlManager"));
const SupportedKeys_1 = require("../app/remote-control/SupportedKeys");
// Normalized TV Playback State
var TVPlaybackState;
(function (TVPlaybackState) {
    TVPlaybackState["IDLE"] = "IDLE";
    TVPlaybackState["BUFFERING"] = "BUFFERING";
    TVPlaybackState["READY"] = "READY";
    TVPlaybackState["PLAYING"] = "PLAYING";
    TVPlaybackState["PAUSED"] = "PAUSED";
    TVPlaybackState["ENDED"] = "ENDED";
    TVPlaybackState["ERROR"] = "ERROR";
})(TVPlaybackState || (exports.TVPlaybackState = TVPlaybackState = {}));
function getTVPlatformCapabilities() {
    const isVega = typeof globalThis?.kepler !== 'undefined' || react_native_1.Platform.OS === 'kepler';
    if (isVega) {
        return {
            platformName: 'Vega OS',
            isTV: true,
            supportsHwKeyEvents: true,
            supportsNativeVideo: true,
            supportsSpatialNav: true,
            audioPassthrough: true,
            supportsFocus: true,
            hasHardwareAcceleration: true,
        };
    }
    if (react_native_1.Platform.OS === 'android') {
        return {
            platformName: 'Fire OS',
            isTV: react_native_1.Platform.isTV || true,
            supportsHwKeyEvents: true,
            supportsNativeVideo: true,
            supportsSpatialNav: true,
            audioPassthrough: true,
            supportsFocus: true,
            hasHardwareAcceleration: true,
        };
    }
    if (react_native_1.Platform.OS === 'ios') {
        return {
            platformName: 'Apple TV',
            isTV: react_native_1.Platform.isTV,
            supportsHwKeyEvents: true,
            supportsNativeVideo: true,
            supportsSpatialNav: true,
            audioPassthrough: false,
            supportsFocus: true,
            hasHardwareAcceleration: true,
        };
    }
    return {
        platformName: 'Web TV',
        isTV: false,
        supportsHwKeyEvents: true,
        supportsNativeVideo: true,
        supportsSpatialNav: true,
        audioPassthrough: false,
        supportsFocus: true,
        hasHardwareAcceleration: true,
    };
}
// Focus Restoration Manager
class FocusRestorationManagerClass {
    static instance;
    lastFocusedMap = new Map();
    focusHistory = [];
    focusStack = [];
    static getInstance() {
        if (!FocusRestorationManagerClass.instance) {
            FocusRestorationManagerClass.instance = new FocusRestorationManagerClass();
        }
        return FocusRestorationManagerClass.instance;
    }
    pushFocusNode(nodeId) {
        if (nodeId) {
            this.focusStack.push(nodeId);
        }
    }
    popFocusNode() {
        return this.focusStack.pop() || null;
    }
    peekFocusNode() {
        return this.focusStack.length > 0 ? this.focusStack[this.focusStack.length - 1] : null;
    }
    saveFocus(screenName, focusId) {
        if (!screenName || !focusId)
            return;
        this.lastFocusedMap.set(screenName, focusId);
        this.focusHistory.push({
            screen: screenName,
            focusId,
            timestamp: Date.now(),
        });
        if (this.focusHistory.length > 50) {
            this.focusHistory.shift();
        }
    }
    getSavedFocus(screenName) {
        return this.lastFocusedMap.get(screenName) || null;
    }
    getFocusHistory() {
        return [...this.focusHistory];
    }
    clearHistory() {
        this.focusHistory = [];
        this.focusStack = [];
        this.lastFocusedMap.clear();
    }
}
exports.FocusRestorationManager = FocusRestorationManagerClass.getInstance();
exports.FocusRestorationManager.getInstance = () => FocusRestorationManagerClass.getInstance();
function useTVPlayerController(options) {
    const { duration, initialTime = 0, onSeek, onExit, onToggleAssist, controlsTimeoutMs = 5000, } = options;
    const [playbackState, setPlaybackState] = (0, react_1.useState)(TVPlaybackState.BUFFERING);
    const [currentTime, setCurrentTime] = (0, react_1.useState)(initialTime);
    const [controlsVisible, setControlsVisible] = (0, react_1.useState)(true);
    const [assistVisible, setAssistVisible] = (0, react_1.useState)(false);
    const [isBuffering, setIsBuffering] = (0, react_1.useState)(false);
    const controlsTimeoutRef = (0, react_1.useRef)(null);
    const currentTimeRef = (0, react_1.useRef)(initialTime);
    const durationRef = (0, react_1.useRef)(duration);
    (0, react_1.useEffect)(() => {
        durationRef.current = duration;
    }, [duration]);
    const showControls = (0, react_1.useCallback)(() => {
        setControlsVisible(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            // Don't auto-hide if assist overlay is open
            if (!assistVisible) {
                setControlsVisible(false);
            }
        }, controlsTimeoutMs);
    }, [controlsTimeoutMs, assistVisible]);
    const hideControls = (0, react_1.useCallback)(() => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        setControlsVisible(false);
    }, []);
    const seek = (0, react_1.useCallback)((targetTime) => {
        let clamped = Math.max(0, targetTime);
        if (durationRef.current > 0) {
            clamped = Math.min(clamped, durationRef.current);
        }
        currentTimeRef.current = clamped;
        setCurrentTime(clamped);
        if (onSeek)
            onSeek(clamped);
        showControls();
    }, [onSeek, showControls]);
    const seekRelative = (0, react_1.useCallback)((deltaSec) => {
        seek(currentTimeRef.current + deltaSec);
    }, [seek]);
    const togglePlayPause = (0, react_1.useCallback)(() => {
        setPlaybackState((prev) => {
            const next = prev === TVPlaybackState.PLAYING ? TVPlaybackState.PAUSED : TVPlaybackState.PLAYING;
            return next;
        });
        showControls();
    }, [showControls]);
    const openAssist = (0, react_1.useCallback)(() => {
        setAssistVisible(true);
        // Pause video playback while assistant is open
        setPlaybackState(TVPlaybackState.PAUSED);
        if (onToggleAssist)
            onToggleAssist(true);
    }, [onToggleAssist]);
    const closeAssist = (0, react_1.useCallback)(() => {
        setAssistVisible(false);
        // Resume playback and show controls briefly
        setPlaybackState(TVPlaybackState.PLAYING);
        showControls();
        if (onToggleAssist)
            onToggleAssist(false);
    }, [showControls, onToggleAssist]);
    const toggleAssist = (0, react_1.useCallback)(() => {
        if (assistVisible) {
            closeAssist();
        }
        else {
            openAssist();
        }
    }, [assistVisible, closeAssist, openAssist]);
    // Unified Remote Control Key Handler
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (key) => {
            // If assist modal is open, let modal handle navigation or back button
            if (assistVisible) {
                if (key === SupportedKeys_1.SupportedKeys.Back) {
                    closeAssist();
                }
                return;
            }
            switch (key) {
                // Correct forward seek mapping (Right or FastForward)
                case SupportedKeys_1.SupportedKeys.Right:
                case SupportedKeys_1.SupportedKeys.FastForward:
                    seekRelative(10);
                    break;
                // Correct backward seek mapping (Left or Rewind)
                case SupportedKeys_1.SupportedKeys.Left:
                case SupportedKeys_1.SupportedKeys.Rewind:
                    seekRelative(-10);
                    break;
                case SupportedKeys_1.SupportedKeys.PlayPause:
                    togglePlayPause();
                    break;
                case SupportedKeys_1.SupportedKeys.Enter:
                    if (!controlsVisible) {
                        showControls();
                    }
                    break;
                case SupportedKeys_1.SupportedKeys.Up:
                    // Quick shortcut to open ViewEase Assist
                    openAssist();
                    break;
                case SupportedKeys_1.SupportedKeys.Back:
                    if (controlsVisible) {
                        hideControls();
                    }
                    else if (onExit) {
                        onExit();
                    }
                    break;
                default:
                    showControls();
                    break;
            }
        };
        const listener = RemoteControlManager_1.default.addKeydownListener(handleKeyDown);
        return () => {
            RemoteControlManager_1.default.removeKeydownListener(listener);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [
        assistVisible,
        controlsVisible,
        seekRelative,
        togglePlayPause,
        openAssist,
        closeAssist,
        showControls,
        hideControls,
        onExit,
    ]);
    return {
        playbackState,
        setPlaybackState,
        currentTime,
        setCurrentTime: (t) => {
            currentTimeRef.current = t;
            setCurrentTime(t);
        },
        controlsVisible,
        assistVisible,
        isBuffering,
        setIsBuffering,
        showControls,
        hideControls,
        seek,
        seekRelative,
        togglePlayPause,
        openAssist,
        closeAssist,
        toggleAssist,
    };
}
