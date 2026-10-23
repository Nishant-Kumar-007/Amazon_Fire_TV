import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Text,
  Pressable,
  Platform,
  Modal,
} from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationNode,
} from 'react-tv-space-navigation';
import SeekBar from './SeekBar';
import LoadingIndicator from '../LoadingIndicator';
import { colors } from '../../theme';
import PlatformLinearGradient from '../PlatformLinearGradient';

interface VideoOverlayProps {
  visible: boolean;
  paused: boolean;
  onPlayPause: () => void;
  onExit: () => void;
  onSeekRelative: (seconds: number) => void;
  onSeekTo?: (seconds: number) => void;
  onOpenAssist: () => void;
  onSpeedChange?: (speed: number) => void;
  currentTime: number;
  duration: number;
  title?: string;
  previewImage?: string;
  isBuffering?: boolean;
}

const VideoOverlay: React.FC<VideoOverlayProps> = React.memo(({
  visible,
  paused,
  onPlayPause,
  onExit,
  onSeekRelative,
  onSeekTo,
  onOpenAssist,
  onSpeedChange,
  currentTime,
  duration,
  title = 'The Quantum Horizon',
  previewImage,
  isBuffering = false,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  // Settings State: Quality, Speed, Captions
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p FHD');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);
  const [selectedCaption, setSelectedCaption] = useState('English [CC]');

  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

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

  const handleSpeedSelect = (speed: number) => {
    setSelectedSpeed(speed);
    if (onSpeedChange) {
      onSpeedChange(speed);
    }
  };

  if (!visible && !settingsModalVisible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="box-none">
      {/* Top Scrim Bar */}
      <PlatformLinearGradient
        colors={['rgba(11, 13, 17, 0.95)', 'rgba(11, 13, 17, 0.5)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topGradient}
      />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarRow}>
          {/* Back / Exit Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Exit player"
            onPress={onExit}
            // @ts-ignore
            onMouseEnter={() => setHoveredBtn('exit')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={({ hovered }: any) => [
              styles.topBtn,
              (hovered || hoveredBtn === 'exit') && styles.topBtnHovered,
            ]}
          >
            <Text style={styles.topBtnText}>← Exit</Text>
          </Pressable>

          {/* Title & Info */}
          <View style={styles.titleContainer}>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.liveBadgeRow}>
              <View style={styles.hdBadge}>
                <Text style={styles.hdBadgeText}>{selectedQuality}</Text>
              </View>
              {selectedSpeed !== 1.0 && (
                <View style={styles.speedBadge}>
                  <Text style={styles.speedBadgeText}>{selectedSpeed}x</Text>
                </View>
              )}
              <Text style={styles.audioBadgeText}>Dolby Atmos • {selectedCaption}</Text>
            </View>
          </View>

          {/* Top Right Actions: Settings & Assist */}
          <View style={styles.topRightGroup}>
            {/* Player Settings (⚙) Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Video Settings"
              onPress={() => setSettingsModalVisible(true)}
              // @ts-ignore
              onMouseEnter={() => setHoveredBtn('settings-top')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={({ hovered }: any) => [
                styles.iconBtn,
                (hovered || hoveredBtn === 'settings-top') && styles.iconBtnHovered,
              ]}
            >
              <Text style={styles.iconBtnText}>⚙</Text>
            </Pressable>

            {/* ViewEase Assist Top CTA */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open ViewEase Assist"
              onPress={onOpenAssist}
              // @ts-ignore
              onMouseEnter={() => setHoveredBtn('assist-top')}
              onMouseLeave={() => setHoveredBtn(null)}
              style={({ hovered }: any) => [
                styles.assistTopBtn,
                (hovered || hoveredBtn === 'assist-top') && styles.assistTopBtnHovered,
              ]}
            >
              <Text style={styles.assistTopBtnIcon}>⚡</Text>
              <Text style={styles.assistTopBtnText}>ViewEase Assist</Text>
            </Pressable>
          </View>
        </View>
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
        colors={['transparent', 'rgba(11, 13, 17, 0.7)', 'rgba(11, 13, 17, 0.98)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomGradient}
      />

      {/* Bottom Transport Controls */}
      <View style={styles.bottomControls}>
        {/* SeekBar Line & Timestamp with Hover Thumbnail Frame Preview */}
        <View style={styles.seekBarRow}>
          <Text style={styles.timeLabel}>{formattedCurrentTime}</Text>
          <View style={styles.seekBarWrapper}>
            <SeekBar
              currentTime={currentTime}
              duration={duration}
              previewImage={previewImage}
              onSeekTo={onSeekTo}
            />
          </View>
          <Text style={styles.timeLabel}>{formattedDuration}</Text>
        </View>

        {/* Buttons Row with White/Amber Highlight Boundaries on Hover & Remote */}
        <View style={styles.controlsRow}>
          {/* Rewind -10s */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rewind 10 seconds"
            onPress={() => onSeekRelative(-10)}
            // @ts-ignore
            onMouseEnter={() => setHoveredBtn('rewind')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={({ hovered }: any) => [
              styles.controlBtn,
              (hovered || hoveredBtn === 'rewind') && styles.controlBtnHovered,
            ]}
          >
            <Text style={styles.controlBtnText}>⏮ -10s</Text>
          </Pressable>

          {/* Play/Pause Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={paused ? 'Play' : 'Pause'}
            onPress={onPlayPause}
            // @ts-ignore
            onMouseEnter={() => setHoveredBtn('play')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={({ hovered }: any) => [
              styles.controlBtn,
              styles.playPauseBtn,
              (hovered || hoveredBtn === 'play') && styles.playPauseBtnHovered,
            ]}
          >
            <Text style={styles.playPauseBtnText}>
              {paused ? '▶ Play' : '⏸ Pause'}
            </Text>
          </Pressable>

          {/* FastForward +10s */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fast forward 10 seconds"
            onPress={() => onSeekRelative(10)}
            // @ts-ignore
            onMouseEnter={() => setHoveredBtn('forward')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={({ hovered }: any) => [
              styles.controlBtn,
              (hovered || hoveredBtn === 'forward') && styles.controlBtnHovered,
            ]}
          >
            <Text style={styles.controlBtnText}>⏭ +10s</Text>
          </Pressable>

          {/* Settings Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => setSettingsModalVisible(true)}
            // @ts-ignore
            onMouseEnter={() => setHoveredBtn('settings-bottom')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={({ hovered }: any) => [
              styles.controlBtn,
              styles.settingsBtn,
              (hovered || hoveredBtn === 'settings-bottom') && styles.controlBtnHovered,
            ]}
          >
            <Text style={styles.settingsBtnIcon}>⚙</Text>
            <Text style={styles.controlBtnText}>Settings</Text>
          </Pressable>

          {/* Assist Companion Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="ViewEase Assist"
            onPress={onOpenAssist}
            // @ts-ignore
            onMouseEnter={() => setHoveredBtn('assist-bottom')}
            onMouseLeave={() => setHoveredBtn(null)}
            style={({ hovered }: any) => [
              styles.controlBtn,
              styles.assistBarBtn,
              (hovered || hoveredBtn === 'assist-bottom') && styles.assistBarBtnHovered,
            ]}
          >
            <Text style={styles.assistBarIcon}>⚡</Text>
            <Text style={styles.assistBarText}>ViewEase Assist</Text>
          </Pressable>
        </View>
      </View>

      {/* Video Player Settings Modal: Quality, Speed, Captions */}
      <Modal
        visible={settingsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSettingsModalVisible(false)}
        >
          <Pressable style={styles.settingsModalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.settingsModalHeader}>
              <Text style={styles.settingsModalTitle}>⚙ Video Playback Settings</Text>
              <Pressable
                onPress={() => setSettingsModalVisible(false)}
                style={({ hovered }: any) => [
                  styles.closeModalBtn,
                  hovered && styles.closeModalBtnHovered,
                ]}
              >
                <Text style={styles.closeModalText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.settingsModalBody}>
              {/* 1. Quality Setting */}
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>VIDEO QUALITY</Text>
                <View style={styles.optionsRow}>
                  {['4K UHD (2160p)', '1080p FHD', '720p HD', 'Auto (Adaptive)'].map((q) => (
                    <Pressable
                      key={q}
                      onPress={() => setSelectedQuality(q)}
                      style={[
                        styles.optionPill,
                        selectedQuality === q && styles.optionPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionPillText,
                          selectedQuality === q && styles.optionPillTextActive,
                        ]}
                      >
                        {q}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* 2. Playback Speed Setting */}
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>PLAYBACK SPEED</Text>
                <View style={styles.optionsRow}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => handleSpeedSelect(s)}
                      style={[
                        styles.optionPill,
                        selectedSpeed === s && styles.optionPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionPillText,
                          selectedSpeed === s && styles.optionPillTextActive,
                        ]}
                      >
                        {s === 1.0 ? '1.0x (Normal)' : `${s}x`}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* 3. Captions & Subtitles Setting */}
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>CAPTIONS & SUBTITLES</Text>
                <View style={styles.optionsRow}>
                  {['Off', 'English [CC]', 'Hindi [हिन्दी]', 'Spanish', 'French'].map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setSelectedCaption(c)}
                      style={[
                        styles.optionPill,
                        selectedCaption === c && styles.optionPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionPillText,
                          selectedCaption === c && styles.optionPillTextActive,
                        ]}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Modal Done Button */}
            <View style={styles.settingsModalFooter}>
              <Pressable
                onPress={() => setSettingsModalVisible(false)}
                style={styles.doneSettingsBtn}
              >
                <Text style={styles.doneSettingsBtnText}>Apply & Return to Video</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    height: 140,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 190,
  },
  topBar: {
    paddingHorizontal: 40,
    paddingTop: 30,
    zIndex: 20,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBtn: {
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    // @ts-ignore
    cursor: 'pointer',
  },
  topBtnHovered: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    // @ts-ignore
    boxShadow: '0 0 16px #FFFFFF',
  },
  topBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  videoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  liveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  hdBadge: {
    backgroundColor: 'rgba(229, 169, 60, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  hdBadgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '800',
  },
  speedBadge: {
    backgroundColor: 'rgba(52, 152, 219, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  speedBadgeText: {
    fontSize: 10,
    color: '#3498db',
    fontWeight: '800',
  },
  audioBadgeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    // @ts-ignore
    cursor: 'pointer',
  },
  iconBtnHovered: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    // @ts-ignore
    boxShadow: '0 0 16px #FFFFFF',
  },
  iconBtnText: {
    fontSize: 18,
    color: colors.text,
  },
  assistTopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 169, 60, 0.2)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 24,
    // @ts-ignore
    cursor: 'pointer',
  },
  assistTopBtnHovered: {
    backgroundColor: colors.primary,
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 20px rgba(229, 169, 60, 0.8)',
  },
  assistTopBtnIcon: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 6,
  },
  assistTopBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  bufferingBox: {
    alignSelf: 'center',
    backgroundColor: 'rgba(11, 13, 17, 0.85)',
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  bufferingText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  bottomControls: {
    paddingHorizontal: 40,
    paddingBottom: 28,
    zIndex: 20,
  },
  seekBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    width: 55,
  },
  seekBarWrapper: {
    flex: 1,
    marginHorizontal: 14,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  controlBtn: {
    backgroundColor: 'rgba(24, 28, 36, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    // @ts-ignore
    cursor: 'pointer',
  },
  controlBtnHovered: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    // @ts-ignore
    boxShadow: '0 0 20px #FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  controlBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  playPauseBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  playPauseBtnHovered: {
    backgroundColor: '#F5BE58',
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 24px rgba(229, 169, 60, 0.9)',
    transform: [{ scale: 1.08 }],
  },
  playPauseBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0B0D11',
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsBtnIcon: {
    fontSize: 14,
    color: colors.text,
  },
  assistBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderColor: colors.primary,
    gap: 6,
  },
  assistBarBtnHovered: {
    backgroundColor: colors.primary,
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 22px rgba(229, 169, 60, 0.8)',
    transform: [{ scale: 1.05 }],
  },
  assistBarIcon: {
    fontSize: 14,
    color: colors.primary,
  },
  assistBarText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },

  // Settings Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModalCard: {
    width: 600,
    maxWidth: '92%',
    backgroundColor: '#161B22',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.9,
    shadowRadius: 28,
  },
  settingsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    // @ts-ignore
    cursor: 'pointer',
  },
  closeModalBtnHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeModalText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  settingsModalBody: {
    paddingVertical: 18,
  },
  settingsGroup: {
    marginBottom: 18,
  },
  settingsGroupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // @ts-ignore
    cursor: 'pointer',
  },
  optionPillActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.25)',
    borderColor: colors.primary,
  },
  optionPillText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  optionPillTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  settingsModalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  doneSettingsBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    // @ts-ignore
    cursor: 'pointer',
  },
  doneSettingsBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0D11',
  },
});

export default VideoOverlay;
