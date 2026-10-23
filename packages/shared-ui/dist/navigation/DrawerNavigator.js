"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DrawerNavigator;
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const drawer_1 = require("@react-navigation/drawer");
const native_1 = require("@react-navigation/native");
const MenuContext_1 = require("../components/MenuContext");
const CustomDrawerContent_1 = __importDefault(require("../components/CustomDrawerContent"));
const useScale_1 = require("../hooks/useScale");
// Import screens
const HomeScreen_1 = __importDefault(require("../screens/HomeScreen"));
const ExploreScreen_1 = __importDefault(require("../screens/ExploreScreen"));
const TVScreen_1 = __importDefault(require("../screens/TVScreen"));
const SettingsScreen_1 = __importDefault(require("../screens/SettingsScreen"));
const FocusLabScreen_1 = __importDefault(require("../screens/FocusLabScreen"));
const Drawer = (0, drawer_1.createDrawerNavigator)();
function DrawerSyncWrapper({ drawerNavRef }) {
    const { isOpen: isMenuOpen } = (0, MenuContext_1.useMenuContext)();
    const navigation = (0, native_1.useNavigation)();
    // Capture the drawer navigation object
    (0, react_1.useEffect)(() => {
        drawerNavRef.current = navigation;
    }, [navigation, drawerNavRef]);
    return null;
}
function DrawerNavigator() {
    const styles = drawerStyles;
    const { isOpen: isMenuOpen } = (0, MenuContext_1.useMenuContext)();
    const drawerNavRef = (0, react_1.useRef)(null);
    const navigationContent = (<Drawer.Navigator drawerContent={CustomDrawerContent_1.default} initialRouteName="Home" defaultStatus="closed" screenOptions={{
            headerShown: false,
            drawerActiveBackgroundColor: '#3498db',
            drawerActiveTintColor: '#ffffff',
            drawerInactiveTintColor: '#bdc3c7',
            drawerStyle: styles.drawerStyle,
            drawerLabelStyle: styles.drawerLabelStyle,
            drawerType: 'front',
            swipeEnabled: false,
            drawerPosition: react_native_1.I18nManager.isRTL ? 'right' : 'left',
        }}>
        <Drawer.Screen name="Home" options={{ drawerLabel: 'Home' }}>
          {() => (<>
              <DrawerSyncWrapper drawerNavRef={drawerNavRef}/>
              <HomeScreen_1.default />
            </>)}
        </Drawer.Screen>
        <Drawer.Screen name="Explore" component={ExploreScreen_1.default} options={{
            drawerLabel: 'Explore',
        }}/>
        <Drawer.Screen name="TV" component={TVScreen_1.default} options={{
            drawerLabel: 'My List',
        }}/>
        <Drawer.Screen name="FocusLab" component={FocusLabScreen_1.default} options={{
            drawerLabel: 'FocusLab™',
        }}/>
        <Drawer.Screen name="Settings" component={SettingsScreen_1.default} options={{
            drawerLabel: 'Settings',
        }}/>
      </Drawer.Navigator>);
    // On TV platforms, don't use GestureHandlerRootView as we use remote control navigation
    if (react_native_1.Platform.isTV) {
        return <react_native_1.View style={{ flex: 1 }}>{navigationContent}</react_native_1.View>;
    }
    // On mobile/web, use GestureHandlerRootView for swipe gestures
    return (<react_native_gesture_handler_1.GestureHandlerRootView style={{ flex: 1 }}>
      {navigationContent}
    </react_native_gesture_handler_1.GestureHandlerRootView>);
}
const drawerStyles = react_native_1.StyleSheet.create({
    drawerStyle: {
        width: (0, useScale_1.scaledPixels)(300),
        backgroundColor: '#2c3e50',
        paddingTop: (0, useScale_1.scaledPixels)(0),
    },
    drawerLabelStyle: {
        fontSize: (0, useScale_1.scaledPixels)(18),
        fontWeight: 'bold',
        marginStart: (0, useScale_1.scaledPixels)(10),
    },
});
