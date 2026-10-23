"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const LoadingIndicator = react_1.default.memo(() => {
    const styles = loadingIndicatorStyles;
    return (<react_native_1.View style={styles.loadingContainer}>
      <react_native_1.ActivityIndicator size="large" color="#ffffff"/>
    </react_native_1.View>);
});
const loadingIndicatorStyles = react_native_1.StyleSheet.create({
    loadingContainer: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
});
exports.default = LoadingIndicator;
