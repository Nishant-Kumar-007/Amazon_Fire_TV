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
exports.TopNavigationBar = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const theme_1 = require("../theme");
const TopNavigationBar = ({ activeTab = 'Home', onSelectCategory, onOpenSearch, }) => {
    const navigation = (0, native_1.useNavigation)();
    const [hoveredTab, setHoveredTab] = (0, react_1.useState)(null);
    const [accountModalVisible, setAccountModalVisible] = (0, react_1.useState)(false);
    const [moreMenuVisible, setMoreMenuVisible] = (0, react_1.useState)(false);
    const [selectedQuality, setSelectedQuality] = (0, react_1.useState)('4K Ultra HD');
    const [selectedLanguage, setSelectedLanguage] = (0, react_1.useState)('English [Hindi Available]');
    const navItems = [
        { id: 'Home', label: 'Home' },
        { id: 'Movies', label: 'Movies' },
        { id: 'Web Series', label: 'Web Series' },
        { id: 'Cartoons & Animation', label: 'Cartoons' },
        { id: 'Documentaries', label: 'Documentaries' },
        { id: 'TV', label: 'My List' },
        { id: 'Explore', label: 'Explore & Search' },
    ];
    const handleNavPress = (item) => {
        if (item.id === 'Explore') {
            if (onOpenSearch) {
                onOpenSearch();
            }
            else {
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
            }
            else {
                navigation.navigate('Home');
            }
            return;
        }
        // Filter by category
        if (onSelectCategory) {
            onSelectCategory(item.id);
        }
        else {
            navigation.navigate('Home');
        }
    };
    const toggleDrawer = () => {
        try {
            navigation.dispatch(native_1.DrawerActions.toggleDrawer());
        }
        catch {
            // drawer not mounted in current route
        }
    };
    return (<react_native_1.View style={styles.topBarContainer}>
      {/* Left: Brand Identity & Drawer Toggle */}
      <react_native_1.View style={styles.leftBrandSection}>
        <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Open side navigation drawer" onPress={toggleDrawer} style={({ hovered }) => [
            styles.drawerToggleBtn,
            hovered && styles.drawerToggleBtnHovered,
        ]}>
          <react_native_1.Text style={styles.drawerToggleIcon}>☰</react_native_1.Text>
        </react_native_1.Pressable>

        <react_native_1.Pressable accessibilityRole="button" onPress={() => {
            if (onSelectCategory)
                onSelectCategory('All');
            navigation.navigate('Home');
        }} style={styles.logoRow}>
          <react_native_1.View style={styles.logoBadge}>
            <react_native_1.Text style={styles.logoBadgeText}>VE</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.logoTextWrapper}>
            <react_native_1.Text style={styles.brandTitle}>VIEWEASE <react_native_1.Text style={styles.brandTitleAccent}>TV</react_native_1.Text></react_native_1.Text>
            <react_native_1.Text style={styles.brandTagline}>Every Scene, Understood.</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.Pressable>
      </react_native_1.View>

      {/* Center: Navigation Links with Laptop Hover Feedback */}
      <react_native_1.View style={styles.centerNavSection}>
        {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isHovered = hoveredTab === item.id;
            return (<react_native_1.Pressable key={item.id} accessibilityRole="button" onPress={() => handleNavPress(item)} 
            // @ts-ignore - web pointer events
            onMouseEnter={() => setHoveredTab(item.id)} onMouseLeave={() => setHoveredTab(null)} style={({ pressed, hovered }) => [
                    styles.navItem,
                    (hovered || isHovered) && styles.navItemHovered,
                    isActive && styles.navItemActive,
                    pressed && styles.navItemPressed,
                ]}>
              <react_native_1.Text style={[
                    styles.navItemText,
                    (hoveredTab === item.id || isActive) && styles.navItemTextActive,
                ]}>
                {item.label}
              </react_native_1.Text>
              {isActive && <react_native_1.View style={styles.activeIndicator}/>}
            </react_native_1.Pressable>);
        })}
      </react_native_1.View>

      {/* Right: Quick Tools & Account */}
      <react_native_1.View style={styles.rightActionsSection}>
        {/* FocusLab Diagnostics Quick Link */}
        <react_native_1.Pressable accessibilityRole="button" onPress={() => navigation.navigate('FocusLab')} 
    // @ts-ignore
    onMouseEnter={() => setHoveredTab('FocusLab')} onMouseLeave={() => setHoveredTab(null)} style={({ hovered }) => [
            styles.focusLabBtn,
            hovered && styles.focusLabBtnHovered,
        ]}>
          <react_native_1.Text style={styles.focusLabIcon}>⚡</react_native_1.Text>
          <react_native_1.Text style={styles.focusLabText}>FocusLab™</react_native_1.Text>
        </react_native_1.Pressable>

        {/* Settings Button */}
        <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => navigation.navigate('Settings')} style={({ hovered }) => [
            styles.iconButton,
            hovered && styles.iconButtonHovered,
        ]}>
          <react_native_1.Text style={styles.iconBtnText}>⚙</react_native_1.Text>
        </react_native_1.Pressable>

        {/* My Account Button */}
        <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="My Account" onPress={() => setAccountModalVisible(true)} style={({ hovered }) => [
            styles.accountButton,
            hovered && styles.accountButtonHovered,
        ]}>
          <react_native_1.View style={styles.avatarCircle}>
            <react_native_1.Text style={styles.avatarInitial}>N</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.accountTextCol}>
            <react_native_1.Text style={styles.accountName}>My Account</react_native_1.Text>
            <react_native_1.Text style={styles.accountPlan}>VIP Pass</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.Pressable>

        {/* Dedicated Three Dots (⋮) Button with High-Contrast Hover Highlighting */}
        <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="More Options" onPress={() => setMoreMenuVisible(true)} style={({ hovered }) => [
            styles.threeDotsBtn,
            hovered && styles.threeDotsBtnHovered,
        ]}>
          <react_native_1.Text style={styles.threeDotsIcon}>⋮</react_native_1.Text>
        </react_native_1.Pressable>
      </react_native_1.View>

      {/* Three Dots More Menu Modal */}
      <react_native_1.Modal visible={moreMenuVisible} transparent animationType="fade" onRequestClose={() => setMoreMenuVisible(false)}>
        <react_native_1.Pressable style={styles.modalBackdrop} onPress={() => setMoreMenuVisible(false)}>
          <react_native_1.Pressable style={styles.moreMenuCard} onPress={(e) => e.stopPropagation()}>
            <react_native_1.View style={styles.moreMenuHeader}>
              <react_native_1.Text style={styles.moreMenuTitle}>More Options & Quick Actions</react_native_1.Text>
              <react_native_1.Pressable onPress={() => setMoreMenuVisible(false)} style={styles.closeMoreBtn}>
                <react_native_1.Text style={styles.closeModalText}>✕</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            <react_native_1.View style={styles.moreMenuItems}>
              <react_native_1.Pressable onPress={() => {
            setMoreMenuVisible(false);
            navigation.navigate('FocusLab');
        }} style={({ hovered }) => [
            styles.moreMenuItem,
            hovered && styles.moreMenuItemHovered,
        ]}>
                <react_native_1.Text style={styles.moreItemIcon}>⚡</react_native_1.Text>
                <react_native_1.View>
                  <react_native_1.Text style={styles.moreItemTitle}>FocusLab™ Diagnostics</react_native_1.Text>
                  <react_native_1.Text style={styles.moreItemSub}>Test remote D-pad, Fire OS & Vega OS runtime</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.Pressable>

              <react_native_1.Pressable onPress={() => {
            setMoreMenuVisible(false);
            navigation.navigate('TV');
        }} style={({ hovered }) => [
            styles.moreMenuItem,
            hovered && styles.moreMenuItemHovered,
        ]}>
                <react_native_1.Text style={styles.moreItemIcon}>🔖</react_native_1.Text>
                <react_native_1.View>
                  <react_native_1.Text style={styles.moreItemTitle}>My Saved Watchlist</react_native_1.Text>
                  <react_native_1.Text style={styles.moreItemSub}>View and manage your saved movies and series</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.Pressable>

              <react_native_1.Pressable onPress={() => {
            setMoreMenuVisible(false);
            navigation.navigate('Settings');
        }} style={({ hovered }) => [
            styles.moreMenuItem,
            hovered && styles.moreMenuItemHovered,
        ]}>
                <react_native_1.Text style={styles.moreItemIcon}>⚙</react_native_1.Text>
                <react_native_1.View>
                  <react_native_1.Text style={styles.moreItemTitle}>System & Audio Settings</react_native_1.Text>
                  <react_native_1.Text style={styles.moreItemSub}>Configure subtitles, audio tracks and streaming buffer</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.Pressable>

              <react_native_1.Pressable onPress={() => {
            setMoreMenuVisible(false);
            setAccountModalVisible(true);
        }} style={({ hovered }) => [
            styles.moreMenuItem,
            hovered && styles.moreMenuItemHovered,
        ]}>
                <react_native_1.Text style={styles.moreItemIcon}>👤</react_native_1.Text>
                <react_native_1.View>
                  <react_native_1.Text style={styles.moreItemTitle}>Account Profile</react_native_1.Text>
                  <react_native_1.Text style={styles.moreItemSub}>Nishant Kumar • Hackathon VIP Member</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.Pressable>
        </react_native_1.Pressable>
      </react_native_1.Modal>

      {/* Account Settings Modal */}
      <react_native_1.Modal visible={accountModalVisible} transparent animationType="fade" onRequestClose={() => setAccountModalVisible(false)}>
        <react_native_1.Pressable style={styles.modalBackdrop} onPress={() => setAccountModalVisible(false)}>
          <react_native_1.Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <react_native_1.View style={styles.modalHeader}>
              <react_native_1.View style={styles.avatarCircleLarge}>
                <react_native_1.Text style={styles.avatarInitialLarge}>N</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.modalHeaderInfo}>
                <react_native_1.Text style={styles.modalUserName}>Nishant Kumar</react_native_1.Text>
                <react_native_1.Text style={styles.modalUserTier}>Amazon Hackathon VIP Member</react_native_1.Text>
                <react_native_1.Text style={styles.modalUserDevice}>
                  {react_native_1.Platform.OS === 'web' ? '💻 Laptop Browser' : '📺 Fire TV Stick 4K Max'}
                </react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Pressable accessibilityRole="button" onPress={() => setAccountModalVisible(false)} style={({ hovered }) => [
            styles.closeModalBtn,
            hovered && styles.closeModalBtnHovered,
        ]}>
                <react_native_1.Text style={styles.closeModalText}>✕</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {/* Profile Options */}
            <react_native_1.View style={styles.modalBody}>
              <react_native_1.Text style={styles.sectionHeading}>Streaming & Display Settings</react_native_1.Text>

              {/* Video Quality Preference */}
              <react_native_1.View style={styles.prefRow}>
                <react_native_1.Text style={styles.prefLabel}>Playback Quality</react_native_1.Text>
                <react_native_1.View style={styles.prefPills}>
                  {['4K Ultra HD', '1080p FHD', 'Auto (Adaptive)'].map((q) => (<react_native_1.Pressable key={q} onPress={() => setSelectedQuality(q)} style={[
                styles.prefPill,
                selectedQuality === q && styles.prefPillActive,
            ]}>
                      <react_native_1.Text style={[
                styles.prefPillText,
                selectedQuality === q && styles.prefPillTextActive,
            ]}>
                        {q}
                      </react_native_1.Text>
                    </react_native_1.Pressable>))}
                </react_native_1.View>
              </react_native_1.View>

              {/* Assist Audio / Language */}
              <react_native_1.View style={styles.prefRow}>
                <react_native_1.Text style={styles.prefLabel}>ViewEase Assist Language</react_native_1.Text>
                <react_native_1.View style={styles.prefPills}>
                  {['English [Hindi Available]', 'Hindi Audio [हिन्दी]', 'English CC'].map((lang) => (<react_native_1.Pressable key={lang} onPress={() => setSelectedLanguage(lang)} style={[
                styles.prefPill,
                selectedLanguage === lang && styles.prefPillActive,
            ]}>
                      <react_native_1.Text style={[
                styles.prefPillText,
                selectedLanguage === lang && styles.prefPillTextActive,
            ]}>
                        {lang}
                      </react_native_1.Text>
                    </react_native_1.Pressable>))}
                </react_native_1.View>
              </react_native_1.View>

              {/* Quick Links */}
              <react_native_1.View style={styles.quickLinksRow}>
                <react_native_1.Pressable onPress={() => {
            setAccountModalVisible(false);
            navigation.navigate('TV');
        }} style={({ hovered }) => [
            styles.quickLinkBtn,
            hovered && styles.quickLinkBtnHovered,
        ]}>
                  <react_native_1.Text style={styles.quickLinkText}>🔖 My Saved Watchlist</react_native_1.Text>
                </react_native_1.Pressable>

                <react_native_1.Pressable onPress={() => {
            setAccountModalVisible(false);
            navigation.navigate('FocusLab');
        }} style={({ hovered }) => [
            styles.quickLinkBtn,
            hovered && styles.quickLinkBtnHovered,
        ]}>
                  <react_native_1.Text style={styles.quickLinkText}>⚡ FocusLab™ Diagnostics</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>
            </react_native_1.View>

            {/* Modal Footer */}
            <react_native_1.View style={styles.modalFooter}>
              <react_native_1.Text style={styles.footerNote}>ViewEase TV • Amazon Developer Hackathon 2026</react_native_1.Text>
              <react_native_1.Pressable accessibilityRole="button" onPress={() => setAccountModalVisible(false)} style={({ hovered }) => [
            styles.saveBtn,
            hovered && styles.saveBtnHovered,
        ]}>
                <react_native_1.Text style={styles.saveBtnText}>Done</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.Pressable>
        </react_native_1.Pressable>
      </react_native_1.Modal>
    </react_native_1.View>);
};
exports.TopNavigationBar = TopNavigationBar;
const styles = react_native_1.StyleSheet.create({
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
        color: theme_1.colors.text,
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
        backgroundColor: theme_1.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: theme_1.colors.primary,
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
        color: theme_1.colors.text,
    },
    brandTitleAccent: {
        color: theme_1.colors.primary,
    },
    brandTagline: {
        fontSize: 10,
        color: theme_1.colors.textMuted,
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
        color: theme_1.colors.textMuted,
        letterSpacing: 0.3,
    },
    navItemTextActive: {
        color: theme_1.colors.text,
        fontWeight: '700',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -6,
        left: 14,
        right: 14,
        height: 2,
        backgroundColor: theme_1.colors.primary,
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
        borderColor: theme_1.colors.primary,
        // @ts-ignore
        boxShadow: '0 0 12px rgba(229, 169, 60, 0.4)',
    },
    focusLabIcon: {
        fontSize: 13,
        color: theme_1.colors.primary,
        marginRight: 5,
    },
    focusLabText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme_1.colors.primary,
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
        color: theme_1.colors.text,
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
        backgroundColor: theme_1.colors.primary,
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
        color: theme_1.colors.text,
    },
    accountPlan: {
        fontSize: 9,
        color: theme_1.colors.primary,
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
        backgroundColor: theme_1.colors.primary,
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
        color: theme_1.colors.text,
    },
    modalUserTier: {
        fontSize: 13,
        color: theme_1.colors.primary,
        fontWeight: '600',
        marginTop: 2,
    },
    modalUserDevice: {
        fontSize: 11,
        color: theme_1.colors.textMuted,
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
        color: theme_1.colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    modalBody: {
        paddingVertical: 18,
    },
    sectionHeading: {
        fontSize: 14,
        fontWeight: '700',
        color: theme_1.colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 14,
    },
    prefRow: {
        marginBottom: 16,
    },
    prefLabel: {
        fontSize: 13,
        color: theme_1.colors.text,
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
        borderColor: theme_1.colors.primary,
    },
    prefPillText: {
        fontSize: 12,
        color: theme_1.colors.textMuted,
        fontWeight: '600',
    },
    prefPillTextActive: {
        color: theme_1.colors.primary,
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
        borderColor: theme_1.colors.primary,
    },
    quickLinkText: {
        fontSize: 13,
        color: theme_1.colors.text,
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
        color: theme_1.colors.textMuted,
    },
    saveBtn: {
        backgroundColor: theme_1.colors.primary,
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
        color: theme_1.colors.text,
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
        color: theme_1.colors.text,
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
        borderColor: theme_1.colors.primary,
    },
    moreItemIcon: {
        fontSize: 22,
    },
    moreItemTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme_1.colors.text,
    },
    moreItemSub: {
        fontSize: 11,
        color: theme_1.colors.textMuted,
        marginTop: 2,
    },
});
