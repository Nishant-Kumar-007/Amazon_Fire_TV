"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const SupportedKeys_1 = require("./remote-control/SupportedKeys");
const RemoteControlManager_1 = __importDefault(require("./remote-control/RemoteControlManager"));
react_tv_space_navigation_1.SpatialNavigation.configureRemoteControl({
    remoteControlSubscriber: (callback) => {
        console.log("Configure remote control");
        const mapping = {
            [SupportedKeys_1.SupportedKeys.Right]: react_tv_space_navigation_1.Directions.RIGHT,
            [SupportedKeys_1.SupportedKeys.Left]: react_tv_space_navigation_1.Directions.LEFT,
            [SupportedKeys_1.SupportedKeys.Up]: react_tv_space_navigation_1.Directions.UP,
            [SupportedKeys_1.SupportedKeys.Down]: react_tv_space_navigation_1.Directions.DOWN,
            [SupportedKeys_1.SupportedKeys.Enter]: react_tv_space_navigation_1.Directions.ENTER,
            [SupportedKeys_1.SupportedKeys.Back]: null,
            [SupportedKeys_1.SupportedKeys.PlayPause]: null,
            [SupportedKeys_1.SupportedKeys.FastForward]: null,
            [SupportedKeys_1.SupportedKeys.Rewind]: null,
        };
        const remoteControlListener = (keyEvent) => {
            callback(mapping[keyEvent]);
        };
        return RemoteControlManager_1.default.addKeydownListener(remoteControlListener);
    },
    remoteControlUnsubscriber: (remoteControlListener) => {
        RemoteControlManager_1.default.removeKeydownListener(remoteControlListener);
    },
});
