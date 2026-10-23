import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Pressable } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { StorageService } from '../services/StorageService';
import { VIEWEASE_CATALOG, ViewEaseTitle } from '../data/viewEaseCatalog';
import { TopNavigationBar } from '../components/TopNavigationBar';
import PlatformLinearGradient from '../components/PlatformLinearGradient';

type TVScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigator'>;

export default function TVScreen() {
  const navigation = useNavigation<TVScreenNavigationProp>();
  const isFocused = useIsFocused();

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() =>
    StorageService.getWatchlist(),
  );
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

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
    <View style={styles.rootScreen}>
      {/* 1. Sleek Top Navigation Bar */}
      <TopNavigationBar activeTab="TV" />

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>My Saved Watchlist</Text>
          <Text style={styles.headerSubtitle}>
            Your personalized queue of movies, web series, and anime ({savedTitles.length} saved)
          </Text>
        </View>

        {savedTitles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔖</Text>
            <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
            <Text style={styles.emptySubtitle}>
              Explore our cinematic catalog and click "+ Add to My List" to build your queue.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => (navigation as any).navigate('Home')}
              style={({ hovered }: any) => [
                styles.browseBtn,
                hovered && styles.browseBtnHovered,
              ]}
            >
              <Text style={styles.browseBtnText}>Explore Home Screen</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {savedTitles.map((item) => {
              const isHovered = hoveredCardId === item.id;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.cardWrapper,
                    isHovered && styles.cardWrapperHovered,
                  ]}
                  // @ts-ignore
                  onMouseEnter={() => setHoveredCardId(item.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  <Pressable
                    style={styles.cardPressable}
                    onPress={() => navigateToDetails(item)}
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
                  </Pressable>

                  {/* Actions Bar */}
                  <View style={styles.cardActionsRow}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => navigateToPlayer(item)}
                      style={({ hovered }: any) => [
                        styles.playActionBtn,
                        hovered && styles.playActionBtnHovered,
                      ]}
                    >
                      <Text style={styles.playActionText}>▶ Play</Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleRemove(item.id)}
                      style={({ hovered }: any) => [
                        styles.removeActionBtn,
                        hovered && styles.removeActionBtnHovered,
                      ]}
                    >
                      <Text style={styles.removeActionText}>✕ Remove</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
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
    paddingBottom: 24,
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 48,
    gap: 20,
  },
  cardWrapper: {
    width: 270,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#161B22',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardWrapperHovered: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // @ts-ignore
    boxShadow: '0 0 22px rgba(255, 255, 255, 0.55)',
    transform: [{ scale: 1.05 }],
    zIndex: 50,
  },
  cardPressable: {
    width: '100%',
    height: 154,
    position: 'relative',
    // @ts-ignore
    cursor: 'pointer',
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
  cardActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#11141A',
  },
  playActionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    // @ts-ignore
    cursor: 'pointer',
  },
  playActionBtnHovered: {
    backgroundColor: colors.primary,
  },
  playActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  removeActionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    // @ts-ignore
    cursor: 'pointer',
  },
  removeActionBtnHovered: {
    backgroundColor: 'rgba(231, 76, 60, 0.25)',
  },
  removeActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
    maxWidth: 450,
    textAlign: 'center',
  },
  browseBtn: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    // @ts-ignore
    cursor: 'pointer',
  },
  browseBtnHovered: {
    backgroundColor: '#F5BE58',
    // @ts-ignore
    boxShadow: '0 0 16px rgba(229, 169, 60, 0.6)',
  },
  browseBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0D11',
  },
});
