"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const FocusablePressable_1 = __importDefault(require("../FocusablePressable"));
const useScale_1 = require("../../hooks/useScale");
const theme_1 = require("../../theme");
const ExitButton = react_1.default.memo(({ onSelect }) => {
    const styles = exitButtonStyles;
    return (<FocusablePressable_1.default text={"Exit"} onSelect={onSelect} style={styles.exitBtn}/>);
});
const exitButtonStyles = react_native_1.StyleSheet.create({
    exitBtn: {
        position: "absolute",
        top: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.vertical),
        start: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
    },
});
exports.default = ExitButton;
