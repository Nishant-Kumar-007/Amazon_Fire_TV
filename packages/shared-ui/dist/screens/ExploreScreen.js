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
exports.default = ExploreScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const useScale_1 = require("../hooks/useScale");
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
const theme_1 = require("../theme");
const rtl_1 = require("../utils/rtl");
const MenuContext_1 = require("../components/MenuContext");
const GENRES = [
    'All',
    'Sci-Fi',
    'Mystery',
    'Thriller',
    'Documentary',
    'ViewEase Originals',
];
const SEARCH_PRESETS = ['All Titles', 'Quantum', 'Kyoto', 'Aurora', 'Botanist', 'Code'];
function ExploreScreen() {
    const navigation = (0, native_1.useNavigation)();
    const { isOpen: isMenuOpen, toggleMenu } = (0, MenuContext_1.useMenuContext)();
    const isFocused = (0, native_1.useIsFocused)();
    const isActive = isFocused && !isMenuOpen;
    const [selectedGenre, setSelectedGenre] = (0, react_1.useState)('All');
    const [activeSearchPreset, setActiveSearchPreset] = (0, react_1.useState)('All Titles');
    const onDirectionHandledWithoutMovement = (0, react_1.useCallback)((movement) => {
        if (movement === (0, rtl_1.getOpenDrawerDirection)()) {
            navigation.dispatch(native_1.DrawerActions.openDrawer());
            toggleMenu(true);
        }
    }, [toggleMenu, navigation]);
    const filteredTitles = (0, react_1.useMemo)(() => {
        return viewEaseCatalog_1.VIEWEASE_CATALOG.filter((item) => {
            const matchesGenre = selectedGenre === 'All' ||
                item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()) ||
                item.category.toLowerCase() === selectedGenre.toLowerCase();
            const matchesSearch = activeSearchPreset === 'All Titles' ||
                item.title.toLowerCase().includes(activeSearchPreset.toLowerCase()) ||
                item.description.toLowerCase().includes(activeSearchPreset.toLowerCase());
            return matchesGenre && matchesSearch;
        });
    }, [selectedGenre, activeSearchPreset]);
    const handleSelectTitle = (0, react_1.useCallback)((item) => {
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
    }, [navigation]);
    return (<react_tv_space_navigation_1.SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <react_native_1.View style={styles.container}>
        {/* Header */}
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.headerTitle}>Browse & Search</react_native_1.Text>
          <react_native_1.Text style={styles.headerSubtitle}>
            Explore the curated ViewEase entertainment library ({filteredTitles.length} titles)
          </react_native_1.Text>
        </react_native_1.View>

        {/* Filter Pills - Genre */}
        <react_native_1.View style={styles.filterSection}>
          <react_native_1.Text style={styles.filterSectionTitle}>CATEGORIES</react_native_1.Text>
          <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
            <react_native_1.View style={styles.pillsRow}>
              {GENRES.map((genre, idx) => {
            const isSelected = selectedGenre === genre;
            const Component = idx === 0 ? react_tv_space_navigation_1.DefaultFocus : react_1.default.Fragment;
            return (<Component key={genre}>
                    <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => setSelectedGenre(genre)}>
                      {({ isFocused: pillFocused }) => (<react_native_1.View style={[
                        styles.filterPill,
                        isSelected && styles.filterPillSelected,
                        pillFocused && styles.filterPillFocused,
                    ]}>
                          <react_native_1.Text style={[
                        styles.filterPillText,
                        isSelected && styles.filterPillTextSelected,
                        pillFocused && styles.filterPillTextFocused,
                    ]}>
                            {genre}
                          </react_native_1.Text>
                        </react_native_1.View>)}
                    </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                  </Component>);
        })}
            </react_native_1.View>
          </react_tv_space_navigation_1.SpatialNavigationNode>
        </react_native_1.View>

        {/* Search Presets Row */}
        <react_native_1.View style={styles.filterSection}>
          <react_native_1.Text style={styles.filterSectionTitle}>POPULAR SEARCHES</react_native_1.Text>
          <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
            <react_native_1.View style={styles.pillsRow}>
              {SEARCH_PRESETS.map((query) => {
            const isSelected = activeSearchPreset === query;
            return (<react_tv_space_navigation_1.SpatialNavigationFocusableView key={query} onSelect={() => setActiveSearchPreset(query)}>
                    {({ isFocused: pillFocused }) => (<react_native_1.View style={[
                        styles.searchPill,
                        isSelected && styles.searchPillSelected,
                        pillFocused && styles.searchPillFocused,
                    ]}>
                        <react_native_1.Text style={styles.searchPillIcon}>🔍</react_native_1.Text>
                        <react_native_1.Text style={[
                        styles.searchPillText,
                        isSelected && styles.searchPillTextSelected,
                        pillFocused && styles.searchPillTextFocused,
                    ]}>
                          {query}
                        </react_native_1.Text>
                      </react_native_1.View>)}
                  </react_tv_space_navigation_1.SpatialNavigationFocusableView>);
        })}
            </react_native_1.View>
          </react_tv_space_navigation_1.SpatialNavigationNode>
        </react_native_1.View>

        {/* Catalog Grid */}
        <react_native_1.ScrollView style={styles.gridScroll} showsVerticalScrollIndicator={false}>
          <react_tv_space_navigation_1.SpatialNavigationNode orientation="vertical">
            <react_native_1.View style={styles.gridCards}>
              {filteredTitles.map((title) => (<react_tv_space_navigation_1.SpatialNavigationFocusableView key={title.id} onSelect={() => handleSelectTitle(title)}>
                  {({ isFocused: cardFocused }) => (<react_native_1.View style={[
                    styles.gridCard,
                    cardFocused && styles.gridCardFocused,
                ]}>
                      <react_native_1.Image source={{ uri: title.headerImage }} style={styles.gridCardImage} resizeMode="cover"/>
                      <react_native_1.View style={styles.gridCardOverlay}>
                        <react_native_1.View style={styles.badgeRow}>
                          <react_native_1.View style={styles.ratingBadge}>
                            <react_native_1.Text style={styles.ratingText}>★ {title.rating}</react_native_1.Text>
                          </react_native_1.View>
                          <react_native_1.Text style={styles.yearText}>{title.releaseYear}</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.Text style={styles.gridCardTitle} numberOfLines={1}>
                          {title.title}
                        </react_native_1.Text>
                        <react_native_1.Text style={styles.gridCardGenres} numberOfLines={1}>
                          {title.genres.join(' • ')}
                        </react_native_1.Text>
                      </react_native_1.View>
                    </react_native_1.View>)}
                </react_tv_space_navigation_1.SpatialNavigationFocusableView>))}
            </react_native_1.View>
          </react_tv_space_navigation_1.SpatialNavigationNode>
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
        marginBottom: (0, useScale_1.scaledPixels)(16),
    },
    headerTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(38),
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(18),
        marginTop: (0, useScale_1.scaledPixels)(4),
    },
    filterSection: {
        marginBottom: (0, useScale_1.scaledPixels)(14),
    },
    filterSectionTitle: {
        color: theme_1.colors.textTertiary,
        fontSize: (0, useScale_1.scaledPixels)(13),
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: (0, useScale_1.scaledPixels)(8),
    },
    pillsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    filterPill: {
        backgroundColor: theme_1.colors.card,
        borderRadius: (0, useScale_1.scaledPixels)(20),
        paddingHorizontal: (0, useScale_1.scaledPixels)(18),
        paddingVertical: (0, useScale_1.scaledPixels)(10),
        marginEnd: (0, useScale_1.scaledPixels)(12),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.border,
    },
    filterPillSelected: {
        borderColor: theme_1.colors.primary,
        backgroundColor: 'rgba(229, 169, 60, 0.16)',
    },
    filterPillFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.06 }],
    },
    filterPillText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(16),
        fontWeight: '600',
    },
    filterPillTextSelected: {
        color: theme_1.colors.primaryLight,
        fontWeight: '700',
    },
    filterPillTextFocused: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '700',
    },
    searchPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme_1.colors.backgroundElevated,
        borderRadius: (0, useScale_1.scaledPixels)(16),
        paddingHorizontal: (0, useScale_1.scaledPixels)(14),
        paddingVertical: (0, useScale_1.scaledPixels)(8),
        marginEnd: (0, useScale_1.scaledPixels)(10),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: theme_1.colors.border,
    },
    searchPillSelected: {
        borderColor: theme_1.colors.primaryLight,
        backgroundColor: 'rgba(229, 169, 60, 0.12)',
    },
    searchPillFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.05 }],
    },
    searchPillIcon: {
        fontSize: (0, useScale_1.scaledPixels)(13),
        marginEnd: (0, useScale_1.scaledPixels)(6),
    },
    searchPillText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(14),
        fontWeight: '500',
    },
    searchPillTextSelected: {
        color: theme_1.colors.primaryLight,
        fontWeight: '700',
    },
    searchPillTextFocused: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '700',
    },
    gridScroll: {
        flex: 1,
        marginTop: (0, useScale_1.scaledPixels)(10),
    },
    gridCards: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    gridCard: {
        width: (0, useScale_1.scaledPixels)(340),
        height: (0, useScale_1.scaledPixels)(200),
        borderRadius: (0, useScale_1.scaledPixels)(10),
        overflow: 'hidden',
        backgroundColor: theme_1.colors.card,
        marginEnd: (0, useScale_1.scaledPixels)(24),
        marginBottom: (0, useScale_1.scaledPixels)(24),
        borderWidth: (0, useScale_1.scaledPixels)(3),
        borderColor: 'transparent',
    },
    gridCardFocused: {
        borderColor: theme_1.colors.primary,
        transform: [{ scale: 1.06 }],
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: (0, useScale_1.scaledPixels)(14),
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
        paddingHorizontal: (0, useScale_1.scaledPixels)(14),
        paddingVertical: (0, useScale_1.scaledPixels)(10),
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(4),
    },
    ratingBadge: {
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(6),
        paddingVertical: (0, useScale_1.scaledPixels)(2),
        borderRadius: (0, useScale_1.scaledPixels)(4),
    },
    ratingText: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(12),
        fontWeight: '700',
    },
    yearText: {
        color: theme_1.colors.textTertiary,
        fontSize: (0, useScale_1.scaledPixels)(12),
    },
    gridCardTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(17),
        fontWeight: '700',
    },
    gridCardGenres: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(13),
        marginTop: (0, useScale_1.scaledPixels)(2),
    },
});
