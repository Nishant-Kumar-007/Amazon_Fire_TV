"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mitt_1 = __importDefault(require("mitt"));
const react_native_keyevent_1 = __importDefault(require("react-native-keyevent"));
const SupportedKeys_1 = require("./SupportedKeys");
const KEY_CODE_MAPPING = {
    21: SupportedKeys_1.SupportedKeys.Left,
    22: SupportedKeys_1.SupportedKeys.Right,
    20: SupportedKeys_1.SupportedKeys.Down,
    19: SupportedKeys_1.SupportedKeys.Up,
    66: SupportedKeys_1.SupportedKeys.Enter,
    23: SupportedKeys_1.SupportedKeys.Enter,
    67: SupportedKeys_1.SupportedKeys.Back,
    85: SupportedKeys_1.SupportedKeys.PlayPause,
    89: SupportedKeys_1.SupportedKeys.Rewind,
    90: SupportedKeys_1.SupportedKeys.FastForward,
};
class RemoteControlManager {
    eventEmitter = (0, mitt_1.default)();
    constructor() {
        react_native_keyevent_1.default.onKeyDownListener(this.handleKeyDown);
    }
    handleKeyDown = (keyEvent) => {
        const mappedKey = KEY_CODE_MAPPING[keyEvent.keyCode];
        if (mappedKey) {
            console.log(`Key pressed: ${mappedKey}`);
            this.eventEmitter.emit('keyDown', mappedKey);
        }
    };
    addKeydownListener = (listener) => {
        this.eventEmitter.on('keyDown', listener);
        console.log('Key listener added');
        return listener;
    };
    removeKeydownListener = (listener) => {
        this.eventEmitter.off('keyDown', listener);
        console.log('Key listener removed');
    };
    emitKeyDown = (key) => {
        this.eventEmitter.emit('keyDown', key);
    };
    cleanup = () => {
        react_native_keyevent_1.default.removeKeyDownListener();
    };
}
exports.default = new RemoteControlManager();
