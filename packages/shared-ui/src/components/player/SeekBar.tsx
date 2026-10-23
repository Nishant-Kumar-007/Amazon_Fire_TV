import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { colors } from "../../theme";

interface SeekBarProps {
  currentTime: number;
  duration: number;
  previewImage?: string;
  onSeekTo?: (timeSec: number) => void;
}

const SeekBar: React.FC<SeekBarProps> = ({
  currentTime,
  duration,
  previewImage = "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80",
  onSeekTo,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverX, setHoverX] = useState(0);
  const [trackWidth, setTrackWidth] = useState(600);
  const trackRef = useRef<View>(null);

  const percentage = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  // Hover timestamp calculation
  const hoverPercent = useMemo(() => {
    if (trackWidth <= 0) return 0;
    return Math.min(1, Math.max(0, hoverX / trackWidth));
  }, [hoverX, trackWidth]);

  const hoverTimeSec = useMemo(() => {
    return Math.round(hoverPercent * (duration || 0));
  }, [hoverPercent, duration]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m.toString().padStart(2, "0")}:${s}`;
  };

  const handleMouseMove = (e: any) => {
    // Web mouse move event
    if (Platform.OS === "web") {
      const nativeEvent = e.nativeEvent || e;
      const rect = e.currentTarget?.getBoundingClientRect?.();
      if (rect) {
        const x = nativeEvent.clientX - rect.left;
        setHoverX(Math.max(0, Math.min(rect.width, x)));
        setTrackWidth(rect.width);
      }
    }
  };

  const handleClick = (e: any) => {
    if (!onSeekTo || !duration) return;
    if (Platform.OS === "web") {
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

  return (
    <View style={styles.container}>
      {/* Floating Hover Video Frame Preview Tooltip */}
      {isHovered && duration > 0 && (
        <View
          style={[
            styles.previewTooltip,
            { left: Math.max(20, Math.min(trackWidth - 140, hoverX - 70)) },
          ]}
        >
          <View style={styles.previewFrame}>
            <Image
              source={{ uri: previewImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.previewTimeBadge}>
              <Text style={styles.previewTimeText}>{formatTime(hoverTimeSec)}</Text>
            </View>
          </View>
          <View style={styles.tooltipPointer} />
        </View>
      )}

      {/* Interactive Timeline Track */}
      <Pressable
        ref={trackRef}
        onPress={handleClick}
        // @ts-ignore
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onLayout={(e) => {
          if (e.nativeEvent.layout.width > 0) {
            setTrackWidth(e.nativeEvent.layout.width);
          }
        }}
        style={[styles.trackHitSlop, isHovered && styles.trackHitSlopHovered]}
      >
        <View style={styles.trackBackground}>
          {/* Played Amber Progress */}
          <View style={[styles.trackProgress, { width: `${percentage}%` }]} />

          {/* Hover Scrubbing Line Indicator */}
          {isHovered && (
            <View
              style={[
                styles.trackHoverIndicator,
                { left: `${hoverPercent * 100}%` },
              ]}
            />
          )}
        </View>

        {/* Scrubbing Thumb with Glowing White/Amber Boundary */}
        <View
          style={[
            styles.thumb,
            { left: `${percentage}%` },
            isHovered && styles.thumbHovered,
          ]}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: colors.primary,
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
    borderColor: colors.primary,
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
    color: colors.primary,
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

export default SeekBar;
