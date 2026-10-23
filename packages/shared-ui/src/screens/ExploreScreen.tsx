import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, DrawerActions, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationNode,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { RootStackParamList } from '../navigation/types';
import { VIEWEASE_CATALOG, ViewEaseTitle } from '../data/viewEaseCatalog';
import { colors, safeZones } from '../theme';
import { getOpenDrawerDirection } from '../utils/rtl';
import { useMenuContext } from '../components/MenuContext';

type ExploreNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

const GENRES = [
  'All',
  'Sci-Fi',
  'Mystery',
  'Thriller',
  'Documentary',
  'ViewEase Originals',
];

const SEARCH_PRESETS = ['All Titles', 'Quantum', 'Kyoto', 'Aurora', 'Botanist', 'Code'];

export default function ExploreScreen() {
  const navigation = useNavigation<ExploreNavigationProp>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [activeSearchPreset, setActiveSearchPreset] = useState<string>('All Titles');

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getOpenDrawerDirection()) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, navigation],
  );

  const filteredTitles = useMemo(() => {
    return VIEWEASE_CATALOG.filter((item) => {
      const matchesGenre =
        selectedGenre === 'All' ||
        item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()) ||
        item.category.toLowerCase() === selectedGenre.toLowerCase();

      const matchesSearch =
        activeSearchPreset === 'All Titles' ||
        item.title.toLowerCase().includes(activeSearchPreset.toLowerCase()) ||
        item.description.toLowerCase().includes(activeSearchPreset.toLowerCase());

      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, activeSearchPreset]);

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
    <SpatialNavigationRoot
      isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Browse & Search</Text>
          <Text style={styles.headerSubtitle}>
            Explore the curated ViewEase entertainment library ({filteredTitles.length} titles)
          </Text>
        </View>

        {/* Filter Pills - Genre */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>CATEGORIES</Text>
          <SpatialNavigationNode orientation="horizontal">
            <View style={styles.pillsRow}>
              {GENRES.map((genre, idx) => {
                const isSelected = selectedGenre === genre;
                const Component = idx === 0 ? DefaultFocus : React.Fragment;
                return (
                  <Component key={genre}>
                    <SpatialNavigationFocusableView onSelect={() => setSelectedGenre(genre)}>
                      {({ isFocused: pillFocused }) => (
                        <View
                          style={[
                            styles.filterPill,
                            isSelected && styles.filterPillSelected,
                            pillFocused && styles.filterPillFocused,
                          ]}
                        >
                          <Text
                            style={[
                              styles.filterPillText,
                              isSelected && styles.filterPillTextSelected,
                              pillFocused && styles.filterPillTextFocused,
                            ]}
                          >
                            {genre}
                          </Text>
                        </View>
                      )}
                    </SpatialNavigationFocusableView>
                  </Component>
                );
              })}
            </View>
          </SpatialNavigationNode>
        </View>

        {/* Search Presets Row */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>POPULAR SEARCHES</Text>
          <SpatialNavigationNode orientation="horizontal">
            <View style={styles.pillsRow}>
              {SEARCH_PRESETS.map((query) => {
                const isSelected = activeSearchPreset === query;
                return (
                  <SpatialNavigationFocusableView
                    key={query}
                    onSelect={() => setActiveSearchPreset(query)}
                  >
                    {({ isFocused: pillFocused }) => (
                      <View
                        style={[
                          styles.searchPill,
                          isSelected && styles.searchPillSelected,
                          pillFocused && styles.searchPillFocused,
                        ]}
                      >
                        <Text style={styles.searchPillIcon}>🔍</Text>
                        <Text
                          style={[
                            styles.searchPillText,
                            isSelected && styles.searchPillTextSelected,
                            pillFocused && styles.searchPillTextFocused,
                          ]}
                        >
                          {query}
                        </Text>
                      </View>
                    )}
                  </SpatialNavigationFocusableView>
                );
              })}
            </View>
          </SpatialNavigationNode>
        </View>

        {/* Catalog Grid */}
        <ScrollView style={styles.gridScroll} showsVerticalScrollIndicator={false}>
          <SpatialNavigationNode orientation="vertical">
            <View style={styles.gridCards}>
              {filteredTitles.map((title) => (
                <SpatialNavigationFocusableView
                  key={title.id}
                  onSelect={() => handleSelectTitle(title)}
                >
                  {({ isFocused: cardFocused }) => (
                    <View
                      style={[
                        styles.gridCard,
                        cardFocused && styles.gridCardFocused,
                      ]}
                    >
                      <Image
                        source={{ uri: title.headerImage }}
                        style={styles.gridCardImage}
                        resizeMode="cover"
                      />
                      <View style={styles.gridCardOverlay}>
                        <View style={styles.badgeRow}>
                          <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>★ {title.rating}</Text>
                          </View>
                          <Text style={styles.yearText}>{title.releaseYear}</Text>
                        </View>
                        <Text style={styles.gridCardTitle} numberOfLines={1}>
                          {title.title}
                        </Text>
                        <Text style={styles.gridCardGenres} numberOfLines={1}>
                          {title.genres.join(' • ')}
                        </Text>
                      </View>
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              ))}
            </View>
          </SpatialNavigationNode>
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
    marginBottom: scaledPixels(16),
  },
  headerTitle: {
    color: colors.text,
    fontSize: scaledPixels(38),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    marginTop: scaledPixels(4),
  },
  filterSection: {
    marginBottom: scaledPixels(14),
  },
  filterSectionTitle: {
    color: colors.textTertiary,
    fontSize: scaledPixels(13),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: scaledPixels(8),
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterPill: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(20),
    paddingHorizontal: scaledPixels(18),
    paddingVertical: scaledPixels(10),
    marginEnd: scaledPixels(12),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
  },
  filterPillSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(229, 169, 60, 0.16)',
  },
  filterPillFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.06 }],
  },
  filterPillText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(16),
    fontWeight: '600',
  },
  filterPillTextSelected: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  filterPillTextFocused: {
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: scaledPixels(16),
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(8),
    marginEnd: scaledPixels(10),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
  },
  searchPillSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: 'rgba(229, 169, 60, 0.12)',
  },
  searchPillFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.05 }],
  },
  searchPillIcon: {
    fontSize: scaledPixels(13),
    marginEnd: scaledPixels(6),
  },
  searchPillText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(14),
    fontWeight: '500',
  },
  searchPillTextSelected: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  searchPillTextFocused: {
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  gridScroll: {
    flex: 1,
    marginTop: scaledPixels(10),
  },
  gridCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridCard: {
    width: scaledPixels(340),
    height: scaledPixels(200),
    borderRadius: scaledPixels(10),
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginEnd: scaledPixels(24),
    marginBottom: scaledPixels(24),
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
  },
  gridCardFocused: {
    borderColor: colors.primary,
    transform: [{ scale: 1.06 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: scaledPixels(14),
    elevation: 10,
  },
  gridCardImage: {
    width: '100%',
    height: '100%',
  },
  gridCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 13, 17, 0.92)',
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(10),
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledPixels(4),
  },
  ratingBadge: {
    backgroundColor: 'rgba(229, 169, 60, 0.2)',
    paddingHorizontal: scaledPixels(6),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
  },
  ratingText: {
    color: colors.primaryLight,
    fontSize: scaledPixels(12),
    fontWeight: '700',
  },
  yearText: {
    color: colors.textTertiary,
    fontSize: scaledPixels(12),
  },
  gridCardTitle: {
    color: colors.text,
    fontSize: scaledPixels(17),
    fontWeight: '700',
  },
  gridCardGenres: {
    color: colors.primaryLight,
    fontSize: scaledPixels(13),
    marginTop: scaledPixels(2),
  },
});
