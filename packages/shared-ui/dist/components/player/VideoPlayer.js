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
const react_native_video_1 = __importDefault(require("react-native-video"));
const react_native_1 = require("react-native");
const VideoPlayer = react_1.default.memo(react_1.default.forwardRef(({ movie, headerImage, paused, controls, onBuffer, onProgress, onLoad, onEnd, }, ref) => {
    const { width } = (0, react_native_1.useWindowDimensions)();
    // Memoize source object to prevent unnecessary re-renders
    const videoSource = (0, react_1.useMemo)(() => ({ uri: movie }), [movie]);
    // Memoize poster object to prevent unnecessary re-renders
    const posterConfig = (0, react_1.useMemo)(() => react_native_1.Platform.OS === "web"
        ? headerImage || undefined
        : headerImage
            ? {
                source: { uri: headerImage },
                resizeMode: "cover",
            }
            : undefined, [headerImage]);
    // Calculate video style based on current dimensions
    const videoStyle = (0, react_1.useMemo)(() => [
        videoPlayerStyles.video,
        { height: width * (9 / 16) },
    ], [width]);
    return (<react_native_video_1.default ref={ref} source={videoSource} style={videoStyle} controls={controls} paused={paused} onBuffer={({ isBuffering }) => onBuffer(isBuffering)} onProgress={({ currentTime }) => onProgress(currentTime)} onLoad={({ duration }) => onLoad(duration)} onEnd={onEnd} poster={posterConfig} resizeMode="cover"/>);
}));
const videoPlayerStyles = react_native_1.StyleSheet.create({
    video: {
        width: "100%",
    },
});
exports.default = VideoPlayer;
