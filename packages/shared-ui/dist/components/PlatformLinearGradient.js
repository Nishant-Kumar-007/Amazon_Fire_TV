"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const PlatformLinearGradient = ({ colors, style, children, }) => {
    // Use the last color in the gradient array as the solid background
    const fallbackColor = colors && colors.length > 0
        ? colors[colors.length - 1]
        : 'rgba(0, 0, 0, 0.6)';
    return (<react_native_1.View style={[
            style,
            { backgroundColor: fallbackColor },
        ]}>
      {children}
    </react_native_1.View>);
};
exports.default = PlatformLinearGradient;
