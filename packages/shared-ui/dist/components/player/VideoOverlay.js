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
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const SeekBar_1 = __importDefault(require("./SeekBar"));
const LoadingIndicator_1 = __importDefault(require("../LoadingIndicator"));
const useScale_1 = require("../../hooks/useScale");
const theme_1 = require("../../theme");
const PlatformLinearGradient_1 = __importDefault(require("../PlatformLinearGradient"));
const VideoOverlay = react_1.default.memo(({ visible, paused, onPlayPause, onExit, onSeekRelative, onOpenAssist, currentTime, duration, title = 'The Quantum Horizon', isBuffering = false, }) => {
    const opacity = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
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
    if (!visible) {
        return null;
    }
    return (<react_native_1.Animated.View style={[styles.container, { opacity }]} pointerEvents="box-none">
      {/* Top Scrim Bar */}
      <PlatformLinearGradient_1.default colors={['rgba(11, 13, 17, 0.9)', 'rgba(11, 13, 17, 0.4)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.topGradient}/>

      {/* Top Header Bar */}
      <react_native_1.View style={styles.topBar}>
        <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
          <react_native_1.View style={styles.topBarRow}>
            {/* Back Button */}
            <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={onExit}>
              {({ isFocused }) => (<react_native_1.View style={[styles.topBtn, isFocused && styles.topBtnFocused]}>
                  <react_native_1.Text style={[styles.topBtnText, isFocused && styles.topBtnTextFocused]}>
                    ← Exit
                  </react_native_1.Text>
                </react_native_1.View>)}
            </react_tv_space_navigation_1.SpatialNavigationFocusableView>

            {/* Title & Info */}
            <react_native_1.View style={styles.titleContainer}>
              <react_native_1.Text style={styles.videoTitle} numberOfLines={1}>
                {title}
              </react_native_1.Text>
              <react_native_1.View style={styles.liveBadgeRow}>
                <react_native_1.View style={styles.hdBadge}>
                  <react_native_1.Text style={styles.hdBadgeText}>4K HDR</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={styles.audioBadgeText}>Dolby 5.1</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>

            {/* ViewEase Assist Top CTA */}
            <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={onOpenAssist}>
              {({ isFocused }) => (<react_native_1.View style={[styles.assistTopBtn, isFocused && styles.assistTopBtnFocused]}>
                  <react_native_1.Text style={styles.assistTopBtnIcon}>⚡</react_native_1.Text>
                  <react_native_1.Text style={[
                styles.assistTopBtnText,
                isFocused && styles.assistTopBtnTextFocused,
            ]}>
                    ViewEase Assist
                  </react_native_1.Text>
                </react_native_1.View>)}
            </react_tv_space_navigation_1.SpatialNavigationFocusableView>
          </react_native_1.View>
        </react_tv_space_navigation_1.SpatialNavigationNode>
      </react_native_1.View>

      {/* Center Buffering State */}
      {isBuffering && (<react_native_1.View style={styles.bufferingBox}>
          <LoadingIndicator_1.default />
          <react_native_1.Text style={styles.bufferingText}>Buffering stream...</react_native_1.Text>
        </react_native_1.View>)}

      {/* Bottom Scrim Bar */}
      <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11, 13, 17, 0.65)', 'rgba(11, 13, 17, 0.95)']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.bottomGradient}/>

      {/* Bottom Transport Controls */}
      <react_native_1.View style={styles.bottomControls}>
        {/* SeekBar Line & Timestamp */}
        <react_native_1.View style={styles.seekBarRow}>
          <react_native_1.Text style={styles.timeLabel}>{formattedCurrentTime}</react_native_1.Text>
          <react_native_1.View style={styles.seekBarWrapper}>
            <SeekBar_1.default currentTime={currentTime} duration={duration}/>
          </react_native_1.View>
          <react_native_1.Text style={styles.timeLabel}>{formattedDuration}</react_native_1.Text>
        </react_native_1.View>

        {/* Buttons Row */}
        <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
          <react_native_1.View style={styles.controlsRow}>
            {/* Rewind -10s */}
            <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => onSeekRelative(-10)}>
              {({ isFocused }) => (<react_native_1.View style={[styles.controlBtn, isFocused && styles.controlBtnFocused]}>
                  <react_native_1.Text style={[styles.controlBtnText, isFocused && styles.controlBtnTextFocused]}>
                    ⏮ -10s
                  </react_native_1.Text>
                </react_native_1.View>)}
            </react_tv_space_navigation_1.SpatialNavigationFocusableView>

            {/* Play/Pause Button */}
            <react_tv_space_navigation_1.DefaultFocus>
              <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={onPlayPause}>
                {({ isFocused }) => (<react_native_1.View style={[
                styles.controlBtn,
                styles.playPauseBtn,
                isFocused && styles.controlBtnFocused,
            ]}>
                    <react_native_1.Text style={[
                styles.controlBtnText,
                styles.playPauseBtnText,
                isFocused && styles.controlBtnTextFocused,
            ]}>
                      {paused ? '▶ Play' : '⏸ Pause'}
                    </react_native_1.Text>
                  </react_native_1.View>)}
              </react_tv_space_navigation_1.SpatialNavigationFocusableView>
            </react_tv_space_navigation_1.DefaultFocus>

            {/* FastForward +10s */}
            <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => onSeekRelative(10)}>
              {({ isFocused }) => (<react_native_1.View style={[styles.controlBtn, isFocused && styles.controlBtnFocused]}>
                  <react_native_1.Text style={[styles.controlBtnText, isFocused && styles.controlBtnTextFocused]}>
                    ⏭ +10s
                  </react_native_1.Text>
                </react_native_1.View>)}
            </react_tv_space_navigation_1.SpatialNavigationFocusableView>

            {/* Assist Companion Button */}
            <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={onOpenAssist}>
              {({ isFocused }) => (<react_native_1.View style={[
                styles.controlBtn,
                styles.assistBarBtn,
                isFocused && styles.assistBarBtnFocused,
            ]}>
                  <react_native_1.Text style={styles.assistBarIcon}>⚡</react_native_1.Text>
                  <react_native_1.Text style={[
                styles.assistBarText,
                isFocused && styles.assistBarTextFocused,
            ]}>
                    ViewEase Assist
                  </react_native_1.Text>
                </react_native_1.View>)}
            </react_tv_space_navigation_1.SpatialNavigationFocusableView>
          </react_native_1.View>
        </react_tv_space_navigation_1.SpatialNavigationNode>
      </react_native_1.View>
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
        height: (0, useScale_1.scaledPixels)(150),
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: (0, useScale_1.scaledPixels)(200),
    },
    topBar: {
        paddingHorizontal: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
        paddingTop: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.vertical),
        zIndex: 20,
    },
    topBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topBtn: {
        backgroundColor: 'rgba(24, 28, 36, 0.85)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(18),
        paddingVertical: (0, useScale_1.scaledPixels)(10),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.border,
    },
    topBtnFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.05 }],
    },
    topBtnText: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(16),
        fontWeight: '700',
    },
    topBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    titleContainer: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: (0, useScale_1.scaledPixels)(20),
    },
    videoTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(24),
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    liveBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: (0, useScale_1.scaledPixels)(4),
    },
    hdBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(6),
        paddingVertical: (0, useScale_1.scaledPixels)(2),
        borderRadius: (0, useScale_1.scaledPixels)(3),
        marginEnd: (0, useScale_1.scaledPixels)(8),
    },
    hdBadgeText: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(11),
        fontWeight: '700',
    },
    audioBadgeText: {
        color: theme_1.colors.textTertiary,
        fontSize: (0, useScale_1.scaledPixels)(12),
    },
    assistTopBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(18),
        paddingVertical: (0, useScale_1.scaledPixels)(10),
        borderRadius: (0, useScale_1.scaledPixels)(20),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.primary,
    },
    assistTopBtnFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.06 }],
    },
    assistTopBtnIcon: {
        fontSize: (0, useScale_1.scaledPixels)(16),
        marginEnd: (0, useScale_1.scaledPixels)(6),
    },
    assistTopBtnText: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(16),
        fontWeight: '700',
    },
    assistTopBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    bufferingBox: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(11, 13, 17, 0.75)',
        padding: (0, useScale_1.scaledPixels)(20),
        borderRadius: (0, useScale_1.scaledPixels)(12),
    },
    bufferingText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(16),
        marginTop: (0, useScale_1.scaledPixels)(12),
    },
    bottomControls: {
        paddingHorizontal: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
        paddingBottom: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.vertical),
        zIndex: 20,
    },
    seekBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(14),
    },
    timeLabel: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(15),
        fontWeight: '600',
        fontFamily: react_native_1.Platform.OS === 'web' ? 'monospace' : 'System',
        width: (0, useScale_1.scaledPixels)(60),
        textAlign: 'center',
    },
    seekBarWrapper: {
        flex: 1,
        marginHorizontal: (0, useScale_1.scaledPixels)(12),
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlBtn: {
        backgroundColor: theme_1.colors.card,
        paddingHorizontal: (0, useScale_1.scaledPixels)(20),
        paddingVertical: (0, useScale_1.scaledPixels)(12),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        marginHorizontal: (0, useScale_1.scaledPixels)(10),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playPauseBtn: {
        backgroundColor: theme_1.colors.cardElevated,
        paddingHorizontal: (0, useScale_1.scaledPixels)(28),
    },
    controlBtnFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.08 }],
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: (0, useScale_1.scaledPixels)(12),
        elevation: 8,
    },
    controlBtnText: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(16),
        fontWeight: '700',
    },
    playPauseBtnText: {
        fontSize: (0, useScale_1.scaledPixels)(18),
    },
    controlBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    assistBarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(229, 169, 60, 0.15)',
        borderColor: theme_1.colors.primary,
        marginStart: (0, useScale_1.scaledPixels)(20),
    },
    assistBarBtnFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.08 }],
    },
    assistBarIcon: {
        fontSize: (0, useScale_1.scaledPixels)(16),
        marginEnd: (0, useScale_1.scaledPixels)(6),
    },
    assistBarText: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(16),
        fontWeight: '700',
    },
    assistBarTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
});
exports.default = VideoOverlay;
