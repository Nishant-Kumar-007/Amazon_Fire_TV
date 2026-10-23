"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mitt_1 = __importDefault(require("mitt"));
const react_native_1 = require("react-native");
const SupportedKeys_1 = require("./SupportedKeys");
const KEY_MAPPING = {
    ArrowRight: SupportedKeys_1.SupportedKeys.Right,
    ArrowLeft: SupportedKeys_1.SupportedKeys.Left,
    ArrowUp: SupportedKeys_1.SupportedKeys.Up,
    ArrowDown: SupportedKeys_1.SupportedKeys.Down,
    Enter: SupportedKeys_1.SupportedKeys.Enter,
    Backspace: SupportedKeys_1.SupportedKeys.Back,
    GoBack: SupportedKeys_1.SupportedKeys.Back, // For LG WebOS Magic Remote
};
class RemoteControlManager {
    eventEmitter = (0, mitt_1.default)();
    constructor() {
        if (react_native_1.Platform.OS === 'web') {
            window.addEventListener('keydown', this.handleKeyDown);
        }
    }
    handleKeyDown = (event) => {
        const mappedKey = KEY_MAPPING[event.code] || KEY_MAPPING[event.key];
        if (mappedKey) {
            this.eventEmitter.emit('keyDown', mappedKey);
        }
    };
    addKeydownListener = (listener) => {
        this.eventEmitter.on('keyDown', listener);
        return listener;
    };
    removeKeydownListener = (listener) => {
        this.eventEmitter.off('keyDown', listener);
    };
    emitKeyDown = (key) => {
        this.eventEmitter.emit('keyDown', key);
    };
}
exports.default = new RemoteControlManager();
