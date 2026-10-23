import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import {
  SpatialNavigationRoot,
  SpatialNavigationNode,
  DefaultFocus,
  SpatialNavigationFocusableView,
} from 'react-tv-space-navigation';
import { DrawerActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { colors, safeZones } from '../theme';
import { useMenuContext } from '../components/MenuContext';
import { getOpenDrawerDirection } from '../utils/rtl';
import { RootStackParamList } from '../navigation/types';
import { StorageService } from '../services/StorageService';
import { getTVPlatformCapabilities } from '../tvbridge/TVBridge';

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<SettingsNavigationProp>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const capabilities = React.useMemo(() => getTVPlatformCapabilities(), []);

  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [selectedAudio, setSelectedAudio] = useState('Dolby Atmos');
  const [assistLanguage, setAssistLanguage] = useState('Hindi');
  const [cacheStatus, setCacheStatus] = useState<string | null>(null);

  const qualityOptions = ['Auto', '4K Ultra HD', '1080p', '720p'];
  const audioOptions = ['Dolby Atmos', '5.1 Surround', 'Stereo'];
  const languageOptions = ['Hindi', 'Spanish', 'French', 'English'];

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getOpenDrawerDirection()) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, navigation],
  );

  const handleClearCache = useCallback(() => {
    StorageService.clearAll();
    setCacheStatus('Playback progress and watchlist successfully reset!');
    setTimeout(() => setCacheStatus(null), 4000);
  }, []);

  const launchParityLab = useCallback(() => {
    navigation.navigate('ParityLab');
  }, [navigation]);

  return (
    <SpatialNavigationRoot
      isActive={isFocused && !isMenuOpen}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Playback Preferences, Accessibility & Developer Diagnostics
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.scrollContent}>
            {/* Developer Diagnostics Highlight Box */}
            <View style={styles.diagnosticsHighlight}>
              <View style={styles.diagnosticsTextCol}>
                <View style={styles.diagBadge}>
                  <Text style={styles.diagBadgeText}>ENGINEERING SUITE</Text>
                </View>
                <Text style={styles.diagTitle}>ViewEase Parity Lab — Cross-Platform Evidence</Text>
                <Text style={styles.diagDesc}>
                  Visual and behavioral cross-platform evidence engine for Fire OS and Vega OS. Inspect canonical replay checkpoints, side-by-side renders, split comparison slider, and difference heatmap.
                </Text>
              </View>

              <SpatialNavigationNode orientation="horizontal">
                <DefaultFocus>
                  <SpatialNavigationFocusableView onSelect={launchParityLab}>
                    {({ isFocused: btnFocused }) => (
                      <View
                        style={[
                          styles.diagBtn,
                          btnFocused && styles.diagBtnFocused,
                        ]}
                      >
                        <Text
                          style={[
                            styles.diagBtnText,
                            btnFocused && styles.diagBtnTextFocused,
                          ]}
                        >
                          ⚖ Launch Parity Lab
                        </Text>
                      </View>
                    )}
                  </SpatialNavigationFocusableView>
                </DefaultFocus>
              </SpatialNavigationNode>
            </View>

            {/* Video Quality Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>STREAMING QUALITY</Text>
              <SpatialNavigationNode orientation="horizontal">
                <View style={styles.optionsRow}>
                  {qualityOptions.map((quality) => {
                    const isSelected = selectedQuality === quality;
                    return (
                      <SpatialNavigationFocusableView
                        key={quality}
                        onSelect={() => setSelectedQuality(quality)}
                      >
                        {({ isFocused: btnFocused }) => (
                          <View
                            style={[
                              styles.optionPill,
                              isSelected && styles.optionPillSelected,
                              btnFocused && styles.optionPillFocused,
                            ]}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                isSelected && styles.optionTextSelected,
                                btnFocused && styles.optionTextFocused,
                              ]}
                            >
                              {quality}
                            </Text>
                          </View>
                        )}
                      </SpatialNavigationFocusableView>
                    );
                  })}
                </View>
              </SpatialNavigationNode>
            </View>

            {/* Audio Passthrough Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AUDIO STREAM</Text>
              <SpatialNavigationNode orientation="horizontal">
                <View style={styles.optionsRow}>
                  {audioOptions.map((audio) => {
                    const isSelected = selectedAudio === audio;
                    return (
                      <SpatialNavigationFocusableView
                        key={audio}
                        onSelect={() => setSelectedAudio(audio)}
                      >
                        {({ isFocused: btnFocused }) => (
                          <View
                            style={[
                              styles.optionPill,
                              isSelected && styles.optionPillSelected,
                              btnFocused && styles.optionPillFocused,
                            ]}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                isSelected && styles.optionTextSelected,
                                btnFocused && styles.optionTextFocused,
                              ]}
                            >
                              {audio}
                            </Text>
                          </View>
                        )}
                      </SpatialNavigationFocusableView>
                    );
                  })}
                </View>
              </SpatialNavigationNode>
            </View>

            {/* ViewEase Assist Default Language */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>VIEWEASE ASSIST COMPANION LANGUAGE</Text>
              <SpatialNavigationNode orientation="horizontal">
                <View style={styles.optionsRow}>
                  {languageOptions.map((lang) => {
                    const isSelected = assistLanguage === lang;
                    return (
                      <SpatialNavigationFocusableView
                        key={lang}
                        onSelect={() => setAssistLanguage(lang)}
                      >
                        {({ isFocused: btnFocused }) => (
                          <View
                            style={[
                              styles.optionPill,
                              isSelected && styles.optionPillSelected,
                              btnFocused && styles.optionPillFocused,
                            ]}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                isSelected && styles.optionTextSelected,
                                btnFocused && styles.optionTextFocused,
                              ]}
                            >
                              {lang}
                            </Text>
                          </View>
                        )}
                      </SpatialNavigationFocusableView>
                    );
                  })}
                </View>
              </SpatialNavigationNode>
            </View>

            {/* Local Data Management */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>STORAGE & CACHE</Text>
              <SpatialNavigationNode orientation="horizontal">
                <View style={styles.optionsRow}>
                  <SpatialNavigationFocusableView onSelect={handleClearCache}>
                    {({ isFocused: btnFocused }) => (
                      <View
                        style={[
                          styles.actionPill,
                          btnFocused && styles.actionPillFocused,
                        ]}
                      >
                        <Text
                          style={[
                            styles.actionPillText,
                            btnFocused && styles.actionPillTextFocused,
                          ]}
                        >
                          🗑 Clear Playback Cache & Watchlist
                        </Text>
                      </View>
                    )}
                  </SpatialNavigationFocusableView>
                </View>
              </SpatialNavigationNode>
              {cacheStatus && (
                <Text style={styles.cacheNotice}>{cacheStatus}</Text>
              )}
            </View>

            {/* About Box */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>ViewEase TV</Text>
              <Text style={styles.aboutTagline}>Every Scene, Understood.</Text>
              <View style={styles.aboutDivider} />
              <View style={styles.aboutRow}>
                <Text style={styles.aboutKey}>Edition:</Text>
                <Text style={styles.aboutVal}>Amazon Developer Hackathon 2026</Text>
              </View>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutKey}>Target Platform:</Text>
                <Text style={styles.aboutVal}>{capabilities.platformName}</Text>
              </View>
              <View style={styles.aboutRow}>
                <Text style={styles.aboutKey}>Spatial Engine:</Text>
                <Text style={styles.aboutVal}>react-tv-space-navigation v6 (LRUD)</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
    paddingTop: scaledPixels(safeZones.titleSafe.vertical),
    paddingBottom: scaledPixels(safeZones.actionSafe.vertical),
  },
  header: {
    marginBottom: scaledPixels(20),
  },
  title: {
    fontSize: scaledPixels(42),
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    marginTop: scaledPixels(4),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scaledPixels(40),
  },
  diagnosticsHighlight: {
    backgroundColor: colors.cardElevated,
    borderRadius: scaledPixels(12),
    padding: scaledPixels(20),
    marginBottom: scaledPixels(24),
    borderWidth: scaledPixels(2),
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diagnosticsTextCol: {
    flex: 1,
    marginEnd: scaledPixels(20),
  },
  diagBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(4),
    marginBottom: scaledPixels(6),
  },
  diagBadgeText: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: scaledPixels(11),
    letterSpacing: 1,
  },
  diagTitle: {
    color: colors.text,
    fontSize: scaledPixels(22),
    fontWeight: '700',
    marginBottom: scaledPixels(4),
  },
  diagDesc: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
    lineHeight: scaledPixels(22),
  },
  diagBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: scaledPixels(22),
    paddingVertical: scaledPixels(14),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.primary,
  },
  diagBtnFocused: {
    backgroundColor: colors.primaryLight,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.06 }],
  },
  diagBtnText: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: scaledPixels(16),
  },
  diagBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  section: {
    marginBottom: scaledPixels(24),
  },
  sectionTitle: {
    fontSize: scaledPixels(14),
    fontWeight: '700',
    color: colors.textTertiary,
    letterSpacing: 1.1,
    marginBottom: scaledPixels(10),
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  optionPill: {
    backgroundColor: colors.card,
    paddingHorizontal: scaledPixels(18),
    paddingVertical: scaledPixels(10),
    borderRadius: scaledPixels(8),
    marginEnd: scaledPixels(12),
    marginBottom: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
  },
  optionPillSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(229, 169, 60, 0.16)',
  },
  optionPillFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.06 }],
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(16),
    fontWeight: '600',
  },
  optionTextSelected: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  optionTextFocused: {
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  actionPill: {
    backgroundColor: colors.cardElevated,
    paddingHorizontal: scaledPixels(18),
    paddingVertical: scaledPixels(12),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.borderLight,
  },
  actionPillFocused: {
    backgroundColor: colors.error,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  actionPillText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
    fontWeight: '600',
  },
  actionPillTextFocused: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cacheNotice: {
    color: colors.success,
    fontSize: scaledPixels(14),
    marginTop: scaledPixels(8),
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(12),
    padding: scaledPixels(20),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
    marginTop: scaledPixels(10),
  },
  aboutTitle: {
    color: colors.text,
    fontSize: scaledPixels(22),
    fontWeight: '800',
  },
  aboutTagline: {
    color: colors.primaryLight,
    fontSize: scaledPixels(14),
    fontStyle: 'italic',
    marginTop: scaledPixels(2),
  },
  aboutDivider: {
    height: scaledPixels(1),
    backgroundColor: colors.divider,
    marginVertical: scaledPixels(12),
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scaledPixels(4),
  },
  aboutKey: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
  },
  aboutVal: {
    color: colors.text,
    fontSize: scaledPixels(15),
    fontWeight: '600',
  },
});
