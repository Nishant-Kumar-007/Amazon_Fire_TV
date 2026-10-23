import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationScrollView,
  SpatialNavigationNode,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { RootStackParamList } from '../navigation/types';
import { CardData } from '../data/moviesData';
import { VIEWEASE_CATALOG, ViewEaseTitle } from '../data/viewEaseCatalog';
import { StorageService, PlaybackProgress } from '../services/StorageService';
import { colors } from '../theme';
import PlatformLinearGradient from '../components/PlatformLinearGradient';
import { TopNavigationBar } from '../components/TopNavigationBar';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

// Interactive Movie Card Component with White Boundary on Hover/Focus
interface MovieCardProps {
  item: ViewEaseTitle;
  isFocused?: boolean;
  progress?: PlaybackProgress | null;
  onPress: () => void;
  onFocus?: () => void;
  onHoverChange?: (isHovered: boolean) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  item,
  isFocused = false,
  progress,
  onPress,
  onFocus,
  onHoverChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const activeHighlight = isFocused || isHovered;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Watch ${item.title}`}
      onPress={onPress}
      // @ts-ignore - web hover events
      onMouseEnter={() => {
        setIsHovered(true);
        if (onHoverChange) onHoverChange(true);
        if (onFocus) onFocus();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (onHoverChange) onHoverChange(false);
      }}
      style={({ pressed }: any) => [
        styles.cardContainer,
        activeHighlight && styles.cardContainerHighlighted,
        pressed && styles.cardContainerPressed,
      ]}
    >
      <Image
        source={{ uri: item.headerImage || item.posterImage }}
        style={styles.cardImage as any}
        resizeMode="cover"
      />

      {/* Subtle bottom gradient for card legibility */}
      <PlatformLinearGradient
        colors={['transparent', 'rgba(11, 13, 17, 0.92)']}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 0, y: 1 }}
        style={styles.cardGradient}
      />

      {/* Card Info Overlay */}
      <View style={styles.cardInfoContainer}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.cardMetaRow}>
          {item.category && (
            <Text style={styles.cardCategory} numberOfLines={1}>
              {item.category}
            </Text>
          )}
          {item.rating && (
            <Text style={styles.cardRating}>★ {item.rating}</Text>
          )}
        </View>
      </View>

      {/* White / Glow Boundary on Focus or Mouse Hover */}
      {activeHighlight && (
        <View style={styles.whiteBoundaryGlow}>
          <View style={styles.playBadgeFloating}>
            <Text style={styles.playBadgeText}>▶ PLAY</Text>
          </View>
        </View>
      )}

      {/* Continue Watching Progress Bar */}
      {progress && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress.percent}%` }]} />
        </View>
      )}
    </Pressable>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const isFocused = useIsFocused();

  // Catalog and user state
  const [allMovies, setAllMovies] = useState<ViewEaseTitle[]>(VIEWEASE_CATALOG);
  const [continueWatching, setContinueWatching] = useState<PlaybackProgress[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Hero carousel state (8 featured titles auto-advancing)
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isAnyCardHovered, setIsAnyCardHovered] = useState(false);

  // Category "View All" modal state
  const [viewAllModalVisible, setViewAllModalVisible] = useState(false);
  const [viewAllCategoryName, setViewAllCategoryName] = useState('');
  const [viewAllMovies, setViewAllMovies] = useState<ViewEaseTitle[]>([]);

  // 8 featured titles for the split-screen hero showcase
  const heroFeaturedTitles: ViewEaseTitle[] = useMemo(() => {
    return allMovies.slice(0, 8);
  }, [allMovies]);

  const activeHeroTitle: ViewEaseTitle = useMemo(() => {
    return heroFeaturedTitles[heroIndex] || heroFeaturedTitles[0] || VIEWEASE_CATALOG[0];
  }, [heroFeaturedTitles, heroIndex]);

  // Auto-advance hero showcase every 5 seconds (unless hovered/interacting with hero or any card)
  useEffect(() => {
    if (isHeroHovered || isAnyCardHovered) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroFeaturedTitles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroFeaturedTitles.length, isHeroHovered, isAnyCardHovered]);

  // Load Continue Watching on mount and focus
  useEffect(() => {
    const updateContinueWatching = () => {
      setContinueWatching(StorageService.getContinueWatching());
    };
    updateContinueWatching();
    const unsubscribe = StorageService.subscribe(updateContinueWatching);

    return () => {
      unsubscribe();
    };
  }, [isFocused]);

  const navigateToDetails = useCallback(
    (item: ViewEaseTitle) => {
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
    (item: ViewEaseTitle, startTime = 0) => {
      navigation.navigate('Player', {
        movie: item.movie,
        headerImage: item.headerImage,
        title: item.title,
        id: String(item.id),
        startTime,
      });
    },
    [navigation],
  );

  // Category filters
  const trendingWebSeries = useMemo(
    () => allMovies.filter((m) => m.category === 'Web Series' || m.genres?.includes('Web Series')),
    [allMovies],
  );

  const blockbusterMovies = useMemo(
    () => allMovies.filter((m) => m.category === 'Movies' || m.genres?.includes('Movies')),
    [allMovies],
  );

  const cartoonsAndAnime = useMemo(
    () =>
      allMovies.filter(
        (m) =>
          m.category === 'Cartoons & Animation' ||
          m.genres?.includes('Animation') ||
          m.genres?.includes('Anime'),
      ),
    [allMovies],
  );

  const sciFiAndCyberpunk = useMemo(
    () =>
      allMovies.filter(
        (m) =>
          m.genres?.includes('Sci-Fi') ||
          m.genres?.includes('Cyberpunk') ||
          m.category === 'ViewEase Originals',
      ),
    [allMovies],
  );

  const documentaries = useMemo(
    () =>
      allMovies.filter(
        (m) =>
          m.category === 'Documentaries' ||
          m.genres?.includes('Documentary') ||
          m.genres?.includes('Nature') ||
          m.genres?.includes('Science'),
      ),
    [allMovies],
  );

  // Open "View All" modal for a category
  const openViewAll = (categoryTitle: string, moviesList: ViewEaseTitle[]) => {
    setViewAllCategoryName(categoryTitle);
    setViewAllMovies(moviesList);
    setViewAllModalVisible(true);
  };

  // Horizontal row scrolling references
  const rowRefs = useRef<{ [key: string]: ScrollView | null }>({});

  const scrollRow = (key: string, direction: 'left' | 'right') => {
    const scrollEl = rowRefs.current[key];
    if (scrollEl) {
      // @ts-ignore
      if (scrollEl.scrollBy) {
        // @ts-ignore
        scrollEl.scrollBy({ left: direction === 'left' ? -500 : 500, behavior: 'smooth' });
      }
    }
  };

  return (
    <View style={styles.rootScreen}>
      {/* 1. Sleek Top Navigation Bar (Always Visible, No Side Drawer Covering Page) */}
      <TopNavigationBar
        activeTab={activeCategoryFilter}
        onSelectCategory={(cat) => {
          setActiveCategoryFilter(cat);
        }}
        onOpenSearch={() => (navigation as any).navigate('Explore')}
      />

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Split-Screen Auto-Advancing Top Hero Showcase (8 Featured Titles) */}
        <View
          style={styles.heroShowcaseContainer}
          // @ts-ignore - pause auto-rotation when user hovers on laptop
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={() => setIsHeroHovered(false)}
        >
          {/* Background image & gradient overlay */}
          <Image
            source={{ uri: activeHeroTitle.headerImage }}
            style={styles.heroBackdropImage as any}
            resizeMode="cover"
          />
          <PlatformLinearGradient
            colors={['rgba(11,13,17,0.7)', 'rgba(11,13,17,0.25)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroGradientLeft}
          />
          <PlatformLinearGradient
            colors={['transparent', 'rgba(11,13,17,0.6)', colors.background]}
            start={{ x: 0, y: 0.7 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroGradientBottom}
          />

          {/* Split Screen Layout */}
          <View style={styles.heroSplitContent}>
            {/* Left Split Column: Metadata, Title, CTAs & Numbered Title Switcher */}
            <View style={styles.heroLeftCol}>
              {/* Badges Row */}
              <View style={styles.heroBadgeRow}>
                {activeHeroTitle.category && (
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{activeHeroTitle.category}</Text>
                  </View>
                )}
                {activeHeroTitle.releaseYear && (
                  <View style={styles.yearPill}>
                    <Text style={styles.yearPillText}>{activeHeroTitle.releaseYear}</Text>
                  </View>
                )}
                {activeHeroTitle.contentRating && (
                  <View style={styles.contentRatingPill}>
                    <Text style={styles.contentRatingPillText}>{activeHeroTitle.contentRating}</Text>
                  </View>
                )}
                <View style={styles.assistPill}>
                  <Text style={styles.assistPillIcon}>⚡</Text>
                  <Text style={styles.assistPillText}>ASSIST READY</Text>
                </View>
              </View>

              {/* Title & Tagline */}
              <Text style={styles.heroTitle} numberOfLines={2}>
                {activeHeroTitle.title}
              </Text>
              {activeHeroTitle.tagline ? (
                <Text style={styles.heroTagline} numberOfLines={1}>
                  "{activeHeroTitle.tagline}"
                </Text>
              ) : null}

              {/* Synopsis */}
              <Text style={styles.heroDescription} numberOfLines={3}>
                {activeHeroTitle.description}
              </Text>

              {/* Action Buttons */}
              <View style={styles.heroCtaRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigateToPlayer(activeHeroTitle)}
                  style={({ hovered }: any) => [
                    styles.primaryCtaBtn,
                    hovered && styles.primaryCtaBtnHovered,
                  ]}
                >
                  <Text style={styles.primaryCtaText}>▶ Play Now</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    StorageService.toggleMyList(activeHeroTitle);
                  }}
                  style={({ hovered }: any) => [
                    styles.secondaryCtaBtn,
                    hovered && styles.secondaryCtaBtnHovered,
                  ]}
                >
                  <Text style={styles.secondaryCtaText}>
                    {StorageService.isInMyList(activeHeroTitle.id) ? '✓ In My List' : '+ Add to My List'}
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigateToDetails(activeHeroTitle)}
                  style={({ hovered }: any) => [
                    styles.secondaryCtaBtn,
                    hovered && styles.secondaryCtaBtnHovered,
                  ]}
                >
                  <Text style={styles.secondaryCtaText}>ℹ Details</Text>
                </Pressable>
              </View>

              {/* Dot Indicators + Active Page Progress Bar */}
              <View style={styles.heroCarouselSelector}>
                <View style={styles.dotIndicatorRow}>
                  {heroFeaturedTitles.map((t, idx) => {
                    const isSelected = idx === heroIndex;
                    return (
                      <Pressable
                        key={t.id}
                        onPress={() => setHeroIndex(idx)}
                        // @ts-ignore
                        onMouseEnter={() => setHeroIndex(idx)}
                        style={({ hovered }: any) => [
                          styles.dotIndicator,
                          isSelected && styles.dotIndicatorActive,
                          hovered && !isSelected && styles.dotIndicatorHovered,
                        ]}
                      />
                    );
                  })}
                </View>
                {/* Wide progress bar showing current page position */}
                <View style={styles.heroProgressBarTrack}>
                  <View
                    style={[
                      styles.heroProgressBarFill,
                      {
                        width: `${((heroIndex + 1) / heroFeaturedTitles.length) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Left / Right Carousel Arrow Buttons for Laptop Mouse Users */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous featured movie"
            onPress={() =>
              setHeroIndex((prev) => (prev === 0 ? heroFeaturedTitles.length - 1 : prev - 1))
            }
            style={({ hovered }: any) => [
              styles.heroArrowBtn,
              styles.heroArrowLeft,
              hovered && styles.heroArrowBtnHovered,
            ]}
          >
            <Text style={styles.heroArrowText}>‹</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next featured movie"
            onPress={() => setHeroIndex((prev) => (prev + 1) % heroFeaturedTitles.length)}
            style={({ hovered }: any) => [
              styles.heroArrowBtn,
              styles.heroArrowRight,
              hovered && styles.heroArrowBtnHovered,
            ]}
          >
            <Text style={styles.heroArrowText}>›</Text>
          </Pressable>
        </View>

        {/* 3. Horizontal Content Rows with "View All →" and Scrolling Arrows */}
        <View style={styles.rowsWrapper}>
          {/* Continue Watching (Only shown if active progress exists) */}
          {continueWatching.length > 0 && (
            <CategoryRow
              rowKey="continue"
              title="Continue Watching"
              subtitle="Pick up exactly where you left off"
              movies={continueWatching.map((p) => {
                const found = allMovies.find((m) => String(m.id) === p.id);
                return found || allMovies[0];
              })}
              progressMap={continueWatching}
              onCardPress={(item, prog) => navigateToPlayer(item, prog?.positionSec || 0)}
              onCardHover={setIsAnyCardHovered}
              onViewAll={() =>
                openViewAll(
                  'Continue Watching',
                  continueWatching.map((p) => allMovies.find((m) => String(m.id) === p.id) || allMovies[0]),
                )
              }
              rowRef={(el) => {
                rowRefs.current['continue'] = el;
              }}
              onScrollLeft={() => scrollRow('continue', 'left')}
              onScrollRight={() => scrollRow('continue', 'right')}
            />
          )}

          {/* Trending Web Series */}
          {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Web Series') && (
            <CategoryRow
              rowKey="web-series"
              title="Trending Web Series"
              subtitle="Bingeworthy multi-episode sagas"
              movies={trendingWebSeries}
              onCardPress={navigateToDetails}
              onCardHover={setIsAnyCardHovered}
              onViewAll={() => openViewAll('Trending Web Series', trendingWebSeries)}
              rowRef={(el) => {
                rowRefs.current['web-series'] = el;
              }}
              onScrollLeft={() => scrollRow('web-series', 'left')}
              onScrollRight={() => scrollRow('web-series', 'right')}
            />
          )}

          {/* Blockbuster Movies */}
          {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Movies') && (
            <CategoryRow
              rowKey="movies"
              title="Blockbuster Movies"
              subtitle="Feature films in 4K HDR & Dolby Atmos"
              movies={blockbusterMovies}
              onCardPress={navigateToDetails}
              onCardHover={setIsAnyCardHovered}
              onViewAll={() => openViewAll('Blockbuster Movies', blockbusterMovies)}
              rowRef={(el) => {
                rowRefs.current['movies'] = el;
              }}
              onScrollLeft={() => scrollRow('movies', 'left')}
              onScrollRight={() => scrollRow('movies', 'right')}
            />
          )}

          {/* Cartoons & Animation */}
          {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Cartoons & Animation') && (
            <CategoryRow
              rowKey="cartoons"
              title="Cartoons & Animation"
              subtitle="Anime epics & family friendly adventures"
              movies={cartoonsAndAnime}
              onCardPress={navigateToDetails}
              onCardHover={setIsAnyCardHovered}
              onViewAll={() => openViewAll('Cartoons & Animation', cartoonsAndAnime)}
              rowRef={(el) => {
                rowRefs.current['cartoons'] = el;
              }}
              onScrollLeft={() => scrollRow('cartoons', 'left')}
              onScrollRight={() => scrollRow('cartoons', 'right')}
            />
          )}

          {/* Sci-Fi & Cyberpunk */}
          {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Sci-Fi') && (
            <CategoryRow
              rowKey="scifi"
              title="Sci-Fi & Cyberpunk"
              subtitle="Interstellar mysteries and synthetic realities"
              movies={sciFiAndCyberpunk}
              onCardPress={navigateToDetails}
              onCardHover={setIsAnyCardHovered}
              onViewAll={() => openViewAll('Sci-Fi & Cyberpunk', sciFiAndCyberpunk)}
              rowRef={(el) => {
                rowRefs.current['scifi'] = el;
              }}
              onScrollLeft={() => scrollRow('scifi', 'left')}
              onScrollRight={() => scrollRow('scifi', 'right')}
            />
          )}

          {/* Documentaries */}
          {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Documentaries') && (
            <CategoryRow
              rowKey="docs"
              title="Nature & Space Documentaries"
              subtitle="Real scientific discoveries and cosmic horizons"
              movies={documentaries}
              onCardPress={navigateToDetails}
              onCardHover={setIsAnyCardHovered}
              onViewAll={() => openViewAll('Nature & Space Documentaries', documentaries)}
              rowRef={(el) => {
                rowRefs.current['docs'] = el;
              }}
              onScrollLeft={() => scrollRow('docs', 'left')}
              onScrollRight={() => scrollRow('docs', 'right')}
            />
          )}
        </View>
      </ScrollView>

      {/* 4. "View All" Full Category Grid Modal */}
      <Modal
        visible={viewAllModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setViewAllModalVisible(false)}
      >
        <View style={styles.viewAllBackdrop}>
          <View style={styles.viewAllCard}>
            {/* Modal Header */}
            <View style={styles.viewAllHeader}>
              <View>
                <Text style={styles.viewAllCategoryTitle}>{viewAllCategoryName}</Text>
                <Text style={styles.viewAllSub}>
                  Showing all {viewAllMovies.length} titles in this collection
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => setViewAllModalVisible(false)}
                style={({ hovered }: any) => [
                  styles.closeViewAllBtn,
                  hovered && styles.closeViewAllBtnHovered,
                ]}
              >
                <Text style={styles.closeViewAllText}>✕ Close</Text>
              </Pressable>
            </View>

            {/* Grid of Movie Cards */}
            <ScrollView
              contentContainerStyle={styles.viewAllGridContent}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.viewAllGrid}>
                {viewAllMovies.map((movie) => (
                  <View key={movie.id} style={styles.viewAllGridItem}>
                    <MovieCard
                      item={movie}
                      onPress={() => {
                        setViewAllModalVisible(false);
                        navigateToDetails(movie);
                      }}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Reusable Category Row with Header, "View All →", and Scrolling Arrows
interface CategoryRowProps {
  rowKey: string;
  title: string;
  subtitle: string;
  movies: ViewEaseTitle[];
  progressMap?: PlaybackProgress[];
  onCardPress: (item: ViewEaseTitle, prog?: PlaybackProgress | null) => void;
  onViewAll: () => void;
  rowRef: (el: ScrollView | null) => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  onCardHover?: (isHovered: boolean) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  title,
  subtitle,
  movies,
  progressMap,
  onCardPress,
  onViewAll,
  rowRef,
  onScrollLeft,
  onScrollRight,
  onCardHover,
}) => {
  return (
    <View style={styles.rowSection}>
      {/* Row Header with Category Title & "View All →" button */}
      <View style={styles.rowHeader}>
        <View style={styles.rowTitleWrapper}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.rowHeaderActions}>
          {/* Scroll Arrows for Laptop Users */}
          <View style={styles.scrollArrowsGroup}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Scroll row left"
              onPress={onScrollLeft}
              style={({ hovered }: any) => [
                styles.rowArrowBtn,
                hovered && styles.rowArrowBtnHovered,
              ]}
            >
              <Text style={styles.rowArrowText}>‹</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Scroll row right"
              onPress={onScrollRight}
              style={({ hovered }: any) => [
                styles.rowArrowBtn,
                hovered && styles.rowArrowBtnHovered,
              ]}
            >
              <Text style={styles.rowArrowText}>›</Text>
            </Pressable>
          </View>

          {/* View All Button */}
          <Pressable
            accessibilityRole="button"
            onPress={onViewAll}
            style={({ hovered }: any) => [
              styles.viewAllBtn,
              hovered && styles.viewAllBtnHovered,
            ]}
          >
            <Text style={styles.viewAllText}>View All →</Text>
          </Pressable>
        </View>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        ref={rowRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowCardsContainer}
      >
        {movies.map((item) => {
          const prog = progressMap?.find((p) => p.id === item.id) || null;
          return (
            <View key={item.id} style={styles.cardItemWrapper}>
              <MovieCard
                item={item}
                progress={prog}
                onPress={() => onCardPress(item, prog)}
                onHoverChange={onCardHover}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    backgroundColor: '#0B0D11',
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 60,
  },

  // Split-Screen Hero Showcase Styles
  heroShowcaseContainer: {
    width: '100%',
    height: 520,
    position: 'relative',
    backgroundColor: '#0D0F14',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  heroBackdropImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 1.0,
  },
  heroGradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '55%',
  },
  heroGradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  heroSplitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  heroLeftCol: {
    maxWidth: 780,
    width: '100%',
    justifyContent: 'center',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  spotlightBadge: {
    backgroundColor: 'rgba(229, 169, 60, 0.25)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  spotlightBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  categoryPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryPillText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  yearPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  yearPillText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  contentRatingPill: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  contentRatingPillText: {
    fontSize: 10,
    color: colors.text,
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
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 46,
    letterSpacing: 0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroTagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.primary,
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(240, 243, 248, 0.85)',
    maxWidth: 620,
    marginBottom: 24,
  },
  heroCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  primaryCtaBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    // @ts-ignore
    cursor: 'pointer',
  },
  primaryCtaBtnHovered: {
    backgroundColor: '#F5BE58',
    // @ts-ignore
    boxShadow: '0 0 20px rgba(229, 169, 60, 0.7)',
    transform: [{ scale: 1.04 }],
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B0D11',
    letterSpacing: 0.5,
  },
  secondaryCtaBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    // @ts-ignore
    cursor: 'pointer',
  },
  secondaryCtaBtnHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.04 }],
  },
  secondaryCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  // Dot Indicators + Progress Bar
  heroCarouselSelector: {
    marginTop: 18,
  },
  dotIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    // @ts-ignore
    cursor: 'pointer',
  },
  dotIndicatorActive: {
    width: 22,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    // @ts-ignore
    boxShadow: '0 0 10px rgba(229, 169, 60, 0.8)',
  },
  dotIndicatorHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transform: [{ scale: 1.2 }],
  },
  heroProgressBarTrack: {
    width: 280,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  heroProgressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  // Right Hero Column: Preview Card
  heroRightCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
  },
  heroPreviewCard: {
    width: 380,
    maxWidth: '100%',
    height: 230,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    // @ts-ignore
    cursor: 'pointer',
  },
  heroPreviewCardHovered: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 25px rgba(255, 255, 255, 0.5)',
    transform: [{ scale: 1.05 }],
  },
  heroPreviewImage: {
    width: '100%',
    height: '100%',
  },
  heroPreviewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 13, 17, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heroPlayCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(229, 169, 60, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
  },
  heroPlayIcon: {
    fontSize: 22,
    color: '#0B0D11',
    marginLeft: 3,
  },
  heroPreviewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  heroPreviewHint: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },

  // Carousel Arrow Buttons for Laptop
  heroArrowBtn: {
    position: 'absolute',
    top: '46%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(13, 15, 20, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    // @ts-ignore
    cursor: 'pointer',
  },
  heroArrowLeft: {
    left: 14,
  },
  heroArrowRight: {
    right: 14,
  },
  heroArrowBtnHovered: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  heroArrowText: {
    fontSize: 28,
    color: colors.text,
    lineHeight: 30,
    fontWeight: '700',
  },

  // Category Rows Wrapper
  rowsWrapper: {
    paddingTop: 16,
  },
  rowSection: {
    marginBottom: 32,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    marginBottom: 14,
  },
  rowTitleWrapper: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.4,
  },
  rowSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  rowHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scrollArrowsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  rowArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // @ts-ignore
    cursor: 'pointer',
  },
  rowArrowBtnHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: '#FFFFFF',
  },
  rowArrowText: {
    fontSize: 20,
    color: colors.text,
    lineHeight: 22,
    fontWeight: '800',
  },
  viewAllBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 169, 60, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.35)',
    // @ts-ignore
    cursor: 'pointer',
  },
  viewAllBtnHovered: {
    backgroundColor: 'rgba(229, 169, 60, 0.28)',
    borderColor: colors.primary,
    // @ts-ignore
    boxShadow: '0 0 12px rgba(229, 169, 60, 0.4)',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  rowCardsContainer: {
    paddingHorizontal: 48,
    gap: 18,
  },
  cardItemWrapper: {
    marginRight: 4,
  },

  // Movie Card with White Boundary & Hover Elevation
  cardContainer: {
    width: 260,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#161B22',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    // @ts-ignore
    cursor: 'pointer',
  },
  cardContainerHighlighted: {
    // Exact White Boundary requested by user:
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 22px rgba(255, 255, 255, 0.55)',
    transform: [{ scale: 1.06 }],
    zIndex: 50,
  },
  cardContainerPressed: {
    transform: [{ scale: 1.02 }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardInfoContainer: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  cardCategory: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  cardRating: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  whiteBoundaryGlow: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  playBadgeFloating: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  playBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0B0D11',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },

  // "View All" Modal Styles
  viewAllBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  viewAllCard: {
    width: '94%',
    maxHeight: '90%',
    backgroundColor: '#12151C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.9,
    shadowRadius: 32,
  },
  viewAllHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  viewAllCategoryTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  viewAllSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeViewAllBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // @ts-ignore
    cursor: 'pointer',
  },
  closeViewAllBtnHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: '#FFFFFF',
  },
  closeViewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  viewAllGridContent: {
    padding: 28,
  },
  viewAllGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'flex-start',
  },
  viewAllGridItem: {
    width: 260,
  },
});
