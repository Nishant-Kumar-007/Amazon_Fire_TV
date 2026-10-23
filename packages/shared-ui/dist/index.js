"use strict";
// ViewEase TV - Shared UI Package Index
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteControlManager = exports.scaledPixels = exports.DrawerNavigator = exports.RootNavigator = exports.getCloseDrawerDirection = exports.getOpenDrawerDirection = exports.isRTL = exports.VideoHandler = exports.StorageService = exports.FocusLabScreen = exports.SettingsScreen = exports.TVScreen = exports.ExploreScreen = exports.PlayerScreen = exports.DetailsScreen = exports.HomeScreen = exports.SeekBar = exports.VideoPlayer = exports.VideoOverlay = exports.ViewEaseAssistOverlay = exports.CustomDrawerContent = exports.useMenuContext = exports.MenuProvider = exports.LoadingIndicator = exports.FocusablePressable = exports.AppNavigator = void 0;
// Main App Navigator
var AppNavigator_1 = require("./navigation/AppNavigator");
Object.defineProperty(exports, "AppNavigator", { enumerable: true, get: function () { return __importDefault(AppNavigator_1).default; } });
// Theme
__exportStar(require("./theme"), exports);
// Components
var FocusablePressable_1 = require("./components/FocusablePressable");
Object.defineProperty(exports, "FocusablePressable", { enumerable: true, get: function () { return __importDefault(FocusablePressable_1).default; } });
var LoadingIndicator_1 = require("./components/LoadingIndicator");
Object.defineProperty(exports, "LoadingIndicator", { enumerable: true, get: function () { return __importDefault(LoadingIndicator_1).default; } });
var MenuContext_1 = require("./components/MenuContext");
Object.defineProperty(exports, "MenuProvider", { enumerable: true, get: function () { return MenuContext_1.MenuProvider; } });
Object.defineProperty(exports, "useMenuContext", { enumerable: true, get: function () { return MenuContext_1.useMenuContext; } });
var CustomDrawerContent_1 = require("./components/CustomDrawerContent");
Object.defineProperty(exports, "CustomDrawerContent", { enumerable: true, get: function () { return __importDefault(CustomDrawerContent_1).default; } });
var ViewEaseAssistOverlay_1 = require("./components/player/ViewEaseAssistOverlay");
Object.defineProperty(exports, "ViewEaseAssistOverlay", { enumerable: true, get: function () { return ViewEaseAssistOverlay_1.ViewEaseAssistOverlay; } });
var VideoOverlay_1 = require("./components/player/VideoOverlay");
Object.defineProperty(exports, "VideoOverlay", { enumerable: true, get: function () { return __importDefault(VideoOverlay_1).default; } });
var VideoPlayer_1 = require("./components/player/VideoPlayer");
Object.defineProperty(exports, "VideoPlayer", { enumerable: true, get: function () { return __importDefault(VideoPlayer_1).default; } });
var SeekBar_1 = require("./components/player/SeekBar");
Object.defineProperty(exports, "SeekBar", { enumerable: true, get: function () { return __importDefault(SeekBar_1).default; } });
// Screens
var HomeScreen_1 = require("./screens/HomeScreen");
Object.defineProperty(exports, "HomeScreen", { enumerable: true, get: function () { return __importDefault(HomeScreen_1).default; } });
var DetailsScreen_1 = require("./screens/DetailsScreen");
Object.defineProperty(exports, "DetailsScreen", { enumerable: true, get: function () { return __importDefault(DetailsScreen_1).default; } });
var PlayerScreen_1 = require("./screens/PlayerScreen");
Object.defineProperty(exports, "PlayerScreen", { enumerable: true, get: function () { return __importDefault(PlayerScreen_1).default; } });
var ExploreScreen_1 = require("./screens/ExploreScreen");
Object.defineProperty(exports, "ExploreScreen", { enumerable: true, get: function () { return __importDefault(ExploreScreen_1).default; } });
var TVScreen_1 = require("./screens/TVScreen");
Object.defineProperty(exports, "TVScreen", { enumerable: true, get: function () { return __importDefault(TVScreen_1).default; } });
var SettingsScreen_1 = require("./screens/SettingsScreen");
Object.defineProperty(exports, "SettingsScreen", { enumerable: true, get: function () { return __importDefault(SettingsScreen_1).default; } });
var FocusLabScreen_1 = require("./screens/FocusLabScreen");
Object.defineProperty(exports, "FocusLabScreen", { enumerable: true, get: function () { return __importDefault(FocusLabScreen_1).default; } });
// Data & Services
__exportStar(require("./data/viewEaseCatalog"), exports);
__exportStar(require("./data/moviesData"), exports);
var StorageService_1 = require("./services/StorageService");
Object.defineProperty(exports, "StorageService", { enumerable: true, get: function () { return StorageService_1.StorageService; } });
__exportStar(require("./services/assist/ViewEaseAssistProvider"), exports);
// TVBridge Layer
__exportStar(require("./tvbridge/TVBridge"), exports);
// Utils
var VideoHandler_1 = require("./utils/VideoHandler");
Object.defineProperty(exports, "VideoHandler", { enumerable: true, get: function () { return VideoHandler_1.VideoHandler; } });
var rtl_1 = require("./utils/rtl");
Object.defineProperty(exports, "isRTL", { enumerable: true, get: function () { return rtl_1.isRTL; } });
Object.defineProperty(exports, "getOpenDrawerDirection", { enumerable: true, get: function () { return rtl_1.getOpenDrawerDirection; } });
Object.defineProperty(exports, "getCloseDrawerDirection", { enumerable: true, get: function () { return rtl_1.getCloseDrawerDirection; } });
// Navigation
var RootNavigator_1 = require("./navigation/RootNavigator");
Object.defineProperty(exports, "RootNavigator", { enumerable: true, get: function () { return __importDefault(RootNavigator_1).default; } });
var DrawerNavigator_1 = require("./navigation/DrawerNavigator");
Object.defineProperty(exports, "DrawerNavigator", { enumerable: true, get: function () { return __importDefault(DrawerNavigator_1).default; } });
__exportStar(require("./navigation/types"), exports);
// Hooks
var useScale_1 = require("./hooks/useScale");
Object.defineProperty(exports, "scaledPixels", { enumerable: true, get: function () { return useScale_1.scaledPixels; } });
// Remote Control
require("./app/configureRemoteControl");
var RemoteControlManager_1 = require("./app/remote-control/RemoteControlManager");
Object.defineProperty(exports, "RemoteControlManager", { enumerable: true, get: function () { return __importDefault(RemoteControlManager_1).default; } });
__exportStar(require("./app/remote-control/SupportedKeys"), exports);
