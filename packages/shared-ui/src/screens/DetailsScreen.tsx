import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import PlatformLinearGradient from '../components/PlatformLinearGradient';
import { getTitleById, VIEWEASE_CATALOG, ViewEaseTitle } from '../data/viewEaseCatalog';
import { StorageService } from '../services/StorageService';
import { TopNavigationBar } from '../components/TopNavigationBar';

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
  const [hoveredRelatedId, setHoveredRelatedId] = useState<string | null>(null);

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
    return VIEWEASE_CATALOG.filter((t) => t.id !== catalogEntry.id).slice(0, 5);
  }, [catalogEntry.id]);

  return (
    <View style={styles.rootScreen}>
      {/* 1. Sleek Top Navigation Bar */}
      <TopNavigationBar />

      <ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
        {/* Backdrop Banner */}
        <View style={styles.backdropContainer}>
          <Image
            source={{ uri: catalogEntry.headerImage || headerImage }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          <PlatformLinearGradient
            colors={['rgba(11,13,17,0.95)', 'rgba(11,13,17,0.85)', 'rgba(11,13,17,0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientLeft}
          />
          <PlatformLinearGradient
            colors={['transparent', 'rgba(11,13,17,0.8)', '#0B0D11']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBottom}
          />

          {/* Details Content Overlay */}
          <View style={styles.detailsContentWrapper}>
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
              <Text style={styles.tagline}>"{catalogEntry.tagline}"</Text>
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
            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigateToPlayer(0)}
                style={({ hovered }: any) => [
                  styles.actionBtn,
                  styles.playBtn,
                  hovered && styles.playBtnHovered,
                ]}
              >
                <Text style={styles.playBtnText}>▶ Play Movie</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={toggleWatchlist}
                style={({ hovered }: any) => [
                  styles.actionBtn,
                  styles.watchlistBtn,
                  inWatchlist && styles.inWatchlistBtn,
                  hovered && styles.secondaryBtnHovered,
                ]}
              >
                <Text
                  style={[
                    styles.secondaryBtnText,
                    inWatchlist && styles.inWatchlistText,
                  ]}
                >
                  {inWatchlist ? '✓ In My List' : '➕ Add to My List'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.goBack()}
                style={({ hovered }: any) => [
                  styles.actionBtn,
                  styles.backBtn,
                  hovered && styles.secondaryBtnHovered,
                ]}
              >
                <Text style={styles.secondaryBtnText}>← Back</Text>
              </Pressable>
            </View>

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
          </View>
        </View>

        {/* Related Titles Carousel */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedHeading}>More Like This</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedRow}>
            {relatedTitles.map((item) => {
              const isHovered = hoveredRelatedId === item.id;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  onPress={() => {
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
                  // @ts-ignore
                  onMouseEnter={() => setHoveredRelatedId(item.id)}
                  onMouseLeave={() => setHoveredRelatedId(null)}
                  style={({ pressed }: any) => [
                    styles.relatedCard,
                    isHovered && styles.relatedCardHovered,
                    pressed && styles.relatedCardPressed,
                  ]}
                >
                  <Image
                    source={{ uri: item.headerImage || item.posterImage }}
                    style={styles.relatedImage}
                    resizeMode="cover"
                  />
                  <PlatformLinearGradient
                    colors={['transparent', 'rgba(11, 13, 17, 0.95)']}
                    start={{ x: 0, y: 0.4 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.cardGradient}
                  />
                  <View style={styles.relatedInfo}>
                    <Text style={styles.relatedTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.relatedMeta}>{item.category} • ★ {item.rating}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    backgroundColor: '#0B0D11',
  },
  mainScrollView: {
    flex: 1,
  },
  backdropContainer: {
    width: '100%',
    minHeight: 560,
    position: 'relative',
    backgroundColor: '#0D0F14',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  gradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '75%',
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
  },
  detailsContentWrapper: {
    paddingHorizontal: 48,
    paddingTop: 36,
    paddingBottom: 24,
    maxWidth: 820,
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  originalBadge: {
    backgroundColor: 'rgba(229, 169, 60, 0.25)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  originalBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  metaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  ratingBadge: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  assistPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  assistPillIcon: {
    fontSize: 10,
    color: '#3498db',
    marginRight: 4,
  },
  assistPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3498db',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 50,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.primary,
    marginBottom: 14,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  genrePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  genrePillText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  synopsis: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(240, 243, 248, 0.9)',
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  actionBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
    // @ts-ignore
    cursor: 'pointer',
  },
  playBtn: {
    backgroundColor: colors.primary,
  },
  playBtnHovered: {
    backgroundColor: '#F5BE58',
    // @ts-ignore
    boxShadow: '0 0 20px rgba(229, 169, 60, 0.7)',
    transform: [{ scale: 1.04 }],
  },
  playBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B0D11',
  },
  watchlistBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inWatchlistBtn: {
    backgroundColor: 'rgba(229, 169, 60, 0.2)',
    borderColor: colors.primary,
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryBtnHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.04 }],
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  inWatchlistText: {
    color: colors.primary,
  },
  crewCard: {
    flexDirection: 'row',
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    gap: 20,
  },
  crewColumn: {
    flex: 1,
  },
  crewLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  crewValue: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  relatedSection: {
    paddingHorizontal: 48,
    paddingTop: 10,
    paddingBottom: 40,
  },
  relatedHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  relatedRow: {
    gap: 16,
  },
  relatedCard: {
    width: 250,
    height: 144,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#161B22',
    borderWidth: 2,
    borderColor: 'transparent',
    // @ts-ignore
    cursor: 'pointer',
  },
  relatedCardHovered: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.55)',
    transform: [{ scale: 1.06 }],
  },
  relatedCardPressed: {
    transform: [{ scale: 1.02 }],
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  relatedInfo: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
  },
  relatedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  relatedMeta: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
