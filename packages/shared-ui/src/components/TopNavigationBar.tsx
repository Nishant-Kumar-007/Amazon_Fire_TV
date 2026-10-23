import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { colors } from '../theme';
import { scaledPixels } from '../hooks/useScale';

export interface TopNavigationBarProps {
  activeTab?: string;
  onSelectCategory?: (category: string) => void;
  onOpenSearch?: () => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  activeTab = 'Home',
  onSelectCategory,
  onOpenSearch,
}) => {
  const navigation = useNavigation<any>();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('4K Ultra HD');
  const [selectedLanguage, setSelectedLanguage] = useState('English [Hindi Available]');

  const navItems = [
    { id: 'Home', label: 'Home' },
    { id: 'Movies', label: 'Movies' },
    { id: 'Web Series', label: 'Web Series' },
    { id: 'Cartoons & Animation', label: 'Cartoons' },
    { id: 'Documentaries', label: 'Documentaries' },
    { id: 'Explore', label: 'Explore & Search' },
  ];

  const handleNavPress = (item: { id: string; label: string }) => {
    if (item.id === 'Explore') {
      if (onOpenSearch) {
        onOpenSearch();
      } else {
        navigation.navigate('Explore');
      }
      return;
    }

    if (item.id === 'TV') {
      navigation.navigate('TV');
      return;
    }

    if (item.id === 'Home') {
      if (onSelectCategory) {
        onSelectCategory('All');
      } else {
        navigation.navigate('Home');
      }
      return;
    }

    // Filter by category
    if (onSelectCategory) {
      onSelectCategory(item.id);
    } else {
      navigation.navigate('Home');
    }
  };

  const toggleDrawer = () => {
    try {
      navigation.dispatch(DrawerActions.toggleDrawer());
    } catch {
      // drawer not mounted in current route
    }
  };

  return (
    <View style={styles.topBarContainer}>
      {/* Left: Brand Identity & Drawer Toggle */}
      <View style={styles.leftBrandSection}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (onSelectCategory) onSelectCategory('All');
            navigation.navigate('Home');
          }}
          style={styles.logoRow}
        >
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>VE</Text>
          </View>
          <View style={styles.logoTextWrapper}>
            <Text style={styles.brandTitle}>VIEWEASE <Text style={styles.brandTitleAccent}>TV</Text></Text>
            <Text style={styles.brandTagline}>Every Scene, Understood.</Text>
          </View>
        </Pressable>
      </View>

      {/* Center: Navigation Links with Laptop Hover Feedback */}
      <View style={styles.centerNavSection}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isHovered = hoveredTab === item.id;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => handleNavPress(item)}
              // @ts-ignore - web pointer events
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={({ pressed, hovered }: any) => [
                styles.navItem,
                (hovered || isHovered) && styles.navItemHovered,
                isActive && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}
            >
              <Text
                style={[
                  styles.navItemText,
                  (hoveredTab === item.id || isActive) && styles.navItemTextActive,
                ]}
              >
                {item.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>

      {/* Right: Quick Tools & Account */}
      <View style={styles.rightActionsSection}>
        {/* FocusLab Diagnostics Quick Link */}
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('FocusLab')}
          // @ts-ignore
          onMouseEnter={() => setHoveredTab('FocusLab')}
          onMouseLeave={() => setHoveredTab(null)}
          style={({ hovered }: any) => [
            styles.focusLabBtn,
            hovered && styles.focusLabBtnHovered,
          ]}
        >
          <Text style={styles.focusLabIcon}>⚡</Text>
          <Text style={styles.focusLabText}>FocusLab™</Text>
        </Pressable>

        {/* Settings Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          onPress={() => navigation.navigate('Settings')}
          style={({ hovered }: any) => [
            styles.iconButton,
            hovered && styles.iconButtonHovered,
          ]}
        >
          <Text style={styles.iconBtnText}>⚙</Text>
        </Pressable>

        {/* My Account Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="My Account"
          onPress={() => setAccountModalVisible(true)}
          style={({ hovered }: any) => [
            styles.accountButton,
            hovered && styles.accountButtonHovered,
          ]}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>N</Text>
          </View>
          <View style={styles.accountTextCol}>
            <Text style={styles.accountName}>My Account</Text>
            <Text style={styles.accountPlan}>VIP Pass</Text>
          </View>
        </Pressable>

        {/* Dedicated Three Dots (⋮) Button with High-Contrast Hover Highlighting */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="More Options"
          onPress={() => setMoreMenuVisible(true)}
          style={({ hovered }: any) => [
            styles.threeDotsBtn,
            hovered && styles.threeDotsBtnHovered,
          ]}
        >
          <Text style={styles.threeDotsIcon}>⋮</Text>
        </Pressable>
      </View>

      {/* Three Dots More Menu Modal */}
      <Modal
        visible={moreMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMoreMenuVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setMoreMenuVisible(false)}
        >
          <Pressable style={styles.moreMenuCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.moreMenuHeader}>
              <Text style={styles.moreMenuTitle}>More Options & Quick Actions</Text>
              <Pressable
                onPress={() => setMoreMenuVisible(false)}
                style={styles.closeMoreBtn}
              >
                <Text style={styles.closeModalText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.moreMenuItems}>
              <Pressable
                onPress={() => {
                  setMoreMenuVisible(false);
                  navigation.navigate('FocusLab');
                }}
                style={({ hovered }: any) => [
                  styles.moreMenuItem,
                  hovered && styles.moreMenuItemHovered,
                ]}
              >
                <Text style={styles.moreItemIcon}>⚡</Text>
                <View>
                  <Text style={styles.moreItemTitle}>FocusLab™ Diagnostics</Text>
                  <Text style={styles.moreItemSub}>Test remote D-pad, Fire OS & Vega OS runtime</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMoreMenuVisible(false);
                  navigation.navigate('TV');
                }}
                style={({ hovered }: any) => [
                  styles.moreMenuItem,
                  hovered && styles.moreMenuItemHovered,
                ]}
              >
                <Text style={styles.moreItemIcon}>🔖</Text>
                <View>
                  <Text style={styles.moreItemTitle}>My Saved Watchlist</Text>
                  <Text style={styles.moreItemSub}>View and manage your saved movies and series</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMoreMenuVisible(false);
                  navigation.navigate('Settings');
                }}
                style={({ hovered }: any) => [
                  styles.moreMenuItem,
                  hovered && styles.moreMenuItemHovered,
                ]}
              >
                <Text style={styles.moreItemIcon}>⚙</Text>
                <View>
                  <Text style={styles.moreItemTitle}>System & Audio Settings</Text>
                  <Text style={styles.moreItemSub}>Configure subtitles, audio tracks and streaming buffer</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  setMoreMenuVisible(false);
                  setAccountModalVisible(true);
                }}
                style={({ hovered }: any) => [
                  styles.moreMenuItem,
                  hovered && styles.moreMenuItemHovered,
                ]}
              >
                <Text style={styles.moreItemIcon}>👤</Text>
                <View>
                  <Text style={styles.moreItemTitle}>Account Profile</Text>
                  <Text style={styles.moreItemSub}>Nishant Kumar • Hackathon VIP Member</Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Account Settings Modal */}
      <Modal
        visible={accountModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAccountModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setAccountModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.avatarCircleLarge}>
                <Text style={styles.avatarInitialLarge}>N</Text>
              </View>
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalUserName}>Nishant Kumar</Text>
                <Text style={styles.modalUserTier}>Amazon Hackathon VIP Member</Text>
                <Text style={styles.modalUserDevice}>
                  {Platform.OS === 'web' ? '💻 Laptop Browser' : '📺 Fire TV Stick 4K Max'}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => setAccountModalVisible(false)}
                style={({ hovered }: any) => [
                  styles.closeModalBtn,
                  hovered && styles.closeModalBtnHovered,
                ]}
              >
                <Text style={styles.closeModalText}>✕</Text>
              </Pressable>
            </View>

            {/* Profile Options */}
            <View style={styles.modalBody}>
              <Text style={styles.sectionHeading}>Streaming & Display Settings</Text>

              {/* Video Quality Preference */}
              <View style={styles.prefRow}>
                <Text style={styles.prefLabel}>Playback Quality</Text>
                <View style={styles.prefPills}>
                  {['4K Ultra HD', '1080p FHD', 'Auto (Adaptive)'].map((q) => (
                    <Pressable
                      key={q}
                      onPress={() => setSelectedQuality(q)}
                      style={[
                        styles.prefPill,
                        selectedQuality === q && styles.prefPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.prefPillText,
                          selectedQuality === q && styles.prefPillTextActive,
                        ]}
                      >
                        {q}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Assist Audio / Language */}
              <View style={styles.prefRow}>
                <Text style={styles.prefLabel}>ViewEase Assist Language</Text>
                <View style={styles.prefPills}>
                  {['English [Hindi Available]', 'Hindi Audio [हिन्दी]', 'English CC'].map((lang) => (
                    <Pressable
                      key={lang}
                      onPress={() => setSelectedLanguage(lang)}
                      style={[
                        styles.prefPill,
                        selectedLanguage === lang && styles.prefPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.prefPillText,
                          selectedLanguage === lang && styles.prefPillTextActive,
                        ]}
                      >
                        {lang}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Quick Links */}
              <View style={styles.quickLinksRow}>
                <Pressable
                  onPress={() => {
                    setAccountModalVisible(false);
                    navigation.navigate('TV');
                  }}
                  style={({ hovered }: any) => [
                    styles.quickLinkBtn,
                    hovered && styles.quickLinkBtnHovered,
                  ]}
                >
                  <Text style={styles.quickLinkText}>🔖 My Saved Watchlist</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setAccountModalVisible(false);
                    navigation.navigate('FocusLab');
                  }}
                  style={({ hovered }: any) => [
                    styles.quickLinkBtn,
                    hovered && styles.quickLinkBtnHovered,
                  ]}
                >
                  <Text style={styles.quickLinkText}>⚡ FocusLab™ Diagnostics</Text>
                </Pressable>
              </View>
            </View>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <Text style={styles.footerNote}>ViewEase TV • Amazon Developer Hackathon 2026</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setAccountModalVisible(false)}
                style={({ hovered }: any) => [
                  styles.saveBtn,
                  hovered && styles.saveBtnHovered,
                ]}
              >
                <Text style={styles.saveBtnText}>Done</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(13, 15, 20, 0.94)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 1000,
    // @ts-ignore
    backdropFilter: 'blur(16px)',
  },
  leftBrandSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerToggleBtn: {
    padding: 8,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // @ts-ignore
    cursor: 'pointer',
  },
  drawerToggleBtnHovered: {
    backgroundColor: 'rgba(229, 169, 60, 0.35)',
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 18px #FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  drawerToggleIcon: {
    fontSize: 20,
    color: colors.text,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // @ts-ignore
    cursor: 'pointer',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  logoBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0B0D11',
  },
  logoTextWrapper: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.text,
  },
  brandTitleAccent: {
    color: colors.primary,
  },
  brandTagline: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  centerNavSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  navItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 3,
    position: 'relative',
    // @ts-ignore
    cursor: 'pointer',
  },
  navItemHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    transform: [{ translateY: -1 }],
  },
  navItemActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.18)',
  },
  navItemPressed: {
    opacity: 0.8,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  navItemTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  rightActionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  focusLabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 14,
    // @ts-ignore
    cursor: 'pointer',
  },
  focusLabBtnHovered: {
    backgroundColor: 'rgba(229, 169, 60, 0.3)',
    borderColor: colors.primary,
    // @ts-ignore
    boxShadow: '0 0 12px rgba(229, 169, 60, 0.4)',
  },
  focusLabIcon: {
    fontSize: 13,
    color: colors.primary,
    marginRight: 5,
  },
  focusLabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // @ts-ignore
    cursor: 'pointer',
  },
  iconButtonHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  iconBtnText: {
    fontSize: 18,
    color: colors.text,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // @ts-ignore
    cursor: 'pointer',
  },
  accountButtonHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0D11',
  },
  accountTextCol: {
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  accountPlan: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 580,
    maxWidth: '92%',
    backgroundColor: '#161B22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarCircleLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitialLarge: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B0D11',
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalUserName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  modalUserTier: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  modalUserDevice: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    // @ts-ignore
    cursor: 'pointer',
  },
  closeModalBtnHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeModalText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  modalBody: {
    paddingVertical: 18,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },
  prefRow: {
    marginBottom: 16,
  },
  prefLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  prefPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // @ts-ignore
    cursor: 'pointer',
  },
  prefPillActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.2)',
    borderColor: colors.primary,
  },
  prefPillText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  prefPillTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  quickLinksRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  quickLinkBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    // @ts-ignore
    cursor: 'pointer',
  },
  quickLinkBtnHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: colors.primary,
  },
  quickLinkText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerNote: {
    fontSize: 11,
    color: colors.textMuted,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    // @ts-ignore
    cursor: 'pointer',
  },
  saveBtnHovered: {
    backgroundColor: '#F5BE58',
    // @ts-ignore
    boxShadow: '0 0 14px rgba(229, 169, 60, 0.5)',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B0D11',
  },
  threeDotsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    // @ts-ignore
    cursor: 'pointer',
  },
  threeDotsBtnHovered: {
    backgroundColor: 'rgba(229, 169, 60, 0.35)',
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 16px #FFFFFF',
    transform: [{ scale: 1.15 }],
  },
  threeDotsIcon: {
    fontSize: 20,
    color: colors.text,
    lineHeight: 22,
    fontWeight: '900',
  },
  moreMenuCard: {
    width: 440,
    maxWidth: '90%',
    backgroundColor: '#161B22',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.9,
    shadowRadius: 28,
  },
  moreMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  moreMenuTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  closeMoreBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    // @ts-ignore
    cursor: 'pointer',
  },
  moreMenuItems: {
    paddingTop: 12,
    gap: 8,
  },
  moreMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 12,
    // @ts-ignore
    cursor: 'pointer',
  },
  moreMenuItemHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: colors.primary,
  },
  moreItemIcon: {
    fontSize: 22,
  },
  moreItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  moreItemSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
