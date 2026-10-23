"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const useScale_1 = require("../../hooks/useScale");
const SeekBar = react_1.default.memo(({ currentTime, duration }) => {
    const percentage = react_1.default.useMemo(() => {
        if (!duration)
            return 0;
        return (currentTime / duration) * 100;
    }, [currentTime, duration]);
    const thumbPosition = react_native_1.I18nManager.isRTL
        ? { right: `${percentage}%` }
        : { left: `${percentage}%` };
    return (<react_native_1.View style={seekBarStyles.seekbarContainer}>
      <react_native_1.View style={seekBarStyles.seekbarTrack}/>
      <react_native_1.View style={[seekBarStyles.seekbarThumb, thumbPosition]}/>
    </react_native_1.View>);
});
const seekBarStyles = react_native_1.StyleSheet.create({
    seekbarContainer: {
        flex: 1,
        height: (0, useScale_1.scaledPixels)(40),
        justifyContent: "center",
        marginEnd: (0, useScale_1.scaledPixels)(80),
    },
    seekbarTrack: {
        width: "100%",
        height: (0, useScale_1.scaledPixels)(5),
        backgroundColor: "#888",
        borderRadius: (0, useScale_1.scaledPixels)(2.5),
    },
    seekbarThumb: {
        position: "absolute",
        width: (0, useScale_1.scaledPixels)(20),
        height: (0, useScale_1.scaledPixels)(20),
        borderRadius: (0, useScale_1.scaledPixels)(10),
        backgroundColor: "#fff",
    },
});
exports.default = SeekBar;
