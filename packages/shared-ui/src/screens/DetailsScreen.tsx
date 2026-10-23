import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  SpatialNavigationRoot,
  SpatialNavigationNode,
  SpatialNavigationFocusableView,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { RootStackParamList } from '../navigation/types';
import { safeZones, colors } from '../theme';
import PlatformLinearGradient from '../components/PlatformLinearGradient';
import { getTitleById, VIEWEASE_CATALOG, ViewEaseTitle } from '../data/viewEaseCatalog';
import { StorageService } from '../services/StorageService';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const isFocused = useIsFocused();

  const {
    title,
    description,
    movie,
    headerImage,
    genres,
    releaseYear,
    rating,
    ratingCount,
    contentRating,
    duration,
  } = route.params;

  // Look up full metadata from catalog
  const catalogEntry: ViewEaseTitle = useMemo(() => {
    const found = VIEWEASE_CATALOG.find((t) => t.title === title || t.movie === movie);
    return found || getTitleById('quantum-horizon');
  }, [title, movie]);

  const [inWatchlist, setInWatchlist] = useState<boolean>(() =>
    StorageService.isInWatchlist(catalogEntry.id),
  );

  useEffect(() => {
    setInWatchlist(StorageService.isInWatchlist(catalogEntry.id));
    const unsubscribe = StorageService.subscribe(() => {
      setInWatchlist(StorageService.isInWatchlist(catalogEntry.id));
    });
    return unsubscribe;
  }, [catalogEntry.id]);

  const toggleWatchlist = useCallback(() => {
    const nextState = StorageService.toggleWatchlist(catalogEntry.id);
    setInWatchlist(nextState);
  }, [catalogEntry.id]);

  const navigateToPlayer = useCallback(
    (timeSec = 0) => {
      navigation.navigate('Player', {
        movie: catalogEntry.movie || movie,
        headerImage: catalogEntry.headerImage || headerImage,
        title: catalogEntry.title || title,
        id: catalogEntry.id,
      });
    },
    [navigation, catalogEntry, movie, headerImage, title],
  );

  const formattedDuration = useMemo(() => {
    const d = duration || catalogEntry.duration;
    if (!d) return '2h 8m';
    const mins = Math.floor(d / 60);
    const secs = d % 60;
    return `${mins}m ${secs}s`;
  }, [duration, catalogEntry.duration]);

  const relatedTitles = useMemo(() => {
    return VIEWEASE_CATALOG.filter((t) => t.id !== catalogEntry.id).slice(0, 4);
  }, [catalogEntry.id]);

  return (
    <SpatialNavigationRoot isActive={isFocused}>
      <View style={styles.container}>
        {/* Background Backdrop Artwork */}
        <Image
          source={{ uri: catalogEntry.headerImage || headerImage }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Dual Gradients for Cinematic Readability */}
        <PlatformLinearGradient
          colors={['rgba(11,13,17,0.95)', 'rgba(11,13,17,0.85)', 'rgba(11,13,17,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientLeft}
        />
        <PlatformLinearGradient
          colors={['transparent', 'rgba(11,13,17,0.8)', colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientBottom}
        />

        {/* Details Content Container */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            {/* Badges Bar */}
            <View style={styles.badgeRow}>
              <View style={styles.originalBadge}>
                <Text style={styles.originalBadgeText}>VIEWEASE EXCLUSIVE</Text>
              </View>
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{contentRating || catalogEntry.contentRating || 'TV-14'}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{releaseYear || catalogEntry.releaseYear || 2026}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{formattedDuration}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  ★ {(rating || catalogEntry.rating || 4.9).toFixed(1)} ({ratingCount || catalogEntry.ratingCount || 1200})
                </Text>
              </View>
              <View style={styles.assistPill}>
                <Text style={styles.assistPillIcon}>⚡</Text>
                <Text style={styles.assistPillText}>ASSIST AVAILABLE</Text>
              </View>
            </View>

            {/* Title & Tagline */}
            <Text style={styles.title}>{title || catalogEntry.title}</Text>
            {catalogEntry.tagline ? (
              <Text style={styles.tagline}>{catalogEntry.tagline}</Text>
            ) : null}

            {/* Genres */}
            <View style={styles.genresRow}>
              {(genres || catalogEntry.genres || []).map((genre, idx) => (
                <View key={idx} style={styles.genrePill}>
                  <Text style={styles.genrePillText}>{genre}</Text>
                </View>
              ))}
            </View>

            {/* Synopsis Description */}
            <Text style={styles.synopsis}>
              {description || catalogEntry.description}
            </Text>

            {/* Interactive Action Controls */}
            <SpatialNavigationNode orientation="horizontal">
              <View style={styles.actionsRow}>
                <DefaultFocus>
                  <SpatialNavigationFocusableView onSelect={() => navigateToPlayer(0)}>
                    {({ isFocused: btnFocused }) => (
                      <View
                        style={[
                          styles.actionBtn,
                          styles.playBtn,
                          btnFocused && styles.actionBtnFocused,
                        ]}
                      >
                        <Text
                          style={[
                            styles.actionBtnText,
                            styles.playBtnText,
                            btnFocused && styles.actionBtnTextFocused,
                          ]}
                        >
                          ▶ Play Movie
                        </Text>
                      </View>
                    )}
                  </SpatialNavigationFocusableView>
                </DefaultFocus>

                <SpatialNavigationFocusableView onSelect={toggleWatchlist}>
                  {({ isFocused: btnFocused }) => (
                    <View
                      style={[
                        styles.actionBtn,
                        styles.watchlistBtn,
                        inWatchlist && styles.inWatchlistBtn,
                        btnFocused && styles.actionBtnFocused,
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionBtnText,
                          inWatchlist && styles.inWatchlistText,
                          btnFocused && styles.actionBtnTextFocused,
                        ]}
                      >
                        {inWatchlist ? '✓ In My List' : '➕ Add to My List'}
                      </Text>
                    </View>
                  )}
                </SpatialNavigationFocusableView>

                <SpatialNavigationFocusableView onSelect={() => navigation.goBack()}>
                  {({ isFocused: btnFocused }) => (
                    <View
                      style={[
                        styles.actionBtn,
                        styles.backBtn,
                        btnFocused && styles.actionBtnFocused,
                      ]}
                    >
                      <Text
                        style={[
                          styles.actionBtnText,
                          btnFocused && styles.actionBtnTextFocused,
                        ]}
                      >
                        ← Back
                      </Text>
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              </View>
            </SpatialNavigationNode>

            {/* Production & Cast Metadata Panel */}
            <View style={styles.crewCard}>
              <View style={styles.crewColumn}>
                <Text style={styles.crewLabel}>DIRECTOR</Text>
                <Text style={styles.crewValue}>{catalogEntry.director || 'Elena Rostova'}</Text>
              </View>

              <View style={[styles.crewColumn, { flex: 2 }]}>
                <Text style={styles.crewLabel}>STARRING</Text>
                <Text style={styles.crewValue}>
                  {(catalogEntry.cast || ['David Sterling', 'Maya Lin']).join(', ')}
                </Text>
              </View>

              <View style={styles.crewColumn}>
                <Text style={styles.crewLabel}>AUDIO & SUBTITLES</Text>
                <Text style={styles.crewValue}>English (Dolby 5.1), Hindi • English [CC], Hindi</Text>
              </View>
            </View>

            {/* Related Titles Section */}
            <View style={styles.relatedSection}>
              <Text style={styles.relatedHeading}>MORE LIKE THIS</Text>
              <SpatialNavigationNode orientation="horizontal">
                <View style={styles.relatedGrid}>
                  {relatedTitles.map((item) => (
                    <SpatialNavigationFocusableView
                      key={item.id}
                      onSelect={() => {
                        navigation.navigate('Details', {
                          title: item.title,
                          description: item.description,
                          headerImage: item.headerImage,
                          movie: item.movie,
                          category: item.category,
                          genres: item.genres,
                          releaseYear: item.releaseYear,
                          rating: item.rating,
                          ratingCount: item.ratingCount,
                          contentRating: item.contentRating,
                          duration: item.duration,
                        });
                      }}
                    >
                      {({ isFocused: cardFocused }) => (
                        <View
                          style={[
                            styles.relatedCard,
                            cardFocused && styles.relatedCardFocused,
                          ]}
                        >
                          <Image
                            source={{ uri: item.headerImage }}
                            style={styles.relatedImage}
                            resizeMode="cover"
                          />
                          <View style={styles.relatedOverlay}>
                            <Text style={styles.relatedTitle} numberOfLines={1}>
                              {item.title}
                            </Text>
                            <Text style={styles.relatedRating}>★ {item.rating}</Text>
                          </View>
                        </View>
                      )}
                    </SpatialNavigationFocusableView>
                  ))}
                </View>
              </SpatialNavigationNode>
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
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '65%',
  },
  gradientLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '75%',
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaledPixels(160),
  },
  scrollContent: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
    paddingTop: scaledPixels(safeZones.titleSafe.vertical),
    paddingBottom: scaledPixels(safeZones.actionSafe.vertical + 40),
    maxWidth: '65%',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledPixels(14),
    flexWrap: 'wrap',
  },
  originalBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
    marginEnd: scaledPixels(10),
  },
  originalBadgeText: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: scaledPixels(12),
    letterSpacing: 1,
  },
  metaBadge: {
    backgroundColor: colors.cardElevated,
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
    marginEnd: scaledPixels(10),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
  },
  metaBadgeText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(13),
    fontWeight: '600',
  },
  ratingBadge: {
    backgroundColor: 'rgba(229, 169, 60, 0.2)',
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
    marginEnd: scaledPixels(10),
    borderWidth: scaledPixels(1),
    borderColor: colors.badgeBorder,
  },
  ratingText: {
    color: colors.primaryLight,
    fontSize: scaledPixels(13),
    fontWeight: '700',
  },
  assistPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
    borderWidth: scaledPixels(1),
    borderColor: 'rgba(52, 199, 89, 0.4)',
  },
  assistPillIcon: {
    fontSize: scaledPixels(12),
    marginEnd: scaledPixels(4),
  },
  assistPillText: {
    color: colors.success,
    fontSize: scaledPixels(12),
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: scaledPixels(52),
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: scaledPixels(8),
  },
  tagline: {
    color: colors.primaryLight,
    fontSize: scaledPixels(20),
    fontWeight: '500',
    fontStyle: 'italic',
    marginBottom: scaledPixels(16),
  },
  genresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledPixels(18),
  },
  genrePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: scaledPixels(12),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(6),
    marginEnd: scaledPixels(8),
  },
  genrePillText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(13),
    fontWeight: '600',
  },
  synopsis: {
    color: colors.textSecondary,
    fontSize: scaledPixels(19),
    lineHeight: scaledPixels(28),
    marginBottom: scaledPixels(26),
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledPixels(32),
  },
  actionBtn: {
    paddingVertical: scaledPixels(14),
    paddingHorizontal: scaledPixels(24),
    borderRadius: scaledPixels(8),
    marginEnd: scaledPixels(14),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  watchlistBtn: {
    backgroundColor: colors.cardElevated,
  },
  inWatchlistBtn: {
    borderColor: colors.primaryLight,
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
  },
  backBtn: {
    backgroundColor: 'transparent',
    borderColor: colors.borderLight,
  },
  actionBtnFocused: {
    backgroundColor: colors.primaryLight,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.06 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: scaledPixels(12),
    elevation: 8,
  },
  actionBtnText: {
    color: colors.text,
    fontSize: scaledPixels(17),
    fontWeight: '700',
  },
  playBtnText: {
    color: colors.textOnPrimary,
  },
  inWatchlistText: {
    color: colors.primaryLight,
  },
  actionBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  crewCard: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(12),
    padding: scaledPixels(18),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaledPixels(32),
  },
  crewColumn: {
    flex: 1,
    marginEnd: scaledPixels(16),
  },
  crewLabel: {
    color: colors.textTertiary,
    fontSize: scaledPixels(12),
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: scaledPixels(6),
  },
  crewValue: {
    color: colors.text,
    fontSize: scaledPixels(15),
    lineHeight: scaledPixels(22),
    fontWeight: '500',
  },
  relatedSection: {
    marginTop: scaledPixels(10),
  },
  relatedHeading: {
    color: colors.text,
    fontSize: scaledPixels(20),
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: scaledPixels(14),
  },
  relatedGrid: {
    flexDirection: 'row',
  },
  relatedCard: {
    width: scaledPixels(240),
    height: scaledPixels(135),
    borderRadius: scaledPixels(8),
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginEnd: scaledPixels(16),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
  },
  relatedCardFocused: {
    borderColor: colors.primary,
    transform: [{ scale: 1.06 }],
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  relatedOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 13, 17, 0.9)',
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedTitle: {
    color: colors.text,
    fontSize: scaledPixels(13),
    fontWeight: '600',
    flex: 1,
  },
  relatedRating: {
    color: colors.primaryLight,
    fontSize: scaledPixels(12),
    fontWeight: '700',
    marginStart: scaledPixels(6),
  },
});
