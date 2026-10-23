import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import { SpatialNavigationRoot } from 'react-tv-space-navigation';
import { useIsFocused, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VideoRef } from 'react-native-video';
import VideoPlayer from '../components/player/VideoPlayer';
import VideoOverlay from '../components/player/VideoOverlay';
import { ViewEaseAssistOverlay } from '../components/player/ViewEaseAssistOverlay';
import { RootStackParamList } from '../navigation/types';
import { useTVPlayerController, TVPlaybackState } from '../tvbridge/TVBridge';
import { StorageService } from '../services/StorageService';
import { getTitleById, VIEWEASE_CATALOG } from '../data/viewEaseCatalog';
import { colors } from '../theme';

type PlayerScreenRouteProp = RouteProp<RootStackParamList, 'Player'>;
type PlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Player'>;

export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  const navigation = useNavigation<PlayerScreenNavigationProp>();
  const isFocused = useIsFocused();

  const { movie, headerImage } = route.params;
  const titleParam = (route.params as any)?.title;
  const idParam = (route.params as any)?.id;

  // Resolve title metadata from catalog
  const catalogEntry = React.useMemo(() => {
    if (idParam) return getTitleById(idParam);
    const found = VIEWEASE_CATALOG.find((t) => t.movie === movie || t.title === titleParam);
    return found || VIEWEASE_CATALOG[0];
  }, [idParam, movie, titleParam]);

  const titleId = catalogEntry.id;
  const displayTitle = titleParam || catalogEntry.title;

  // Load saved initial playback position from StorageService
  const initialPosition = React.useMemo(() => {
    const saved = StorageService.getPlaybackProgress(titleId);
    return saved?.positionSec || 0;
  }, [titleId]);

  const [duration, setDuration] = useState<number>(catalogEntry.duration || 732);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const videoRef = useRef<VideoRef>(null);

  const handleExit = useCallback(() => {
    // Save progress on exit
    if (currentTimeRef.current > 0 && duration > 0) {
      StorageService.savePlaybackProgress(titleId, currentTimeRef.current, duration);
    }
    navigation.goBack();
  }, [navigation, titleId, duration]);

  const handleSeekInternal = useCallback((targetSec: number) => {
    videoRef.current?.seek(targetSec);
  }, []);

  // TVBridge Controller
  const {
    playbackState,
    setPlaybackState,
    currentTime,
    setCurrentTime,
    controlsVisible,
    assistVisible,
    isBuffering,
    setIsBuffering,
    showControls,
    seek,
    seekRelative,
    togglePlayPause,
    openAssist,
    closeAssist,
  } = useTVPlayerController({
    duration,
    initialTime: initialPosition,
    onSeek: handleSeekInternal,
    onExit: handleExit,
  });

  const currentTimeRef = useRef<number>(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // Periodic progress saving every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTimeRef.current > 0 && duration > 0) {
        StorageService.savePlaybackProgress(titleId, currentTimeRef.current, duration);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [titleId, duration]);

  const onVideoLoad = useCallback((loadedDuration: number) => {
    if (loadedDuration > 0) {
      setDuration(loadedDuration);
    }
    setIsBuffering(false);
    setPlaybackState(TVPlaybackState.PLAYING);

    // Seek to saved position if starting with prior history
    if (initialPosition > 0) {
      videoRef.current?.seek(initialPosition);
    }
  }, [initialPosition, setIsBuffering, setPlaybackState]);

  const onVideoProgress = useCallback(
    (timeSec: number) => {
      setCurrentTime(timeSec);
    },
    [setCurrentTime],
  );

  const onVideoEnd = useCallback(() => {
    setPlaybackState(TVPlaybackState.ENDED);
    StorageService.savePlaybackProgress(titleId, duration, duration);
    handleExit();
  }, [titleId, duration, setPlaybackState, handleExit]);

  return (
    <SpatialNavigationRoot isActive={isFocused}>
      <View style={styles.container}>
        {/* Real Video Player Component */}
        <VideoPlayer
          ref={videoRef}
          movie={movie || catalogEntry.movie}
          headerImage={headerImage || catalogEntry.headerImage}
          paused={playbackState === TVPlaybackState.PAUSED}
          controls={false}
          onBuffer={setIsBuffering}
          onProgress={onVideoProgress}
          onLoad={onVideoLoad}
          onEnd={onVideoEnd}
        />

        {/* Video Player Error State (Graceful fallback) */}
        {playbackError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorTitle}>Media Playback Notice</Text>
            <Text style={styles.errorBody}>{playbackError}</Text>
          </View>
        )}

        {/* TV On-Screen Transport Controls Overlay */}
        <VideoOverlay
          visible={controlsVisible && !assistVisible}
          paused={playbackState === TVPlaybackState.PAUSED}
          onPlayPause={togglePlayPause}
          onExit={handleExit}
          onSeekRelative={seekRelative}
          onOpenAssist={openAssist}
          currentTime={currentTime}
          duration={duration}
          title={displayTitle}
          isBuffering={isBuffering}
        />

        {/* ViewEase Assist - Contextual Viewing Companion Overlay */}
        <ViewEaseAssistOverlay
          visible={assistVisible}
          titleId={titleId}
          currentTime={currentTime}
          onClose={closeAssist}
          onSeekTo={(timeSec) => {
            seek(timeSec);
          }}
        />
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 13, 17, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    zIndex: 5,
  },
  errorTitle: {
    color: colors.primaryLight,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  errorBody: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});
