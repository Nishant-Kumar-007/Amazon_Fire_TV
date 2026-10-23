import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { VIEWEASE_CATALOG, ViewEaseTitle } from '../data/viewEaseCatalog';
import { colors } from '../theme';
import { TopNavigationBar } from '../components/TopNavigationBar';
import PlatformLinearGradient from '../components/PlatformLinearGradient';

type ExploreNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

const GENRES = [
  'All',
  'Web Series',
  'Movies',
  'Cartoons & Animation',
  'Sci-Fi',
  'Mystery',
  'Documentary',
];

const SEARCH_PRESETS = ['All Titles', 'Quantum', 'Kyoto', 'Aetheria', 'RoboBunny', 'Paradox', 'Genesis'];

export default function ExploreScreen() {
  const navigation = useNavigation<ExploreNavigationProp>();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const filteredTitles = useMemo(() => {
    return VIEWEASE_CATALOG.filter((item) => {
      const matchesGenre =
        selectedGenre === 'All' ||
        item.category === selectedGenre ||
        item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.genres.some((g) => g.toLowerCase().includes(q)) ||
        (item.cast && item.cast.some((c) => c.toLowerCase().includes(q)));

      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, searchQuery]);

  const handleSelectTitle = useCallback(
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

  return (
    <View style={styles.rootScreen}>
      {/* 1. Sleek Top Navigation Bar */}
      <TopNavigationBar
        activeTab="Explore"
        onSelectCategory={(cat) => {
          if (cat === 'All') setSelectedGenre('All');
          else setSelectedGenre(cat);
        }}
      />

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header & Search Bar */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Explore & Search Library</Text>
          <Text style={styles.headerSubtitle}>
            Browse {filteredTitles.length} titles across Web Series, Blockbusters, Anime & Documentaries
          </Text>

          {/* Search Box */}
          <View style={styles.searchBarWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title, genre, director or actor..."
              placeholderTextColor="rgba(240, 243, 248, 0.45)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Category Filter Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>BROWSE CATEGORIES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
            {GENRES.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <Pressable
                  key={genre}
                  accessibilityRole="button"
                  onPress={() => setSelectedGenre(genre)}
                  style={({ hovered }: any) => [
                    styles.filterPill,
                    isSelected && styles.filterPillSelected,
                    hovered && styles.filterPillHovered,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isSelected && styles.filterPillTextSelected,
                    ]}
                  >
                    {genre}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Quick Keyword Pills */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>QUICK SEARCH TAGS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
            {SEARCH_PRESETS.map((preset) => {
              const isSelected = preset === 'All Titles' ? searchQuery === '' : searchQuery === preset;
              return (
                <Pressable
                  key={preset}
                  accessibilityRole="button"
                  onPress={() => setSearchQuery(preset === 'All Titles' ? '' : preset)}
                  style={({ hovered }: any) => [
                    styles.searchPresetPill,
                    isSelected && styles.searchPresetPillSelected,
                    hovered && styles.searchPresetPillHovered,
                  ]}
                >
                  <Text
                    style={[
                      styles.searchPresetText,
                      isSelected && styles.searchPresetTextSelected,
                    ]}
                  >
                    #{preset}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Responsive Grid of Cards */}
        <View style={styles.gridContainer}>
          {filteredTitles.map((item) => {
            const isHovered = hoveredCardId === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => handleSelectTitle(item)}
                // @ts-ignore
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                style={({ pressed }: any) => [
                  styles.gridCard,
                  isHovered && styles.gridCardHighlighted,
                  pressed && styles.gridCardPressed,
                ]}
              >
                <Image
                  source={{ uri: item.headerImage || item.posterImage }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                <PlatformLinearGradient
                  colors={['transparent', 'rgba(11, 13, 17, 0.95)']}
                  start={{ x: 0, y: 0.4 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.cardGradient}
                />

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardCategory}>{item.category || item.genres[0]}</Text>
                    <Text style={styles.cardRating}>★ {item.rating}</Text>
                  </View>
                </View>

                {/* White Boundary overlay when hovered/focused */}
                {isHovered && (
                  <View style={styles.hoverOverlay}>
                    <View style={styles.playBadge}>
                      <Text style={styles.playBadgeText}>▶ DETAILS</Text>
                    </View>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {filteredTitles.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No matching titles found</Text>
            <Text style={styles.emptyText}>
              Try searching for "Quantum", "Kyoto", "RoboBunny", or reset filters.
            </Text>
            <Pressable
              onPress={() => {
                setSelectedGenre('All');
                setSearchQuery('');
              }}
              style={styles.resetBtn}
            >
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </Pressable>
          </View>
        )}
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
  scrollContent: {
    paddingBottom: 60,
  },
  headerSection: {
    paddingHorizontal: 48,
    paddingTop: 32,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 6,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginTop: 18,
    maxWidth: 700,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    outlineStyle: 'none' as any,
  },
  clearSearchBtn: {
    padding: 6,
    // @ts-ignore
    cursor: 'pointer',
  },
  clearSearchText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  filterSection: {
    paddingHorizontal: 48,
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    // @ts-ignore
    cursor: 'pointer',
  },
  filterPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillHovered: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filterPillTextSelected: {
    color: '#0B0D11',
    fontWeight: '800',
  },
  searchPresetPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    // @ts-ignore
    cursor: 'pointer',
  },
  searchPresetPillSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
  },
  searchPresetPillHovered: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchPresetText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  searchPresetTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 48,
    paddingTop: 16,
    gap: 20,
  },
  gridCard: {
    width: 270,
    height: 156,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#161B22',
    borderWidth: 2,
    borderColor: 'transparent',
    // @ts-ignore
    cursor: 'pointer',
  },
  gridCardHighlighted: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 22px rgba(255, 255, 255, 0.55)',
    transform: [{ scale: 1.06 }],
    zIndex: 50,
  },
  gridCardPressed: {
    transform: [{ scale: 1.02 }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  cardMeta: {
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
  hoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  playBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0B0D11',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
  },
  resetBtn: {
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    // @ts-ignore
    cursor: 'pointer',
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B0D11',
  },
});
