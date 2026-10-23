"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const FocusablePressable_1 = __importDefault(require("../FocusablePressable"));
const SeekBar_1 = __importDefault(require("./SeekBar"));
const useScale_1 = require("../../hooks/useScale");
const theme_1 = require("../../theme");
const Controls = react_1.default.memo(({ paused, onPlayPause, currentTime, duration, }) => {
    const styles = controlsStyles;
    return (<react_native_1.View style={styles.bottomControls}>
      <react_tv_space_navigation_1.DefaultFocus>
        <FocusablePressable_1.default text={paused ? "Play" : "Pause"} onSelect={onPlayPause} style={styles.controlButton}/>
      </react_tv_space_navigation_1.DefaultFocus>
      <SeekBar_1.default currentTime={currentTime} duration={duration}/>
    </react_native_1.View>);
});
const controlsStyles = react_native_1.StyleSheet.create({
    bottomControls: {
        position: "absolute",
        bottom: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.vertical),
        start: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
        end: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
        flexDirection: "row",
        alignItems: "center",
    },
    controlButton: {
        marginEnd: (0, useScale_1.scaledPixels)(20),
    },
});
exports.default = Controls;
