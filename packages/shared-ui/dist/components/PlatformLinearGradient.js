"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const PlatformLinearGradient = ({ colors, style, start, end, children, }) => {
    if (react_native_1.Platform.OS === 'web' && colors && colors.length > 0) {
        let direction = 'to bottom';
        if (start && end) {
            if (start.x < end.x && start.y === end.y) {
                direction = 'to right';
            }
            else if (start.x === end.x && start.y < end.y) {
                direction = 'to bottom';
            }
            else if (start.x < end.x && start.y < end.y) {
                direction = 'to bottom right';
            }
        }
        const gradientCss = `linear-gradient(${direction}, ${colors.join(', ')})`;
        return (<react_native_1.View style={[
                style,
                {
                    backgroundImage: gradientCss,
                    pointerEvents: 'none',
                },
            ]}>
        {children}
      </react_native_1.View>);
    }
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
