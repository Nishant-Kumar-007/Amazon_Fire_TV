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
exports.default = SettingsScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const native_1 = require("@react-navigation/native");
const useScale_1 = require("../hooks/useScale");
const theme_1 = require("../theme");
const MenuContext_1 = require("../components/MenuContext");
const rtl_1 = require("../utils/rtl");
const StorageService_1 = require("../services/StorageService");
const TVBridge_1 = require("../tvbridge/TVBridge");
function SettingsScreen() {
    const isFocused = (0, native_1.useIsFocused)();
    const navigation = (0, native_1.useNavigation)();
    const { isOpen: isMenuOpen, toggleMenu } = (0, MenuContext_1.useMenuContext)();
    const capabilities = react_1.default.useMemo(() => (0, TVBridge_1.getTVPlatformCapabilities)(), []);
    const [selectedQuality, setSelectedQuality] = (0, react_1.useState)('Auto');
    const [selectedAudio, setSelectedAudio] = (0, react_1.useState)('Dolby Atmos');
    const [assistLanguage, setAssistLanguage] = (0, react_1.useState)('Hindi');
    const [cacheStatus, setCacheStatus] = (0, react_1.useState)(null);
    const qualityOptions = ['Auto', '4K Ultra HD', '1080p', '720p'];
    const audioOptions = ['Dolby Atmos', '5.1 Surround', 'Stereo'];
    const languageOptions = ['Hindi', 'Spanish', 'French', 'English'];
    const onDirectionHandledWithoutMovement = (0, react_1.useCallback)((movement) => {
        if (movement === (0, rtl_1.getOpenDrawerDirection)()) {
            navigation.dispatch(native_1.DrawerActions.openDrawer());
            toggleMenu(true);
        }
    }, [toggleMenu, navigation]);
    const handleClearCache = (0, react_1.useCallback)(() => {
        StorageService_1.StorageService.clearAll();
        setCacheStatus('Playback progress and watchlist successfully reset!');
        setTimeout(() => setCacheStatus(null), 4000);
    }, []);
    const launchFocusLab = (0, react_1.useCallback)(() => {
        navigation.navigate('FocusLab');
    }, [navigation]);
    return (<react_tv_space_navigation_1.SpatialNavigationRoot isActive={isFocused && !isMenuOpen} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <react_native_1.View style={styles.container}>
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.title}>Settings</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>
            Playback Preferences, Accessibility & Developer Diagnostics
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <react_native_1.View style={styles.scrollContent}>
            {/* Developer Diagnostics Highlight Box */}
            <react_native_1.View style={styles.diagnosticsHighlight}>
              <react_native_1.View style={styles.diagnosticsTextCol}>
                <react_native_1.View style={styles.diagBadge}>
                  <react_native_1.Text style={styles.diagBadgeText}>ENGINEERING SUITE</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={styles.diagTitle}>FocusLab™ Remote & TV Diagnostics</react_native_1.Text>
                <react_native_1.Text style={styles.diagDesc}>
                  Validate remote navigation keybindings, spatial focus restoration, 16:9 safe-zone compliance, and generate compatibility reports.
                </react_native_1.Text>
              </react_native_1.View>

              <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
                <react_tv_space_navigation_1.DefaultFocus>
                  <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={launchFocusLab}>
                    {({ isFocused: btnFocused }) => (<react_native_1.View style={[
                styles.diagBtn,
                btnFocused && styles.diagBtnFocused,
            ]}>
                        <react_native_1.Text style={[
                styles.diagBtnText,
                btnFocused && styles.diagBtnTextFocused,
            ]}>
                          🔬 Launch FocusLab
                        </react_native_1.Text>
                      </react_native_1.View>)}
                  </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                </react_tv_space_navigation_1.DefaultFocus>
              </react_tv_space_navigation_1.SpatialNavigationNode>
            </react_native_1.View>

            {/* Video Quality Section */}
            <react_native_1.View style={styles.section}>
              <react_native_1.Text style={styles.sectionTitle}>STREAMING QUALITY</react_native_1.Text>
              <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
                <react_native_1.View style={styles.optionsRow}>
                  {qualityOptions.map((quality) => {
            const isSelected = selectedQuality === quality;
            return (<react_tv_space_navigation_1.SpatialNavigationFocusableView key={quality} onSelect={() => setSelectedQuality(quality)}>
                        {({ isFocused: btnFocused }) => (<react_native_1.View style={[
                        styles.optionPill,
                        isSelected && styles.optionPillSelected,
                        btnFocused && styles.optionPillFocused,
                    ]}>
                            <react_native_1.Text style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        btnFocused && styles.optionTextFocused,
                    ]}>
                              {quality}
                            </react_native_1.Text>
                          </react_native_1.View>)}
                      </react_tv_space_navigation_1.SpatialNavigationFocusableView>);
        })}
                </react_native_1.View>
              </react_tv_space_navigation_1.SpatialNavigationNode>
            </react_native_1.View>

            {/* Audio Passthrough Section */}
            <react_native_1.View style={styles.section}>
              <react_native_1.Text style={styles.sectionTitle}>AUDIO STREAM</react_native_1.Text>
              <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
                <react_native_1.View style={styles.optionsRow}>
                  {audioOptions.map((audio) => {
            const isSelected = selectedAudio === audio;
            return (<react_tv_space_navigation_1.SpatialNavigationFocusableView key={audio} onSelect={() => setSelectedAudio(audio)}>
                        {({ isFocused: btnFocused }) => (<react_native_1.View style={[
                        styles.optionPill,
                        isSelected && styles.optionPillSelected,
                        btnFocused && styles.optionPillFocused,
                    ]}>
                            <react_native_1.Text style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        btnFocused && styles.optionTextFocused,
                    ]}>
                              {audio}
                            </react_native_1.Text>
                          </react_native_1.View>)}
                      </react_tv_space_navigation_1.SpatialNavigationFocusableView>);
        })}
                </react_native_1.View>
              </react_tv_space_navigation_1.SpatialNavigationNode>
            </react_native_1.View>

            {/* ViewEase Assist Default Language */}
            <react_native_1.View style={styles.section}>
              <react_native_1.Text style={styles.sectionTitle}>VIEWEASE ASSIST COMPANION LANGUAGE</react_native_1.Text>
              <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
                <react_native_1.View style={styles.optionsRow}>
                  {languageOptions.map((lang) => {
            const isSelected = assistLanguage === lang;
            return (<react_tv_space_navigation_1.SpatialNavigationFocusableView key={lang} onSelect={() => setAssistLanguage(lang)}>
                        {({ isFocused: btnFocused }) => (<react_native_1.View style={[
                        styles.optionPill,
                        isSelected && styles.optionPillSelected,
                        btnFocused && styles.optionPillFocused,
                    ]}>
                            <react_native_1.Text style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                        btnFocused && styles.optionTextFocused,
                    ]}>
                              {lang}
                            </react_native_1.Text>
                          </react_native_1.View>)}
                      </react_tv_space_navigation_1.SpatialNavigationFocusableView>);
        })}
                </react_native_1.View>
              </react_tv_space_navigation_1.SpatialNavigationNode>
            </react_native_1.View>

            {/* Local Data Management */}
            <react_native_1.View style={styles.section}>
              <react_native_1.Text style={styles.sectionTitle}>STORAGE & CACHE</react_native_1.Text>
              <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
                <react_native_1.View style={styles.optionsRow}>
                  <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={handleClearCache}>
                    {({ isFocused: btnFocused }) => (<react_native_1.View style={[
                styles.actionPill,
                btnFocused && styles.actionPillFocused,
            ]}>
                        <react_native_1.Text style={[
                styles.actionPillText,
                btnFocused && styles.actionPillTextFocused,
            ]}>
                          🗑 Clear Playback Cache & Watchlist
                        </react_native_1.Text>
                      </react_native_1.View>)}
                  </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                </react_native_1.View>
              </react_tv_space_navigation_1.SpatialNavigationNode>
              {cacheStatus && (<react_native_1.Text style={styles.cacheNotice}>{cacheStatus}</react_native_1.Text>)}
            </react_native_1.View>

            {/* About Box */}
            <react_native_1.View style={styles.aboutCard}>
              <react_native_1.Text style={styles.aboutTitle}>ViewEase TV</react_native_1.Text>
              <react_native_1.Text style={styles.aboutTagline}>Every Scene, Understood.</react_native_1.Text>
              <react_native_1.View style={styles.aboutDivider}/>
              <react_native_1.View style={styles.aboutRow}>
                <react_native_1.Text style={styles.aboutKey}>Edition:</react_native_1.Text>
                <react_native_1.Text style={styles.aboutVal}>Amazon Developer Hackathon 2026</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.aboutRow}>
                <react_native_1.Text style={styles.aboutKey}>Target Platform:</react_native_1.Text>
                <react_native_1.Text style={styles.aboutVal}>{capabilities.platformName}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.aboutRow}>
                <react_native_1.Text style={styles.aboutKey}>Spatial Engine:</react_native_1.Text>
                <react_native_1.Text style={styles.aboutVal}>react-tv-space-navigation v6 (LRUD)</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_1.View>
    </react_tv_space_navigation_1.SpatialNavigationRoot>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme_1.colors.background,
        paddingHorizontal: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
        paddingTop: (0, useScale_1.scaledPixels)(theme_1.safeZones.titleSafe.vertical),
        paddingBottom: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.vertical),
    },
    header: {
        marginBottom: (0, useScale_1.scaledPixels)(20),
    },
    title: {
        fontSize: (0, useScale_1.scaledPixels)(42),
        fontWeight: '800',
        color: theme_1.colors.text,
        letterSpacing: 0.5,
    },
    subtitle: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(18),
        marginTop: (0, useScale_1.scaledPixels)(4),
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: (0, useScale_1.scaledPixels)(40),
    },
    diagnosticsHighlight: {
        backgroundColor: theme_1.colors.cardElevated,
        borderRadius: (0, useScale_1.scaledPixels)(12),
        padding: (0, useScale_1.scaledPixels)(20),
        marginBottom: (0, useScale_1.scaledPixels)(24),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    diagnosticsTextCol: {
        flex: 1,
        marginEnd: (0, useScale_1.scaledPixels)(20),
    },
    diagBadge: {
        backgroundColor: theme_1.colors.primary,
        alignSelf: 'flex-start',
        paddingHorizontal: (0, useScale_1.scaledPixels)(8),
        paddingVertical: (0, useScale_1.scaledPixels)(3),
        borderRadius: (0, useScale_1.scaledPixels)(4),
        marginBottom: (0, useScale_1.scaledPixels)(6),
    },
    diagBadgeText: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '800',
        fontSize: (0, useScale_1.scaledPixels)(11),
        letterSpacing: 1,
    },
    diagTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(22),
        fontWeight: '700',
        marginBottom: (0, useScale_1.scaledPixels)(4),
    },
    diagDesc: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(15),
        lineHeight: (0, useScale_1.scaledPixels)(22),
    },
    diagBtn: {
        backgroundColor: theme_1.colors.primary,
        paddingHorizontal: (0, useScale_1.scaledPixels)(22),
        paddingVertical: (0, useScale_1.scaledPixels)(14),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.primary,
    },
    diagBtnFocused: {
        backgroundColor: theme_1.colors.primaryLight,
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.06 }],
    },
    diagBtnText: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '800',
        fontSize: (0, useScale_1.scaledPixels)(16),
    },
    diagBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    section: {
        marginBottom: (0, useScale_1.scaledPixels)(24),
    },
    sectionTitle: {
        fontSize: (0, useScale_1.scaledPixels)(14),
        fontWeight: '700',
        color: theme_1.colors.textTertiary,
        letterSpacing: 1.1,
        marginBottom: (0, useScale_1.scaledPixels)(10),
    },
    optionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    optionPill: {
        backgroundColor: theme_1.colors.card,
        paddingHorizontal: (0, useScale_1.scaledPixels)(18),
        paddingVertical: (0, useScale_1.scaledPixels)(10),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        marginEnd: (0, useScale_1.scaledPixels)(12),
        marginBottom: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.border,
    },
    optionPillSelected: {
        borderColor: theme_1.colors.primary,
        backgroundColor: 'rgba(229, 169, 60, 0.16)',
    },
    optionPillFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.06 }],
    },
    optionText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(16),
        fontWeight: '600',
    },
    optionTextSelected: {
        color: theme_1.colors.primaryLight,
        fontWeight: '700',
    },
    optionTextFocused: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '700',
    },
    actionPill: {
        backgroundColor: theme_1.colors.cardElevated,
        paddingHorizontal: (0, useScale_1.scaledPixels)(18),
        paddingVertical: (0, useScale_1.scaledPixels)(12),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.borderLight,
    },
    actionPillFocused: {
        backgroundColor: theme_1.colors.error,
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.05 }],
    },
    actionPillText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(15),
        fontWeight: '600',
    },
    actionPillTextFocused: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    cacheNotice: {
        color: theme_1.colors.success,
        fontSize: (0, useScale_1.scaledPixels)(14),
        marginTop: (0, useScale_1.scaledPixels)(8),
        fontWeight: '600',
    },
    aboutCard: {
        backgroundColor: theme_1.colors.card,
        borderRadius: (0, useScale_1.scaledPixels)(12),
        padding: (0, useScale_1.scaledPixels)(20),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: theme_1.colors.border,
        marginTop: (0, useScale_1.scaledPixels)(10),
    },
    aboutTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(22),
        fontWeight: '800',
    },
    aboutTagline: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(14),
        fontStyle: 'italic',
        marginTop: (0, useScale_1.scaledPixels)(2),
    },
    aboutDivider: {
        height: (0, useScale_1.scaledPixels)(1),
        backgroundColor: theme_1.colors.divider,
        marginVertical: (0, useScale_1.scaledPixels)(12),
    },
    aboutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: (0, useScale_1.scaledPixels)(4),
    },
    aboutKey: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(15),
    },
    aboutVal: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(15),
        fontWeight: '600',
    },
});
