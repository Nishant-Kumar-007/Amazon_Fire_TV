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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
const SeekBar = ({ currentTime, duration, previewImage = "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80", onSeekTo, }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const [hoverX, setHoverX] = (0, react_1.useState)(0);
    const [trackWidth, setTrackWidth] = (0, react_1.useState)(600);
    const trackRef = (0, react_1.useRef)(null);
    const percentage = (0, react_1.useMemo)(() => {
        if (!duration || duration <= 0)
            return 0;
        return Math.min(100, Math.max(0, (currentTime / duration) * 100));
    }, [currentTime, duration]);
    // Hover timestamp calculation
    const hoverPercent = (0, react_1.useMemo)(() => {
        if (trackWidth <= 0)
            return 0;
        return Math.min(1, Math.max(0, hoverX / trackWidth));
    }, [hoverX, trackWidth]);
    const hoverTimeSec = (0, react_1.useMemo)(() => {
        return Math.round(hoverPercent * (duration || 0));
    }, [hoverPercent, duration]);
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds) || seconds < 0)
            return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");
        return `${m.toString().padStart(2, "0")}:${s}`;
    };
    const handleMouseMove = (e) => {
        // Web mouse move event
        if (react_native_1.Platform.OS === "web") {
            const nativeEvent = e.nativeEvent || e;
            const rect = e.currentTarget?.getBoundingClientRect?.();
            if (rect) {
                const x = nativeEvent.clientX - rect.left;
                setHoverX(Math.max(0, Math.min(rect.width, x)));
                setTrackWidth(rect.width);
            }
        }
    };
    const handleClick = (e) => {
        if (!onSeekTo || !duration)
            return;
        if (react_native_1.Platform.OS === "web") {
            const nativeEvent = e.nativeEvent || e;
            const rect = e.currentTarget?.getBoundingClientRect?.();
            if (rect && rect.width > 0) {
                const x = nativeEvent.clientX - rect.left;
                const clickRatio = Math.max(0, Math.min(1, x / rect.width));
                const targetTime = Math.round(clickRatio * duration);
                onSeekTo(targetTime);
            }
        }
    };
    return (<react_native_1.View style={styles.container}>
      {/* Floating Hover Video Frame Preview Tooltip */}
      {isHovered && duration > 0 && (<react_native_1.View style={[
                styles.previewTooltip,
                { left: Math.max(20, Math.min(trackWidth - 140, hoverX - 70)) },
            ]}>
          <react_native_1.View style={styles.previewFrame}>
            <react_native_1.Image source={{ uri: previewImage }} style={styles.previewImage} resizeMode="cover"/>
            <react_native_1.View style={styles.previewTimeBadge}>
              <react_native_1.Text style={styles.previewTimeText}>{formatTime(hoverTimeSec)}</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
          <react_native_1.View style={styles.tooltipPointer}/>
        </react_native_1.View>)}

      {/* Interactive Timeline Track */}
      <react_native_1.Pressable ref={trackRef} onPress={handleClick} 
    // @ts-ignore
    onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onMouseMove={handleMouseMove} onLayout={(e) => {
            if (e.nativeEvent.layout.width > 0) {
                setTrackWidth(e.nativeEvent.layout.width);
            }
        }} style={[styles.trackHitSlop, isHovered && styles.trackHitSlopHovered]}>
        <react_native_1.View style={styles.trackBackground}>
          {/* Played Amber Progress */}
          <react_native_1.View style={[styles.trackProgress, { width: `${percentage}%` }]}/>

          {/* Hover Scrubbing Line Indicator */}
          {isHovered && (<react_native_1.View style={[
                styles.trackHoverIndicator,
                { left: `${hoverPercent * 100}%` },
            ]}/>)}
        </react_native_1.View>

        {/* Scrubbing Thumb with Glowing White/Amber Boundary */}
        <react_native_1.View style={[
            styles.thumb,
            { left: `${percentage}%` },
            isHovered && styles.thumbHovered,
        ]}/>
      </react_native_1.Pressable>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        height: 48,
        justifyContent: "center",
        position: "relative",
    },
    trackHitSlop: {
        height: 28,
        justifyContent: "center",
        position: "relative",
        // @ts-ignore
        cursor: "pointer",
    },
    trackHitSlopHovered: {
        // @ts-ignore
        cursor: "pointer",
    },
    trackBackground: {
        width: "100%",
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        overflow: "hidden",
        position: "relative",
    },
    trackProgress: {
        height: "100%",
        backgroundColor: theme_1.colors.primary,
        borderRadius: 3,
    },
    trackHoverIndicator: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: "#FFFFFF",
    },
    thumb: {
        position: "absolute",
        top: 6,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        marginLeft: -8,
        borderWidth: 2,
        borderColor: theme_1.colors.primary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    thumbHovered: {
        transform: [{ scale: 1.3 }],
        borderColor: "#FFFFFF",
        // @ts-ignore
        boxShadow: "0 0 12px #FFFFFF",
    },
    // Floating Frame Preview Tooltip
    previewTooltip: {
        position: "absolute",
        bottom: 38,
        width: 140,
        alignItems: "center",
        zIndex: 100,
        pointerEvents: "none",
    },
    previewFrame: {
        width: 136,
        height: 80,
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        backgroundColor: "#0B0D11",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.9,
        shadowRadius: 14,
        position: "relative",
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    previewTimeBadge: {
        position: "absolute",
        bottom: 4,
        alignSelf: "center",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    previewTimeText: {
        color: theme_1.colors.primary,
        fontSize: 10,
        fontWeight: "800",
    },
    tooltipPointer: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 0,
        borderTopWidth: 6,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#FFFFFF",
        marginTop: -1,
    },
});
exports.default = SeekBar;
