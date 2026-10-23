import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { useNavigation, DrawerActions, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationNode,
} from 'react-tv-space-navigation';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { useMenuContext } from '../components/MenuContext';
import { RootStackParamList } from '../navigation/types';
import { safeZones, colors } from '../theme';
import { getOpenDrawerDirection } from '../utils/rtl';
import { StorageService } from '../services/StorageService';
import { VIEWEASE_CATALOG, ViewEaseTitle } from '../data/viewEaseCatalog';

type TVScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

export default function TVScreen() {
  const navigation = useNavigation<TVScreenNavigationProp>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() =>
    StorageService.getWatchlist(),
  );

  useEffect(() => {
    const update = () => setWatchlistIds(StorageService.getWatchlist());
    update();
    const unsub = StorageService.subscribe(update);
    return unsub;
  }, [isFocused]);

  const savedTitles: ViewEaseTitle[] = useMemo(() => {
    return watchlistIds
      .map((id) => VIEWEASE_CATALOG.find((t) => t.id === id))
      .filter((t): t is ViewEaseTitle => !!t);
  }, [watchlistIds]);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getOpenDrawerDirection()) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, navigation],
  );

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
    (item: ViewEaseTitle) => {
      navigation.navigate('Player', {
        movie: item.movie,
        headerImage: item.headerImage,
        title: item.title,
        id: item.id,
      });
    },
    [navigation],
  );

  const handleRemove = useCallback((id: string) => {
    StorageService.toggleWatchlist(id);
  }, []);

  return (
    <SpatialNavigationRoot
      isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My List & Saved Watchlist</Text>
          <Text style={styles.headerSubtitle}>
            Your personalized queue of movies, series, and contextual documentaries ({savedTitles.length} items)
          </Text>
        </View>

        {savedTitles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎬</Text>
            <Text style={styles.emptyTitle}>Your Watchlist is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Explore our cinematic library and press "Add to My List" on any title.
            </Text>
            <SpatialNavigationNode orientation="horizontal">
              <DefaultFocus>
                <SpatialNavigationFocusableView
                  onSelect={() => navigation.navigate('Home' as any)}
                >
                  {({ isFocused: btnFocused }) => (
                    <View style={[styles.exploreBtn, btnFocused && styles.exploreBtnFocused]}>
                      <Text style={[styles.exploreBtnText, btnFocused && styles.exploreBtnTextFocused]}>
                        Browse Featured Titles
                      </Text>
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              </DefaultFocus>
            </SpatialNavigationNode>
          </View>
        ) : (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <SpatialNavigationNode orientation="vertical">
              <View style={styles.cardList}>
                {savedTitles.map((title, idx) => (
                  <View key={title.id} style={styles.savedCardRow}>
                    <Image
                      source={{ uri: title.headerImage }}
                      style={styles.cardThumb}
                      resizeMode="cover"
                    />
                    <View style={styles.cardMeta}>
                      <View style={styles.cardMetaHeader}>
                        <Text style={styles.cardTitle}>{title.title}</Text>
                        <View style={styles.ratingBadge}>
                          <Text style={styles.ratingText}>★ {title.rating}</Text>
                        </View>
                      </View>
                      <Text style={styles.cardGenres}>
                        {title.releaseYear} • {title.contentRating} • {title.genres.join(', ')}
                      </Text>
                      <Text style={styles.cardDescription} numberOfLines={2}>
                        {title.description}
                      </Text>
                    </View>

                    {/* Actions */}
                    <SpatialNavigationNode orientation="horizontal">
                      <View style={styles.cardActions}>
                        {idx === 0 ? (
                          <DefaultFocus>
                            <SpatialNavigationFocusableView
                              onSelect={() => navigateToPlayer(title)}
                            >
                              {({ isFocused: btnFocused }) => (
                                <View style={[styles.playBtn, btnFocused && styles.btnFocused]}>
                                  <Text style={[styles.playBtnText, btnFocused && styles.playBtnTextFocused]}>
                                    ▶ Play
                                  </Text>
                                </View>
                              )}
                            </SpatialNavigationFocusableView>
                          </DefaultFocus>
                        ) : (
                          <SpatialNavigationFocusableView
                            onSelect={() => navigateToPlayer(title)}
                          >
                            {({ isFocused: btnFocused }) => (
                              <View style={[styles.playBtn, btnFocused && styles.btnFocused]}>
                                <Text style={[styles.playBtnText, btnFocused && styles.playBtnTextFocused]}>
                                  ▶ Play
                                </Text>
                              </View>
                            )}
                          </SpatialNavigationFocusableView>
                        )}

                        <SpatialNavigationFocusableView
                          onSelect={() => navigateToDetails(title)}
                        >
                          {({ isFocused: btnFocused }) => (
                            <View style={[styles.infoBtn, btnFocused && styles.btnFocused]}>
                              <Text style={[styles.infoBtnText, btnFocused && styles.infoBtnTextFocused]}>
                                ℹ Details
                              </Text>
                            </View>
                          )}
                        </SpatialNavigationFocusableView>

                        <SpatialNavigationFocusableView
                          onSelect={() => handleRemove(title.id)}
                        >
                          {({ isFocused: btnFocused }) => (
                            <View style={[styles.removeBtn, btnFocused && styles.btnFocused]}>
                              <Text style={[styles.removeBtnText, btnFocused && styles.removeBtnTextFocused]}>
                                ✕ Remove
                              </Text>
                            </View>
                          )}
                        </SpatialNavigationFocusableView>
                      </View>
                    </SpatialNavigationNode>
                  </View>
                ))}
              </View>
            </SpatialNavigationNode>
          </ScrollView>
        )}
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
    marginBottom: scaledPixels(24),
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
  scrollContent: {
    flex: 1,
  },
  cardList: {
    paddingBottom: scaledPixels(30),
  },
  savedCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: scaledPixels(12),
    padding: scaledPixels(16),
    marginBottom: scaledPixels(16),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
  },
  cardThumb: {
    width: scaledPixels(220),
    height: scaledPixels(124),
    borderRadius: scaledPixels(8),
    backgroundColor: colors.cardElevated,
  },
  cardMeta: {
    flex: 1,
    marginHorizontal: scaledPixels(20),
  },
  cardMetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: colors.text,
    fontSize: scaledPixels(22),
    fontWeight: '700',
    marginBottom: scaledPixels(4),
  },
  ratingBadge: {
    backgroundColor: 'rgba(229, 169, 60, 0.2)',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
  },
  ratingText: {
    color: colors.primaryLight,
    fontWeight: '700',
    fontSize: scaledPixels(13),
  },
  cardGenres: {
    color: colors.primaryLight,
    fontSize: scaledPixels(14),
    fontWeight: '600',
    marginBottom: scaledPixels(6),
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
    lineHeight: scaledPixels(22),
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: scaledPixels(130),
  },
  playBtn: {
    backgroundColor: colors.primary,
    borderRadius: scaledPixels(6),
    paddingVertical: scaledPixels(8),
    alignItems: 'center',
    marginBottom: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.primary,
  },
  infoBtn: {
    backgroundColor: colors.cardElevated,
    borderRadius: scaledPixels(6),
    paddingVertical: scaledPixels(8),
    alignItems: 'center',
    marginBottom: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
  },
  removeBtn: {
    backgroundColor: 'transparent',
    borderRadius: scaledPixels(6),
    paddingVertical: scaledPixels(8),
    alignItems: 'center',
    borderWidth: scaledPixels(2),
    borderColor: colors.borderLight,
  },
  btnFocused: {
    backgroundColor: colors.primaryLight,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.06 }],
  },
  playBtnText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: scaledPixels(14),
  },
  playBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  infoBtnText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: scaledPixels(14),
  },
  infoBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  removeBtnText: {
    color: colors.textTertiary,
    fontWeight: '600',
    fontSize: scaledPixels(13),
  },
  removeBtnTextFocused: {
    color: colors.textOnPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaledPixels(60),
  },
  emptyIcon: {
    fontSize: scaledPixels(64),
    marginBottom: scaledPixels(16),
  },
  emptyTitle: {
    color: colors.text,
    fontSize: scaledPixels(28),
    fontWeight: '700',
    marginBottom: scaledPixels(8),
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    marginBottom: scaledPixels(24),
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: scaledPixels(28),
    paddingVertical: scaledPixels(14),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.primary,
  },
  exploreBtnFocused: {
    backgroundColor: colors.primaryLight,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  exploreBtnText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: scaledPixels(18),
  },
  exploreBtnTextFocused: {
    color: colors.textOnPrimary,
  },
});
