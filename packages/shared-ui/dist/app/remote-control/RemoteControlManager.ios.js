"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mitt_1 = __importDefault(require("mitt"));
const react_native_1 = require("react-native");
const SupportedKeys_1 = require("./SupportedKeys");
const KEY_MAPPING = {
    right: SupportedKeys_1.SupportedKeys.Right,
    left: SupportedKeys_1.SupportedKeys.Left,
    up: SupportedKeys_1.SupportedKeys.Up,
    down: SupportedKeys_1.SupportedKeys.Down,
    select: SupportedKeys_1.SupportedKeys.Enter,
    swipeLeft: SupportedKeys_1.SupportedKeys.Left,
    swipeRight: SupportedKeys_1.SupportedKeys.Right,
    swipeUp: SupportedKeys_1.SupportedKeys.Up,
    swipeDown: SupportedKeys_1.SupportedKeys.Down
};
class RemoteControlManager {
    eventEmitter = (0, mitt_1.default)();
    tvEventSubscription;
    constructor() {
        this.tvEventSubscription = react_native_1.TVEventHandler?.addListener ? react_native_1.TVEventHandler.addListener(this.handleKeyDown) : undefined;
    }
    handleKeyDown = (evt) => {
        if (!evt)
            return;
        const mappedKey = KEY_MAPPING[evt.eventType];
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
    cleanup = () => {
        this.tvEventSubscription?.remove();
    };
}
exports.default = new RemoteControlManager();
