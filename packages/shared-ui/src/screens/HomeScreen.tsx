import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, Platform } from 'react-native';
import { useNavigation, DrawerActions, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationScrollView,
  SpatialNavigationNode,
  SpatialNavigationVirtualizedList,
  SpatialNavigationVirtualizedListRef,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { RootStackParamList } from '../navigation/types';
import { fetchMoviesData, CardData } from '../data/moviesData';
import { VIEWEASE_CATALOG, ViewEaseTitle } from '../data/viewEaseCatalog';
import { StorageService, PlaybackProgress } from '../services/StorageService';
import { colors, safeZones } from '../theme';
import PlatformLinearGradient from '../components/PlatformLinearGradient';
import { getOpenDrawerDirection } from '../utils/rtl';
import { useMenuContext } from '../components/MenuContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

// Memoized Movie Card Component with warm amber focus state
const MovieItem = React.memo(
  ({
    item,
    isFocused,
    progress,
  }: {
    item: CardData;
    isFocused: boolean;
    progress?: PlaybackProgress | null;
  }) => {
    const imageSource = useMemo(() => ({ uri: item.headerImage }), [item.headerImage]);

    return (
      <View style={[styles.cardContainer, isFocused && styles.cardContainerFocused]}>
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Focus Glow Overlay */}
        {isFocused && (
          <View style={styles.cardFocusedOverlay}>
            <Text style={styles.cardFocusedTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {item.category && (
              <Text style={styles.cardFocusedCategory}>{item.category}</Text>
            )}
          </View>
        )}

        {/* Progress Bar for Continue Watching */}
        {progress && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress.percent}%` }]} />
          </View>
        )}
      </View>
    );
  },
);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [allMovies, setAllMovies] = useState<CardData[]>(VIEWEASE_CATALOG);
  const [continueWatching, setContinueWatching] = useState<PlaybackProgress[]>([]);
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  // Load movies and continue watching on mount & on focus
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchMoviesData();
        if (isMounted) setAllMovies(data);
      } catch (err) {
        if (isMounted) setAllMovies(VIEWEASE_CATALOG);
      }
    };
    load();

    const updateContinueWatching = () => {
      setContinueWatching(StorageService.getContinueWatching());
    };
    updateContinueWatching();
    const unsubscribe = StorageService.subscribe(updateContinueWatching);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isFocused]);

  const focusedItem: CardData = useMemo(
    () => allMovies[focusedIndex] || allMovies[0] || VIEWEASE_CATALOG[0],
    [focusedIndex, allMovies],
  );

  const headerImageSource = useMemo(
    () => ({ uri: focusedItem.headerImage }),
    [focusedItem.headerImage],
  );

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getOpenDrawerDirection() && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  const navigateToDetails = useCallback(
    (item: CardData) => {
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
    },
    [navigation],
  );

  const navigateToPlayer = useCallback(
    (item: CardData, startTime = 0) => {
      navigation.navigate('Player', {
        movie: item.movie,
        headerImage: item.headerImage,
        title: item.title,
        id: String(item.id),
      });
    },
    [navigation],
  );

  // Rows configuration
  const trendingMovies = useMemo(() => allMovies.slice(0, 5), [allMovies]);
  const originalMovies = useMemo(
    () => allMovies.filter((m) => m.category === 'ViewEase Originals' || m.genres?.includes('Sci-Fi')),
    [allMovies],
  );
  const documentaries = useMemo(
    () => allMovies.filter((m) => m.category === 'Documentaries' || m.genres?.includes('Nature')),
    [allMovies],
  );

  const renderCard = useCallback(
    ({ item, index }: { item: CardData; index: number }, progress?: PlaybackProgress | null) => (
      <SpatialNavigationFocusableView
        onSelect={() => {
          if (progress) {
            navigateToPlayer(item, progress.positionSec);
          } else {
            navigateToDetails(item);
          }
        }}
        onFocus={() => setFocusedIndex(index)}
      >
        {({ isFocused: cardFocused }) => (
          <MovieItem item={item} isFocused={cardFocused} progress={progress} />
        )}
      </SpatialNavigationFocusableView>
    ),
    [navigateToDetails, navigateToPlayer],
  );

  return (
    <SpatialNavigationRoot
      isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.container}>
        {/* Cinematic Hero Header with Real-Time Backdrop */}
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            source={headerImageSource}
            resizeMode="cover"
          />

          {/* Gradients for text contrast */}
          <PlatformLinearGradient
            colors={['rgba(11,13,17,0.95)', 'rgba(11,13,17,0.7)', 'rgba(11,13,17,0.2)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientLeft}
          />
          <PlatformLinearGradient
            colors={['transparent', 'rgba(11,13,17,0.85)', colors.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBottom}
          />

          {/* Hero Content Information */}
          <View style={styles.headerContent}>
            {/* Badges Row */}
            <View style={styles.badgeRow}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>VIEWEASE ORIGINAL</Text>
              </View>
              {focusedItem.contentRating && (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>{focusedItem.contentRating}</Text>
                </View>
              )}
              {focusedItem.releaseYear && (
                <View style={styles.metaBadge}>
                  <Text style={styles.metaBadgeText}>{focusedItem.releaseYear}</Text>
                </View>
              )}
              {focusedItem.rating && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {focusedItem.rating}</Text>
                </View>
              )}
              <View style={styles.assistPill}>
                <Text style={styles.assistPillIcon}>⚡</Text>
                <Text style={styles.assistPillText}>ASSIST ENABLED</Text>
              </View>
            </View>

            {/* Title & Description */}
            <Text style={styles.heroTitle} numberOfLines={1}>
              {focusedItem.title}
            </Text>
            <Text style={styles.heroDescription} numberOfLines={3}>
              {focusedItem.description}
            </Text>

            {/* Hero CTAs */}
            <SpatialNavigationNode orientation="horizontal">
              <View style={styles.heroActionsRow}>
                <DefaultFocus>
                  <SpatialNavigationFocusableView
                    onSelect={() => navigateToPlayer(focusedItem)}
                  >
                    {({ isFocused: btnFocused }) => (
                      <View style={[styles.heroBtn, styles.playBtn, btnFocused && styles.heroBtnFocused]}>
                        <Text style={[styles.heroBtnText, styles.playBtnText, btnFocused && styles.heroBtnTextFocused]}>
                          ▶ Play Now
                        </Text>
                      </View>
                    )}
                  </SpatialNavigationFocusableView>
                </DefaultFocus>

                <SpatialNavigationFocusableView
                  onSelect={() => navigateToDetails(focusedItem)}
                >
                  {({ isFocused: btnFocused }) => (
                    <View style={[styles.heroBtn, styles.detailsBtn, btnFocused && styles.heroBtnFocused]}>
                      <Text style={[styles.heroBtnText, btnFocused && styles.heroBtnTextFocused]}>
                        ℹ More Details
                      </Text>
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              </View>
            </SpatialNavigationNode>
          </View>
        </View>

        {/* Horizontal Content Rows */}
        <SpatialNavigationScrollView
          offsetFromStart={scaledPixels(40)}
          style={styles.scrollContent}
        >
          {/* Continue Watching Row (Dynamically populated) */}
          {continueWatching.length > 0 && (
            <View style={styles.rowContainer}>
              <View style={styles.rowHeader}>
                <Text style={styles.rowTitle}>Continue Watching</Text>
                <Text style={styles.rowBadge}>Resume from last scene</Text>
              </View>
              <SpatialNavigationNode orientation="horizontal">
                <View style={styles.rowCards}>
                  {continueWatching.map((p, idx) => {
                    const title = allMovies.find((m) => String(m.id) === p.id) || VIEWEASE_CATALOG[0];
                    return (
                      <View key={p.id} style={{ marginEnd: scaledPixels(20) }}>
                        {renderCard({ item: title, index: idx }, p)}
                      </View>
                    );
                  })}
                </View>
              </SpatialNavigationNode>
            </View>
          )}

          {/* Trending Row */}
          <View style={styles.rowContainer}>
            <View style={styles.rowHeader}>
              <Text style={styles.rowTitle}>Trending Now</Text>
              <Text style={styles.rowBadge}>Top picks today</Text>
            </View>
            <SpatialNavigationNode orientation="horizontal">
              <View style={styles.rowCards}>
                {trendingMovies.map((item, idx) => (
                  <View key={String(item.id)} style={{ marginEnd: scaledPixels(20) }}>
                    {renderCard({ item, index: idx })}
                  </View>
                ))}
              </View>
            </SpatialNavigationNode>
          </View>

          {/* ViewEase Originals Row */}
          <View style={styles.rowContainer}>
            <View style={styles.rowHeader}>
              <Text style={styles.rowTitle}>ViewEase Originals</Text>
              <Text style={styles.rowBadge}>Contextual viewing enabled</Text>
            </View>
            <SpatialNavigationNode orientation="horizontal">
              <View style={styles.rowCards}>
                {originalMovies.map((item, idx) => (
                  <View key={String(item.id)} style={{ marginEnd: scaledPixels(20) }}>
                    {renderCard({ item, index: idx })}
                  </View>
                ))}
              </View>
            </SpatialNavigationNode>
          </View>

          {/* Documentaries Row */}
          <View style={styles.rowContainer}>
            <View style={styles.rowHeader}>
              <Text style={styles.rowTitle}>Nature & Science</Text>
              <Text style={styles.rowBadge}>4K Ultra HD</Text>
            </View>
            <SpatialNavigationNode orientation="horizontal">
              <View style={styles.rowCards}>
                {documentaries.map((item, idx) => (
                  <View key={String(item.id)} style={{ marginEnd: scaledPixels(20) }}>
                    {renderCard({ item, index: idx })}
                  </View>
                ))}
              </View>
            </SpatialNavigationNode>
          </View>
        </SpatialNavigationScrollView>
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: scaledPixels(500),
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '70%',
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaledPixels(180),
  },
  headerContent: {
    paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
    paddingBottom: scaledPixels(28),
    maxWidth: '65%',
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledPixels(12),
    flexWrap: 'wrap',
  },
  brandBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
    marginEnd: scaledPixels(10),
  },
  brandBadgeText: {
    color: colors.textOnPrimary,
    fontSize: scaledPixels(12),
    fontWeight: '800',
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
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: colors.text,
    fontSize: scaledPixels(44),
    fontWeight: '800',
    marginBottom: scaledPixels(10),
    letterSpacing: 0.5,
  },
  heroDescription: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    lineHeight: scaledPixels(26),
    marginBottom: scaledPixels(20),
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroBtn: {
    paddingVertical: scaledPixels(12),
    paddingHorizontal: scaledPixels(26),
    borderRadius: scaledPixels(8),
    marginEnd: scaledPixels(16),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    backgroundColor: colors.primary,
  },
  detailsBtn: {
    backgroundColor: colors.cardElevated,
    borderColor: colors.border,
  },
  heroBtnFocused: {
    backgroundColor: colors.primaryLight,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.06 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: scaledPixels(12),
    elevation: 8,
  },
  heroBtnText: {
    color: colors.text,
    fontSize: scaledPixels(18),
    fontWeight: '700',
  },
  playBtnText: {
    color: colors.textOnPrimary,
  },
  heroBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  scrollContent: {
    flex: 1,
    paddingTop: scaledPixels(10),
  },
  rowContainer: {
    marginBottom: scaledPixels(32),
    paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaledPixels(14),
  },
  rowTitle: {
    color: colors.text,
    fontSize: scaledPixels(24),
    fontWeight: '700',
    letterSpacing: 0.5,
    marginEnd: scaledPixels(12),
  },
  rowBadge: {
    color: colors.textTertiary,
    fontSize: scaledPixels(14),
    fontWeight: '500',
  },
  rowCards: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainer: {
    width: scaledPixels(320),
    height: scaledPixels(180),
    borderRadius: scaledPixels(10),
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
  },
  cardContainerFocused: {
    borderColor: colors.primary,
    transform: [{ scale: 1.06 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: scaledPixels(14),
    elevation: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardFocusedOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 13, 17, 0.88)',
    paddingHorizontal: scaledPixels(12),
    paddingVertical: scaledPixels(8),
  },
  cardFocusedTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: scaledPixels(15),
  },
  cardFocusedCategory: {
    color: colors.primaryLight,
    fontSize: scaledPixels(12),
    fontWeight: '600',
    marginTop: scaledPixels(2),
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scaledPixels(5),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});
