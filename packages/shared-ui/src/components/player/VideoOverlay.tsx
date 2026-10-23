import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Text, Platform } from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationNode,
} from 'react-tv-space-navigation';
import SeekBar from './SeekBar';
import LoadingIndicator from '../LoadingIndicator';
import { scaledPixels } from '../../hooks/useScale';
import { safeZones, colors } from '../../theme';
import PlatformLinearGradient from '../PlatformLinearGradient';

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

const VideoOverlay: React.FC<VideoOverlayProps> = React.memo(({
  visible,
  paused,
  onPlayPause,
  onExit,
  onSeekRelative,
  onOpenAssist,
  currentTime,
  duration,
  title = 'The Quantum Horizon',
  isBuffering = false,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${m.toString().padStart(2, '0')}:${s}`;
  };

  const formattedCurrentTime = useMemo(() => formatTime(currentTime), [currentTime]);
  const formattedDuration = useMemo(() => formatTime(duration), [duration]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="box-none">
      {/* Top Scrim Bar */}
      <PlatformLinearGradient
        colors={['rgba(11, 13, 17, 0.9)', 'rgba(11, 13, 17, 0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topGradient}
      />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <SpatialNavigationNode orientation="horizontal">
          <View style={styles.topBarRow}>
            {/* Back Button */}
            <SpatialNavigationFocusableView onSelect={onExit}>
              {({ isFocused }) => (
                <View style={[styles.topBtn, isFocused && styles.topBtnFocused]}>
                  <Text style={[styles.topBtnText, isFocused && styles.topBtnTextFocused]}>
                    ← Exit
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>

            {/* Title & Info */}
            <View style={styles.titleContainer}>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {title}
              </Text>
              <View style={styles.liveBadgeRow}>
                <View style={styles.hdBadge}>
                  <Text style={styles.hdBadgeText}>4K HDR</Text>
                </View>
                <Text style={styles.audioBadgeText}>Dolby 5.1</Text>
              </View>
            </View>

            {/* ViewEase Assist Top CTA */}
            <SpatialNavigationFocusableView onSelect={onOpenAssist}>
              {({ isFocused }) => (
                <View style={[styles.assistTopBtn, isFocused && styles.assistTopBtnFocused]}>
                  <Text style={styles.assistTopBtnIcon}>⚡</Text>
                  <Text
                    style={[
                      styles.assistTopBtnText,
                      isFocused && styles.assistTopBtnTextFocused,
                    ]}
                  >
                    ViewEase Assist
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>
          </View>
        </SpatialNavigationNode>
      </View>

      {/* Center Buffering State */}
      {isBuffering && (
        <View style={styles.bufferingBox}>
          <LoadingIndicator />
          <Text style={styles.bufferingText}>Buffering stream...</Text>
        </View>
      )}

      {/* Bottom Scrim Bar */}
      <PlatformLinearGradient
        colors={['transparent', 'rgba(11, 13, 17, 0.65)', 'rgba(11, 13, 17, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomGradient}
      />

      {/* Bottom Transport Controls */}
      <View style={styles.bottomControls}>
        {/* SeekBar Line & Timestamp */}
        <View style={styles.seekBarRow}>
          <Text style={styles.timeLabel}>{formattedCurrentTime}</Text>
          <View style={styles.seekBarWrapper}>
            <SeekBar currentTime={currentTime} duration={duration} />
          </View>
          <Text style={styles.timeLabel}>{formattedDuration}</Text>
        </View>

        {/* Buttons Row */}
        <SpatialNavigationNode orientation="horizontal">
          <View style={styles.controlsRow}>
            {/* Rewind -10s */}
            <SpatialNavigationFocusableView onSelect={() => onSeekRelative(-10)}>
              {({ isFocused }) => (
                <View style={[styles.controlBtn, isFocused && styles.controlBtnFocused]}>
                  <Text style={[styles.controlBtnText, isFocused && styles.controlBtnTextFocused]}>
                    ⏮ -10s
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>

            {/* Play/Pause Button */}
            <DefaultFocus>
              <SpatialNavigationFocusableView onSelect={onPlayPause}>
                {({ isFocused }) => (
                  <View
                    style={[
                      styles.controlBtn,
                      styles.playPauseBtn,
                      isFocused && styles.controlBtnFocused,
                    ]}
                  >
                    <Text
                      style={[
                        styles.controlBtnText,
                        styles.playPauseBtnText,
                        isFocused && styles.controlBtnTextFocused,
                      ]}
                    >
                      {paused ? '▶ Play' : '⏸ Pause'}
                    </Text>
                  </View>
                )}
              </SpatialNavigationFocusableView>
            </DefaultFocus>

            {/* FastForward +10s */}
            <SpatialNavigationFocusableView onSelect={() => onSeekRelative(10)}>
              {({ isFocused }) => (
                <View style={[styles.controlBtn, isFocused && styles.controlBtnFocused]}>
                  <Text style={[styles.controlBtnText, isFocused && styles.controlBtnTextFocused]}>
                    ⏭ +10s
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>

            {/* Assist Companion Button */}
            <SpatialNavigationFocusableView onSelect={onOpenAssist}>
              {({ isFocused }) => (
                <View
                  style={[
                    styles.controlBtn,
                    styles.assistBarBtn,
                    isFocused && styles.assistBarBtnFocused,
                  ]}
                >
                  <Text style={styles.assistBarIcon}>⚡</Text>
                  <Text
                    style={[
                      styles.assistBarText,
                      isFocused && styles.assistBarTextFocused,
                    ]}
                  >
                    ViewEase Assist
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>
          </View>
        </SpatialNavigationNode>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scaledPixels(150),
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scaledPixels(200),
  },
  topBar: {
    paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
    paddingTop: scaledPixels(safeZones.actionSafe.vertical),
    zIndex: 20,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBtn: {
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    paddingHorizontal: scaledPixels(18),
    paddingVertical: scaledPixels(10),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
  },
  topBtnFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.05 }],
  },
  topBtnText: {
    color: colors.text,
    fontSize: scaledPixels(16),
    fontWeight: '700',
  },
  topBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: scaledPixels(20),
  },
  videoTitle: {
    color: colors.text,
    fontSize: scaledPixels(24),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaledPixels(4),
  },
  hdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: scaledPixels(6),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(3),
    marginEnd: scaledPixels(8),
  },
  hdBadgeText: {
    color: colors.text,
    fontSize: scaledPixels(11),
    fontWeight: '700',
  },
  audioBadgeText: {
    color: colors.textTertiary,
    fontSize: scaledPixels(12),
  },
  assistTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 169, 60, 0.2)',
    paddingHorizontal: scaledPixels(18),
    paddingVertical: scaledPixels(10),
    borderRadius: scaledPixels(20),
    borderWidth: scaledPixels(2),
    borderColor: colors.primary,
  },
  assistTopBtnFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.06 }],
  },
  assistTopBtnIcon: {
    fontSize: scaledPixels(16),
    marginEnd: scaledPixels(6),
  },
  assistTopBtnText: {
    color: colors.primaryLight,
    fontSize: scaledPixels(16),
    fontWeight: '700',
  },
  assistTopBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  bufferingBox: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 13, 17, 0.75)',
    padding: scaledPixels(20),
    borderRadius: scaledPixels(12),
  },
  bufferingText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(16),
    marginTop: scaledPixels(12),
  },
  bottomControls: {
    paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
    paddingBottom: scaledPixels(safeZones.actionSafe.vertical),
    zIndex: 20,
  },
  seekBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledPixels(14),
  },
  timeLabel: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
    fontWeight: '600',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'System',
    width: scaledPixels(60),
    textAlign: 'center',
  },
  seekBarWrapper: {
    flex: 1,
    marginHorizontal: scaledPixels(12),
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtn: {
    backgroundColor: colors.card,
    paddingHorizontal: scaledPixels(20),
    paddingVertical: scaledPixels(12),
    borderRadius: scaledPixels(8),
    marginHorizontal: scaledPixels(10),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseBtn: {
    backgroundColor: colors.cardElevated,
    paddingHorizontal: scaledPixels(28),
  },
  controlBtnFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.08 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: scaledPixels(12),
    elevation: 8,
  },
  controlBtnText: {
    color: colors.text,
    fontSize: scaledPixels(16),
    fontWeight: '700',
  },
  playPauseBtnText: {
    fontSize: scaledPixels(18),
  },
  controlBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  assistBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderColor: colors.primary,
    marginStart: scaledPixels(20),
  },
  assistBarBtnFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.08 }],
  },
  assistBarIcon: {
    fontSize: scaledPixels(16),
    marginEnd: scaledPixels(6),
  },
  assistBarText: {
    color: colors.primaryLight,
    fontSize: scaledPixels(16),
    fontWeight: '700',
  },
  assistBarTextFocused: {
    color: colors.textOnPrimary,
  },
});

export default VideoOverlay;
