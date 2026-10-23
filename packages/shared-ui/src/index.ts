// ViewEase TV - Shared UI Package Index

// Main App Navigator
export { default as AppNavigator } from './navigation/AppNavigator';
export type { AppNavigatorProps } from './navigation/AppNavigator';

// Theme
export * from './theme';

// Components
export { default as FocusablePressable } from './components/FocusablePressable';
export { default as LoadingIndicator } from './components/LoadingIndicator';
export { MenuProvider, useMenuContext } from './components/MenuContext';
export { default as CustomDrawerContent } from './components/CustomDrawerContent';
export { ViewEaseAssistOverlay } from './components/player/ViewEaseAssistOverlay';
export { default as VideoOverlay } from './components/player/VideoOverlay';
export { default as VideoPlayer } from './components/player/VideoPlayer';
export { default as SeekBar } from './components/player/SeekBar';

// Screens
export { default as HomeScreen } from './screens/HomeScreen';
export { default as DetailsScreen } from './screens/DetailsScreen';
export { default as PlayerScreen } from './screens/PlayerScreen';
export { default as ExploreScreen } from './screens/ExploreScreen';
export { default as TVScreen } from './screens/TVScreen';
export { default as SettingsScreen } from './screens/SettingsScreen';
export { default as FocusLabScreen } from './screens/FocusLabScreen';

// Data & Services
export * from './data/viewEaseCatalog';
export * from './data/moviesData';
export { StorageService } from './services/StorageService';
export * from './services/assist/ViewEaseAssistProvider';

// TVBridge Layer
export * from './tvbridge/TVBridge';

// Utils
export { VideoHandler } from './utils/VideoHandler';
export { isRTL, getOpenDrawerDirection, getCloseDrawerDirection } from './utils/rtl';

// Navigation
export { default as RootNavigator } from './navigation/RootNavigator';
export { default as DrawerNavigator } from './navigation/DrawerNavigator';
export * from './navigation/types';

// Hooks
export { scaledPixels } from './hooks/useScale';

// Remote Control
import './app/configureRemoteControl';
export { default as RemoteControlManager } from './app/remote-control/RemoteControlManager';
export * from './app/remote-control/SupportedKeys';
