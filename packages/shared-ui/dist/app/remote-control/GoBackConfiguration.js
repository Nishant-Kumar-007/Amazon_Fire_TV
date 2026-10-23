"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoBackConfiguration = void 0;
const react_1 = require("react");
const native_1 = require("@react-navigation/native");
const RemoteControlManager_1 = __importDefault(require("./RemoteControlManager"));
const SupportedKeys_1 = require("./SupportedKeys");
const MenuContext_1 = require("../../components/MenuContext");
const GoBackConfiguration = () => {
    const navigation = (0, native_1.useNavigation)();
    const { isOpen: isMenuOpen } = (0, MenuContext_1.useMenuContext)();
    const handleBackPress = (0, react_1.useCallback)(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
            if (isMenuOpen) {
                console.log('Menu is open during back navigation');
            }
        }
    }, [navigation, isMenuOpen]);
    (0, react_1.useEffect)(() => {
        const remoteControlListener = (pressedKey) => {
            if (pressedKey === SupportedKeys_1.SupportedKeys.Back) {
                handleBackPress();
            }
        };
        RemoteControlManager_1.default.addKeydownListener(remoteControlListener);
        return () => RemoteControlManager_1.default.removeKeydownListener(remoteControlListener);
    }, [handleBackPress]);
    return null;
};
exports.GoBackConfiguration = GoBackConfiguration;
