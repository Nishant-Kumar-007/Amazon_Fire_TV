import { Platform } from 'react-native';
import { useState, useCallback, useRef, useEffect } from 'react';
import RemoteControlManager from '../app/remote-control/RemoteControlManager';
import { SupportedKeys } from '../app/remote-control/SupportedKeys';

// Normalized TV Playback State
export enum TVPlaybackState {
  IDLE = 'IDLE',
  BUFFERING = 'BUFFERING',
  READY = 'READY',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  ERROR = 'ERROR',
}

// Platform capability detection
export interface TVPlatformCapabilities {
  platformName: 'Fire OS' | 'Vega OS' | 'Apple TV' | 'Web TV';
  isTV: boolean;
  supportsHwKeyEvents: boolean;
  supportsNativeVideo: boolean;
  supportsSpatialNav: boolean;
  audioPassthrough: boolean;
}

export function getTVPlatformCapabilities(): TVPlatformCapabilities {
  const isVega = typeof (globalThis as any)?.kepler !== 'undefined' || Platform.OS === ('kepler' as any);
  if (isVega) {
    return {
      platformName: 'Vega OS',
      isTV: true,
      supportsHwKeyEvents: true,
      supportsNativeVideo: true,
      supportsSpatialNav: true,
      audioPassthrough: true,
    };
  }

  if (Platform.OS === 'android') {
    return {
      platformName: 'Fire OS',
      isTV: Platform.isTV || true,
      supportsHwKeyEvents: true,
      supportsNativeVideo: true,
      supportsSpatialNav: true,
      audioPassthrough: true,
    };
  }

  if (Platform.OS === 'ios') {
    return {
      platformName: 'Apple TV',
      isTV: Platform.isTV,
      supportsHwKeyEvents: true,
      supportsNativeVideo: true,
      supportsSpatialNav: true,
      audioPassthrough: false,
    };
  }

  return {
    platformName: 'Web TV',
    isTV: false,
    supportsHwKeyEvents: true,
    supportsNativeVideo: true,
    supportsSpatialNav: true,
    audioPassthrough: false,
  };
}

// Focus Restoration Manager
class FocusRestorationManagerClass {
  private lastFocusedMap: Map<string, string> = new Map();
  private focusHistory: Array<{ screen: string; focusId: string; timestamp: number }> = [];

  public saveFocus(screenName: string, focusId: string): void {
    if (!screenName || !focusId) return;
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

  public getSavedFocus(screenName: string): string | null {
    return this.lastFocusedMap.get(screenName) || null;
  }

  public getFocusHistory() {
    return [...this.focusHistory];
  }

  public clearHistory(): void {
    this.focusHistory = [];
    this.lastFocusedMap.clear();
  }
}

export const FocusRestorationManager = new FocusRestorationManagerClass();

// Reusable TV Player Controller Hook
export interface UseTVPlayerControllerOptions {
  duration: number;
  initialTime?: number;
  onSeek?: (time: number) => void;
  onExit?: () => void;
  onToggleAssist?: (open: boolean) => void;
  controlsTimeoutMs?: number;
}

export function useTVPlayerController(options: UseTVPlayerControllerOptions) {
  const {
    duration,
    initialTime = 0,
    onSeek,
    onExit,
    onToggleAssist,
    controlsTimeoutMs = 5000,
  } = options;

  const [playbackState, setPlaybackState] = useState<TVPlaybackState>(TVPlaybackState.BUFFERING);
  const [currentTime, setCurrentTime] = useState<number>(initialTime);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [assistVisible, setAssistVisible] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentTimeRef = useRef<number>(initialTime);
  const durationRef = useRef<number>(duration);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const showControls = useCallback(() => {
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

  const hideControls = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setControlsVisible(false);
  }, []);

  const seek = useCallback(
    (targetTime: number) => {
      let clamped = Math.max(0, targetTime);
      if (durationRef.current > 0) {
        clamped = Math.min(clamped, durationRef.current);
      }
      currentTimeRef.current = clamped;
      setCurrentTime(clamped);
      if (onSeek) onSeek(clamped);
      showControls();
    },
    [onSeek, showControls],
  );

  const seekRelative = useCallback(
    (deltaSec: number) => {
      seek(currentTimeRef.current + deltaSec);
    },
    [seek],
  );

  const togglePlayPause = useCallback(() => {
    setPlaybackState((prev) => {
      const next = prev === TVPlaybackState.PLAYING ? TVPlaybackState.PAUSED : TVPlaybackState.PLAYING;
      return next;
    });
    showControls();
  }, [showControls]);

  const openAssist = useCallback(() => {
    setAssistVisible(true);
    // Pause video playback while assistant is open
    setPlaybackState(TVPlaybackState.PAUSED);
    if (onToggleAssist) onToggleAssist(true);
  }, [onToggleAssist]);

  const closeAssist = useCallback(() => {
    setAssistVisible(false);
    // Resume playback and show controls briefly
    setPlaybackState(TVPlaybackState.PLAYING);
    showControls();
    if (onToggleAssist) onToggleAssist(false);
  }, [showControls, onToggleAssist]);

  const toggleAssist = useCallback(() => {
    if (assistVisible) {
      closeAssist();
    } else {
      openAssist();
    }
  }, [assistVisible, closeAssist, openAssist]);

  // Unified Remote Control Key Handler
  useEffect(() => {
    const handleKeyDown = (key: SupportedKeys) => {
      // If assist modal is open, let modal handle navigation or back button
      if (assistVisible) {
        if (key === SupportedKeys.Back) {
          closeAssist();
        }
        return;
      }

      switch (key) {
        // Correct forward seek mapping (Right or FastForward)
        case SupportedKeys.Right:
        case SupportedKeys.FastForward:
          seekRelative(10);
          break;

        // Correct backward seek mapping (Left or Rewind)
        case SupportedKeys.Left:
        case SupportedKeys.Rewind:
          seekRelative(-10);
          break;

        case SupportedKeys.PlayPause:
          togglePlayPause();
          break;

        case SupportedKeys.Enter:
          if (!controlsVisible) {
            showControls();
          }
          break;

        case SupportedKeys.Up:
          // Quick shortcut to open ViewEase Assist
          openAssist();
          break;

        case SupportedKeys.Back:
          if (controlsVisible) {
            hideControls();
          } else if (onExit) {
            onExit();
          }
          break;

        default:
          showControls();
          break;
      }
    };

    const listener = RemoteControlManager.addKeydownListener(handleKeyDown);
    return () => {
      RemoteControlManager.removeKeydownListener(listener);
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
    setCurrentTime: (t: number) => {
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
