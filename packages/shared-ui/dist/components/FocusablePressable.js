"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const useScale_1 = require("../hooks/useScale");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const colors_1 = require("../theme/colors");
const FocusablePressable = react_1.default.memo(({ text, onSelect, style, ...props }) => {
    return (<react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={onSelect}>
      {({ isFocused }) => (<react_native_1.Pressable {...props} style={[
                styles.watchButton,
                isFocused && styles.watchButtonFocused,
                style,
            ]} onPress={onSelect}>
          <react_native_1.Text style={[
                styles.watchButtonText,
                isFocused && styles.watchButtonTextFocused,
            ]}>
            {text}
          </react_native_1.Text>
        </react_native_1.Pressable>)}
    </react_tv_space_navigation_1.SpatialNavigationFocusableView>);
});
const styles = react_native_1.StyleSheet.create({
    watchButton: {
        backgroundColor: colors_1.colors.cardElevated,
        paddingVertical: (0, useScale_1.scaledPixels)(20),
        paddingHorizontal: (0, useScale_1.scaledPixels)(40),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(3),
        borderColor: 'transparent',
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        minWidth: (0, useScale_1.scaledPixels)(200),
        minHeight: (0, useScale_1.scaledPixels)(60),
        maxWidth: '90%',
    },
    watchButtonFocused: {
        backgroundColor: colors_1.colors.focusBackground,
        borderColor: colors_1.colors.focusBackground,
        transform: [{ scale: 1.05 }],
        // Shadow for depth
        shadowColor: colors_1.colors.focus,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.6,
        shadowRadius: (0, useScale_1.scaledPixels)(12),
        elevation: 8,
    },
    watchButtonText: {
        color: colors_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(24),
        fontWeight: "bold",
        textAlign: "center",
    },
    watchButtonTextFocused: {
        color: colors_1.colors.textOnPrimary,
        fontSize: (0, useScale_1.scaledPixels)(24),
        fontWeight: "bold",
    },
});
exports.default = FocusablePressable;
