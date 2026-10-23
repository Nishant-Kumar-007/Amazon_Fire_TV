"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRTL = isRTL;
exports.getOpenDrawerDirection = getOpenDrawerDirection;
exports.getCloseDrawerDirection = getCloseDrawerDirection;
const react_native_1 = require("react-native");
function isRTL() {
    return react_native_1.I18nManager.isRTL;
}
function getOpenDrawerDirection() {
    return react_native_1.I18nManager.isRTL ? 'right' : 'left';
}
function getCloseDrawerDirection() {
    return react_native_1.I18nManager.isRTL ? 'left' : 'right';
}
