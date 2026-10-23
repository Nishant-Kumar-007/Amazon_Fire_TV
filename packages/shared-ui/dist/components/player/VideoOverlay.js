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
const SeekBar_1 = __importDefault(require("./SeekBar"));
const LoadingIndicator_1 = __importDefault(require("../LoadingIndicator"));
const theme_1 = require("../../theme");
const PlatformLinearGradient_1 = __importDefault(require("../PlatformLinearGradient"));
const VideoOverlay = react_1.default.memo(({ visible, paused, onPlayPause, onExit, onSeekRelative, onSeekTo, onOpenAssist, onSpeedChange, currentTime, duration, title = 'The Quantum Horizon', previewImage, isBuffering = false, }) => {
    const opacity = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    // Settings State: Quality, Speed, Captions
    const [settingsModalVisible, setSettingsModalVisible] = (0, react_1.useState)(false);
    const [selectedQuality, setSelectedQuality] = (0, react_1.useState)('1080p FHD');
    const [selectedSpeed, setSelectedSpeed] = (0, react_1.useState)(1.0);
    const [selectedCaption, setSelectedCaption] = (0, react_1.useState)('English [CC]');
    const [hoveredBtn, setHoveredBtn] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        react_native_1.Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [visible, opacity]);
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds) || seconds < 0)
            return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60)
            .toString()
            .padStart(2, '0');
        return `${m.toString().padStart(2, '0')}:${s}`;
    };
    const formattedCurrentTime = (0, react_1.useMemo)(() => formatTime(currentTime), [currentTime]);
    const formattedDuration = (0, react_1.useMemo)(() => formatTime(duration), [duration]);
    const handleSpeedSelect = (speed) => {
        setSelectedSpeed(speed);
        if (onSpeedChange) {
            onSpeedChange(speed);
        }
    };
    if (!visible && !settingsModalVisible) {
        return null;
    }
    return (<react_native_1.Animated.View style={[styles.container, { opacity }]} pointerEvents="box-none">
      {/* Top Scrim Bar */}
      <PlatformLinearGradient_1.default colors={['rgba(11, 13, 17, 0.95)', 'rgba(11, 13, 17, 0.5)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.topGradient}/>

      {/* Top Header Bar */}
      <react_native_1.View style={styles.topBar}>
        <react_native_1.View style={styles.topBarRow}>
          {/* Back / Exit Button */}
          <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Exit player" onPress={onExit} 
    // @ts-ignore
    onMouseEnter={() => setHoveredBtn('exit')} onMouseLeave={() => setHoveredBtn(null)} style={({ hovered }) => [
            styles.topBtn,
            (hovered || hoveredBtn === 'exit') && styles.topBtnHovered,
        ]}>
            <react_native_1.Text style={styles.topBtnText}>← Exit</react_native_1.Text>
          </react_native_1.Pressable>

          {/* Title & Info */}
          <react_native_1.View style={styles.titleContainer}>
            <react_native_1.Text style={styles.videoTitle} numberOfLines={1}>
              {title}
            </react_native_1.Text>
            <react_native_1.View style={styles.liveBadgeRow}>
              <react_native_1.View style={styles.hdBadge}>
                <react_native_1.Text style={styles.hdBadgeText}>{selectedQuality}</react_native_1.Text>
              </react_native_1.View>
              {selectedSpeed !== 1.0 && (<react_native_1.View style={styles.speedBadge}>
                  <react_native_1.Text style={styles.speedBadgeText}>{selectedSpeed}x</react_native_1.Text>
                </react_native_1.View>)}
              <react_native_1.Text style={styles.audioBadgeText}>Dolby Atmos • {selectedCaption}</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>

          {/* Top Right Actions: Settings & Assist */}
          <react_native_1.View style={styles.topRightGroup}>
            {/* Player Settings (⚙) Button */}
            <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Video Settings" onPress={() => setSettingsModalVisible(true)} 
    // @ts-ignore
    onMouseEnter={() => setHoveredBtn('settings-top')} onMouseLeave={() => setHoveredBtn(null)} style={({ hovered }) => [
            styles.iconBtn,
            (hovered || hoveredBtn === 'settings-top') && styles.iconBtnHovered,
        ]}>
              <react_native_1.Text style={styles.iconBtnText}>⚙</react_native_1.Text>
            </react_native_1.Pressable>

            {/* ViewEase Assist Top CTA */}
            <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Open ViewEase Assist" onPress={onOpenAssist} 
    // @ts-ignore
    onMouseEnter={() => setHoveredBtn('assist-top')} onMouseLeave={() => setHoveredBtn(null)} style={({ hovered }) => [
            styles.assistTopBtn,
            (hovered || hoveredBtn === 'assist-top') && styles.assistTopBtnHovered,
        ]}>
              <react_native_1.Text style={styles.assistTopBtnIcon}>⚡</react_native_1.Text>
              <react_native_1.Text style={styles.assistTopBtnText}>ViewEase Assist</react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>

      {/* Center Buffering State */}
      {isBuffering && (<react_native_1.View style={styles.bufferingBox}>
          <LoadingIndicator_1.default />
          <react_native_1.Text style={styles.bufferingText}>Buffering stream...</react_native_1.Text>
        </react_native_1.View>)}

      {/* Bottom Scrim Bar */}
      <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11, 13, 17, 0.7)', 'rgba(11, 13, 17, 0.98)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.bottomGradient}/>

      {/* Bottom Transport Controls */}
      <react_native_1.View style={styles.bottomControls}>
        {/* SeekBar Line & Timestamp with Hover Thumbnail Frame Preview */}
        <react_native_1.View style={styles.seekBarRow}>
          <react_native_1.Text style={styles.timeLabel}>{formattedCurrentTime}</react_native_1.Text>
          <react_native_1.View style={styles.seekBarWrapper}>
            <SeekBar_1.default currentTime={currentTime} duration={duration} previewImage={previewImage} onSeekTo={onSeekTo}/>
          </react_native_1.View>
          <react_native_1.Text style={styles.timeLabel}>{formattedDuration}</react_native_1.Text>
        </react_native_1.View>

        {/* Buttons Row with White/Amber Highlight Boundaries on Hover & Remote */}
        <react_native_1.View style={styles.controlsRow}>
          {/* Rewind -10s */}
          <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Rewind 10 seconds" onPress={() => onSeekRelative(-10)} 
    // @ts-ignore
    onMouseEnter={() => setHoveredBtn('rewind')} onMouseLeave={() => setHoveredBtn(null)} style={({ hovered }) => [
            styles.controlBtn,
            (hovered || hoveredBtn === 'rewind') && styles.controlBtnHovered,
        ]}>
            <react_native_1.Text style={styles.controlBtnText}>⏮ -10s</react_native_1.Text>
          </react_native_1.Pressable>

          {/* Play/Pause Button */}
          <react_native_1.Pressable accessibilityRole="button" accessibilityLabel={paused ? 'Play' : 'Pause'} onPress={onPlayPause} 
    // @ts-ignore
    onMouseEnter={() => setHoveredBtn('play')} onMouseLeave={() => setHoveredBtn(null)} style={({ hovered }) => [
            styles.controlBtn,
            styles.playPauseBtn,
            (hovered || hoveredBtn === 'play') && styles.playPauseBtnHovered,
        ]}>
            <react_native_1.Text style={styles.playPauseBtnText}>
              {paused ? '▶ Play' : '⏸ Pause'}
            </react_native_1.Text>
          </react_native_1.Pressable>

          {/* FastForward +10s */}
          <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Fast forward 10 seconds" onPress={() => onSeekRelative(10)} 
    // @ts-ignore
    onMouseEnter={() => setHoveredBtn('forward')} onMouseLeave={() => setHoveredBtn(null)} style={({ hovered }) => [
            styles.controlBtn,
            (hovered || hoveredBtn === 'forward') && styles.controlBtnHovered,
        ]}>
            <react_native_1.Text style={styles.controlBtnText}>⏭ +10s</react_native_1.Text>
          </react_native_1.Pressable>

          {/* Settings Button */}
          <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => setSettingsModalVisible(true)} 
    // @ts-ignore
    onMouseEnter={() => setHoveredBtn('settings-bottom')} onMouseLeave={() => setHoveredBtn(null)} style={({ hovered }) => [
            styles.controlBtn,
            styles.settingsBtn,
            (hovered || hoveredBtn === 'settings-bottom') && styles.controlBtnHovered,
        ]}>
            <react_native_1.Text style={styles.settingsBtnIcon}>⚙</react_native_1.Text>
            <react_native_1.Text style={styles.controlBtnText}>Settings</react_native_1.Text>
          </react_native_1.Pressable>

          {/* Assist Companion Button */}
          <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="ViewEase Assist" onPress={onOpenAssist} 
    // @ts-ignore
    onMouseEnter={() => setHoveredBtn('assist-bottom')} onMouseLeave={() => setHoveredBtn(null)} style={({ hovered }) => [
            styles.controlBtn,
            styles.assistBarBtn,
            (hovered || hoveredBtn === 'assist-bottom') && styles.assistBarBtnHovered,
        ]}>
            <react_native_1.Text style={styles.assistBarIcon}>⚡</react_native_1.Text>
            <react_native_1.Text style={styles.assistBarText}>ViewEase Assist</react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>
      </react_native_1.View>

      {/* Video Player Settings Modal: Quality, Speed, Captions */}
      <react_native_1.Modal visible={settingsModalVisible} transparent animationType="fade" onRequestClose={() => setSettingsModalVisible(false)}>
        <react_native_1.Pressable style={styles.modalBackdrop} onPress={() => setSettingsModalVisible(false)}>
          <react_native_1.Pressable style={styles.settingsModalCard} onPress={(e) => e.stopPropagation()}>
            <react_native_1.View style={styles.settingsModalHeader}>
              <react_native_1.Text style={styles.settingsModalTitle}>⚙ Video Playback Settings</react_native_1.Text>
              <react_native_1.Pressable onPress={() => setSettingsModalVisible(false)} style={({ hovered }) => [
            styles.closeModalBtn,
            hovered && styles.closeModalBtnHovered,
        ]}>
                <react_native_1.Text style={styles.closeModalText}>✕</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            <react_native_1.View style={styles.settingsModalBody}>
              {/* 1. Quality Setting */}
              <react_native_1.View style={styles.settingsGroup}>
                <react_native_1.Text style={styles.settingsGroupTitle}>VIDEO QUALITY</react_native_1.Text>
                <react_native_1.View style={styles.optionsRow}>
                  {['4K UHD (2160p)', '1080p FHD', '720p HD', 'Auto (Adaptive)'].map((q) => (<react_native_1.Pressable key={q} onPress={() => setSelectedQuality(q)} style={[
                styles.optionPill,
                selectedQuality === q && styles.optionPillActive,
            ]}>
                      <react_native_1.Text style={[
                styles.optionPillText,
                selectedQuality === q && styles.optionPillTextActive,
            ]}>
                        {q}
                      </react_native_1.Text>
                    </react_native_1.Pressable>))}
                </react_native_1.View>
              </react_native_1.View>

              {/* 2. Playback Speed Setting */}
              <react_native_1.View style={styles.settingsGroup}>
                <react_native_1.Text style={styles.settingsGroupTitle}>PLAYBACK SPEED</react_native_1.Text>
                <react_native_1.View style={styles.optionsRow}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (<react_native_1.Pressable key={s} onPress={() => handleSpeedSelect(s)} style={[
                styles.optionPill,
                selectedSpeed === s && styles.optionPillActive,
            ]}>
                      <react_native_1.Text style={[
                styles.optionPillText,
                selectedSpeed === s && styles.optionPillTextActive,
            ]}>
                        {s === 1.0 ? '1.0x (Normal)' : `${s}x`}
                      </react_native_1.Text>
                    </react_native_1.Pressable>))}
                </react_native_1.View>
              </react_native_1.View>

              {/* 3. Captions & Subtitles Setting */}
              <react_native_1.View style={styles.settingsGroup}>
                <react_native_1.Text style={styles.settingsGroupTitle}>CAPTIONS & SUBTITLES</react_native_1.Text>
                <react_native_1.View style={styles.optionsRow}>
                  {['Off', 'English [CC]', 'Hindi [हिन्दी]', 'Spanish', 'French'].map((c) => (<react_native_1.Pressable key={c} onPress={() => setSelectedCaption(c)} style={[
                styles.optionPill,
                selectedCaption === c && styles.optionPillActive,
            ]}>
                      <react_native_1.Text style={[
                styles.optionPillText,
                selectedCaption === c && styles.optionPillTextActive,
            ]}>
                        {c}
                      </react_native_1.Text>
                    </react_native_1.Pressable>))}
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>

            {/* Modal Done Button */}
            <react_native_1.View style={styles.settingsModalFooter}>
              <react_native_1.Pressable onPress={() => setSettingsModalVisible(false)} style={styles.doneSettingsBtn}>
                <react_native_1.Text style={styles.doneSettingsBtnText}>Apply & Return to Video</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.Pressable>
        </react_native_1.Pressable>
      </react_native_1.Modal>
    </react_native_1.Animated.View>);
});
const styles = react_native_1.StyleSheet.create({
    container: {
        ...react_native_1.StyleSheet.absoluteFillObject,
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
        color: theme_1.colors.text,
    },
    titleContainer: {
        flex: 1,
        marginHorizontal: 24,
    },
    videoTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: theme_1.colors.text,
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
        borderColor: theme_1.colors.primary,
    },
    hdBadgeText: {
        fontSize: 10,
        color: theme_1.colors.primary,
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
        color: theme_1.colors.textMuted,
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
        color: theme_1.colors.text,
    },
    assistTopBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        borderWidth: 1.5,
        borderColor: theme_1.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 24,
        // @ts-ignore
        cursor: 'pointer',
    },
    assistTopBtnHovered: {
        backgroundColor: theme_1.colors.primary,
        borderColor: '#FFFFFF',
        // @ts-ignore
        boxShadow: '0 0 20px rgba(229, 169, 60, 0.8)',
    },
    assistTopBtnIcon: {
        fontSize: 14,
        color: theme_1.colors.primary,
        marginRight: 6,
    },
    assistTopBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: theme_1.colors.primary,
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
        color: theme_1.colors.text,
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
        color: theme_1.colors.text,
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
        color: theme_1.colors.text,
    },
    playPauseBtn: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primary,
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
        color: theme_1.colors.text,
    },
    assistBarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(229, 169, 60, 0.15)',
        borderColor: theme_1.colors.primary,
        gap: 6,
    },
    assistBarBtnHovered: {
        backgroundColor: theme_1.colors.primary,
        borderColor: '#FFFFFF',
        // @ts-ignore
        boxShadow: '0 0 22px rgba(229, 169, 60, 0.8)',
        transform: [{ scale: 1.05 }],
    },
    assistBarIcon: {
        fontSize: 14,
        color: theme_1.colors.primary,
    },
    assistBarText: {
        fontSize: 14,
        fontWeight: '800',
        color: theme_1.colors.primary,
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
        color: theme_1.colors.text,
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
        color: theme_1.colors.text,
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
        color: theme_1.colors.textMuted,
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
        borderColor: theme_1.colors.primary,
    },
    optionPillText: {
        fontSize: 13,
        color: theme_1.colors.textMuted,
        fontWeight: '600',
    },
    optionPillTextActive: {
        color: theme_1.colors.primary,
        fontWeight: '800',
    },
    settingsModalFooter: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    doneSettingsBtn: {
        backgroundColor: theme_1.colors.primary,
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
exports.default = VideoOverlay;
