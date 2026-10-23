"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppNavigator;
const react_1 = __importStar(require("react"));
const native_1 = require("@react-navigation/native");
const react_native_1 = require("react-native");
const MenuContext_1 = require("../components/MenuContext");
const GoBackConfiguration_1 = require("../app/remote-control/GoBackConfiguration");
const RootNavigator_1 = __importDefault(require("./RootNavigator"));
function AppNavigator({ fontsLoaded = true, onReady }) {
    (0, react_1.useEffect)(() => {
        // Import remote control config for TV platforms
        if (react_native_1.Platform.isTV) {
            try {
                require('../app/configureRemoteControl');
            }
            catch (error) {
                console.warn('Remote control configuration not available:', error);
            }
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (fontsLoaded && onReady) {
            onReady();
        }
    }, [fontsLoaded, onReady]);
    if (!fontsLoaded) {
        return null;
    }
    return (<react_1.StrictMode>
      <native_1.NavigationContainer theme={native_1.DarkTheme}>
        <MenuContext_1.MenuProvider>
          <GoBackConfiguration_1.GoBackConfiguration />
          <RootNavigator_1.default />
        </MenuContext_1.MenuProvider>
      </native_1.NavigationContainer>
    </react_1.StrictMode>);
}
