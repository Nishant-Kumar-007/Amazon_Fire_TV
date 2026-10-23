import React, { useCallback } from 'react';
import { View, StyleSheet, Image, Platform, Text } from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationNode,
} from 'react-tv-space-navigation';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { DrawerParamList } from '../navigation/types';
import { useMenuContext } from '../components/MenuContext';
import { safeZones, colors } from '../theme';
import { getCloseDrawerDirection } from '../utils/rtl';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const navigation = props.navigation;
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const styles = drawerStyles;

  const drawerItems = [
    { name: 'Home', label: 'Home', icon: '🏠' },
    { name: 'Explore', label: 'Browse', icon: '🔍' },
    { name: 'TV', label: 'My List', icon: '🔖' },
    { name: 'FocusLab', label: 'FocusLab™', icon: '🔬' },
  ] as const;

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getCloseDrawerDirection()) {
        navigation.closeDrawer();
        toggleMenu(false);
      }
    },
    [navigation, toggleMenu],
  );

  return (
    <SpatialNavigationRoot
      isActive={isMenuOpen}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.drawerContainer}>
        {/* Scrim Overlay */}
        <View style={styles.scrimOverlay} />

        <DrawerContentScrollView
          {...props}
          style={styles.container}
          scrollEnabled={false}
          contentContainerStyle={{
            ...(Platform.OS === 'ios' &&
              Platform.isTV && { paddingStart: 0, paddingEnd: 0, paddingTop: 0 }),
          }}
        >
          {/* ViewEase Brand Header */}
          <View style={styles.header}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>VIEWEASE TV</Text>
            </View>
            <Text style={styles.brandTitle}>ViewEase TV</Text>
            <Text style={styles.brandTagline}>Every Scene, Understood.</Text>
          </View>

          {/* Navigation Items */}
          <SpatialNavigationNode orientation="vertical">
            <View>
              {drawerItems.map((item, index) => {
                const Component = index === 0 ? DefaultFocus : React.Fragment;
                return (
                  <Component key={item.name}>
                    <SpatialNavigationFocusableView
                      onSelect={() => {
                        navigation.jumpTo(item.name as keyof DrawerParamList);
                        navigation.closeDrawer();
                        toggleMenu(false);
                      }}
                    >
                      {({ isFocused }) => (
                        <View
                          style={[
                            styles.menuItem,
                            isFocused && styles.menuItemFocused,
                          ]}
                        >
                          <Text style={styles.menuIcon}>{item.icon}</Text>
                          <Text
                            style={[
                              styles.menuText,
                              isFocused && styles.menuTextFocused,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </View>
                      )}
                    </SpatialNavigationFocusableView>
                  </Component>
                );
              })}
            </View>
          </SpatialNavigationNode>
        </DrawerContentScrollView>

        {/* Footer: Settings */}
        <View style={styles.footer}>
          <SpatialNavigationFocusableView
            onSelect={() => {
              navigation.jumpTo('Settings');
              navigation.closeDrawer();
              toggleMenu(false);
            }}
          >
            {({ isFocused }) => (
              <View
                style={[
                  styles.settingsButton,
                  isFocused && styles.settingsButtonFocused,
                ]}
              >
                <Text style={styles.settingsIcon}>⚙</Text>
                <Text
                  style={[
                    styles.settingsText,
                    isFocused && styles.settingsTextFocused,
                  ]}
                >
                  Settings
                </Text>
              </View>
            )}
          </SpatialNavigationFocusableView>
        </View>
      </View>
    </SpatialNavigationRoot>
  );
}

const drawerStyles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.sidebar,
    borderEndWidth: scaledPixels(1),
    borderEndColor: colors.border,
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
    paddingTop: scaledPixels(safeZones.titleSafe.vertical),
  },
  header: {
    paddingHorizontal: scaledPixels(24),
    paddingVertical: scaledPixels(20),
    marginBottom: scaledPixels(16),
    borderBottomWidth: scaledPixels(1),
    borderBottomColor: colors.border,
  },
  brandBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(4),
    marginBottom: scaledPixels(8),
  },
  brandBadgeText: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: scaledPixels(11),
    letterSpacing: 1,
  },
  brandTitle: {
    color: colors.text,
    fontSize: scaledPixels(26),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTagline: {
    color: colors.primaryLight,
    fontSize: scaledPixels(14),
    marginTop: scaledPixels(4),
    fontStyle: 'italic',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaledPixels(14),
    paddingHorizontal: scaledPixels(20),
    marginHorizontal: scaledPixels(12),
    marginVertical: scaledPixels(4),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
  },
  menuItemFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.04 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: scaledPixels(10),
    elevation: 8,
  },
  menuIcon: {
    fontSize: scaledPixels(20),
    marginEnd: scaledPixels(14),
  },
  menuText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(20),
    fontWeight: '600',
  },
  menuTextFocused: {
    color: colors.textOnPrimary,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: scaledPixels(12),
    paddingBottom: scaledPixels(safeZones.actionSafe.vertical),
    paddingTop: scaledPixels(12),
    borderTopWidth: scaledPixels(1),
    borderTopColor: colors.border,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaledPixels(14),
    paddingHorizontal: scaledPixels(20),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
  },
  settingsButtonFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.04 }],
  },
  settingsIcon: {
    fontSize: scaledPixels(20),
    color: colors.textSecondary,
    marginEnd: scaledPixels(14),
  },
  settingsText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    fontWeight: '600',
  },
  settingsTextFocused: {
    color: colors.textOnPrimary,
    fontWeight: '800',
  },
});
