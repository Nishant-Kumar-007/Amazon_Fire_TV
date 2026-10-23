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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomDrawerContent;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const drawer_1 = require("@react-navigation/drawer");
const useScale_1 = require("../hooks/useScale");
const MenuContext_1 = require("../components/MenuContext");
const theme_1 = require("../theme");
const rtl_1 = require("../utils/rtl");
function CustomDrawerContent(props) {
    const navigation = props.navigation;
    const { isOpen: isMenuOpen, toggleMenu } = (0, MenuContext_1.useMenuContext)();
    const styles = drawerStyles;
    const drawerItems = [
        { name: 'Home', label: 'Home', icon: '🏠' },
        { name: 'Explore', label: 'Browse', icon: '🔍' },
        { name: 'TV', label: 'My List', icon: '🔖' },
        { name: 'ParityLab', label: 'Parity Lab', icon: '⚖' },
    ];
    const onDirectionHandledWithoutMovement = (0, react_1.useCallback)((movement) => {
        if (movement === (0, rtl_1.getCloseDrawerDirection)()) {
            navigation.closeDrawer();
            toggleMenu(false);
        }
    }, [navigation, toggleMenu]);
    return (<react_tv_space_navigation_1.SpatialNavigationRoot isActive={isMenuOpen} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <react_native_1.View style={styles.drawerContainer}>
        {/* Scrim Overlay */}
        <react_native_1.View style={styles.scrimOverlay}/>

        <drawer_1.DrawerContentScrollView {...props} style={styles.container} scrollEnabled={false} contentContainerStyle={{
            ...(react_native_1.Platform.OS === 'ios' &&
                react_native_1.Platform.isTV && { paddingStart: 0, paddingEnd: 0, paddingTop: 0 }),
        }}>
          {/* ViewEase Brand Header */}
          <react_native_1.View style={styles.header}>
            <react_native_1.View style={styles.brandBadge}>
              <react_native_1.Text style={styles.brandBadgeText}>VIEWEASE TV</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.Text style={styles.brandTitle}>ViewEase TV</react_native_1.Text>
            <react_native_1.Text style={styles.brandTagline}>Every Scene, Understood.</react_native_1.Text>
          </react_native_1.View>

          {/* Navigation Items */}
          <react_tv_space_navigation_1.SpatialNavigationNode orientation="vertical">
            <react_native_1.View>
              {drawerItems.map((item, index) => {
            const Component = index === 0 ? react_tv_space_navigation_1.DefaultFocus : react_1.default.Fragment;
            return (<Component key={item.name}>
                    <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => {
                    navigation.jumpTo(item.name);
                    navigation.closeDrawer();
                    toggleMenu(false);
                }}>
                      {({ isFocused }) => (<react_native_1.View style={[
                        styles.menuItem,
                        isFocused && styles.menuItemFocused,
                    ]}>
                          <react_native_1.Text style={styles.menuIcon}>{item.icon}</react_native_1.Text>
                          <react_native_1.Text style={[
                        styles.menuText,
                        isFocused && styles.menuTextFocused,
                    ]}>
                            {item.label}
                          </react_native_1.Text>
                        </react_native_1.View>)}
                    </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                  </Component>);
        })}
            </react_native_1.View>
          </react_tv_space_navigation_1.SpatialNavigationNode>
        </drawer_1.DrawerContentScrollView>

        {/* Footer: Settings */}
        <react_native_1.View style={styles.footer}>
          <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => {
            navigation.jumpTo('Settings');
            navigation.closeDrawer();
            toggleMenu(false);
        }}>
            {({ isFocused }) => (<react_native_1.View style={[
                styles.settingsButton,
                isFocused && styles.settingsButtonFocused,
            ]}>
                <react_native_1.Text style={styles.settingsIcon}>⚙</react_native_1.Text>
                <react_native_1.Text style={[
                styles.settingsText,
                isFocused && styles.settingsTextFocused,
            ]}>
                  Settings
                </react_native_1.Text>
              </react_native_1.View>)}
          </react_tv_space_navigation_1.SpatialNavigationFocusableView>
        </react_native_1.View>
      </react_native_1.View>
    </react_tv_space_navigation_1.SpatialNavigationRoot>);
}
const drawerStyles = react_native_1.StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: theme_1.colors.sidebar,
        borderEndWidth: (0, useScale_1.scaledPixels)(1),
        borderEndColor: theme_1.colors.border,
    },
    scrimOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(8, 10, 13, 0.96)',
    },
    container: {
        flex: 1,
        paddingTop: (0, useScale_1.scaledPixels)(theme_1.safeZones.titleSafe.vertical),
    },
    header: {
        paddingHorizontal: (0, useScale_1.scaledPixels)(24),
        paddingVertical: (0, useScale_1.scaledPixels)(20),
        marginBottom: (0, useScale_1.scaledPixels)(16),
        borderBottomWidth: (0, useScale_1.scaledPixels)(1),
        borderBottomColor: theme_1.colors.border,
    },
    brandBadge: {
        backgroundColor: theme_1.colors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: (0, useScale_1.scaledPixels)(8),
        paddingVertical: (0, useScale_1.scaledPixels)(3),
        borderRadius: (0, useScale_1.scaledPixels)(4),
        marginBottom: (0, useScale_1.scaledPixels)(8),
    },
    brandBadgeText: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '800',
        fontSize: (0, useScale_1.scaledPixels)(11),
        letterSpacing: 1,
    },
    brandTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(26),
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    brandTagline: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(14),
        marginTop: (0, useScale_1.scaledPixels)(4),
        fontStyle: 'italic',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: (0, useScale_1.scaledPixels)(14),
        paddingHorizontal: (0, useScale_1.scaledPixels)(20),
        marginHorizontal: (0, useScale_1.scaledPixels)(12),
        marginVertical: (0, useScale_1.scaledPixels)(4),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: 'transparent',
    },
    menuItemFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.04 }],
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: (0, useScale_1.scaledPixels)(10),
        elevation: 8,
    },
    menuIcon: {
        fontSize: (0, useScale_1.scaledPixels)(20),
        marginEnd: (0, useScale_1.scaledPixels)(14),
    },
    menuText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(20),
        fontWeight: '600',
    },
    menuTextFocused: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '800',
    },
    footer: {
        paddingHorizontal: (0, useScale_1.scaledPixels)(12),
        paddingBottom: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.vertical),
        paddingTop: (0, useScale_1.scaledPixels)(12),
        borderTopWidth: (0, useScale_1.scaledPixels)(1),
        borderTopColor: theme_1.colors.border,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: (0, useScale_1.scaledPixels)(14),
        paddingHorizontal: (0, useScale_1.scaledPixels)(20),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: 'transparent',
    },
    settingsButtonFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.04 }],
    },
    settingsIcon: {
        fontSize: (0, useScale_1.scaledPixels)(20),
        color: theme_1.colors.textSecondary,
        marginEnd: (0, useScale_1.scaledPixels)(14),
    },
    settingsText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(18),
        fontWeight: '600',
    },
    settingsTextFocused: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '800',
    },
});
