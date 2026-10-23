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
exports.default = TVScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const useScale_1 = require("../hooks/useScale");
const MenuContext_1 = require("../components/MenuContext");
const theme_1 = require("../theme");
const rtl_1 = require("../utils/rtl");
const StorageService_1 = require("../services/StorageService");
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
function TVScreen() {
    const navigation = (0, native_1.useNavigation)();
    const { isOpen: isMenuOpen, toggleMenu } = (0, MenuContext_1.useMenuContext)();
    const isFocused = (0, native_1.useIsFocused)();
    const isActive = isFocused && !isMenuOpen;
    const [watchlistIds, setWatchlistIds] = (0, react_1.useState)(() => StorageService_1.StorageService.getWatchlist());
    (0, react_1.useEffect)(() => {
        const update = () => setWatchlistIds(StorageService_1.StorageService.getWatchlist());
        update();
        const unsub = StorageService_1.StorageService.subscribe(update);
        return unsub;
    }, [isFocused]);
    const savedTitles = (0, react_1.useMemo)(() => {
        return watchlistIds
            .map((id) => viewEaseCatalog_1.VIEWEASE_CATALOG.find((t) => t.id === id))
            .filter((t) => !!t);
    }, [watchlistIds]);
    const onDirectionHandledWithoutMovement = (0, react_1.useCallback)((movement) => {
        if (movement === (0, rtl_1.getOpenDrawerDirection)()) {
            navigation.dispatch(native_1.DrawerActions.openDrawer());
            toggleMenu(true);
        }
    }, [toggleMenu, navigation]);
    const navigateToDetails = (0, react_1.useCallback)((item) => {
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
    const navigateToPlayer = (0, react_1.useCallback)((item) => {
        navigation.navigate('Player', {
            movie: item.movie,
            headerImage: item.headerImage,
            title: item.title,
            id: item.id,
        });
    }, [navigation]);
    const handleRemove = (0, react_1.useCallback)((id) => {
        StorageService_1.StorageService.toggleWatchlist(id);
    }, []);
    return (<react_tv_space_navigation_1.SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <react_native_1.View style={styles.container}>
        {/* Header */}
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.headerTitle}>My List & Saved Watchlist</react_native_1.Text>
          <react_native_1.Text style={styles.headerSubtitle}>
            Your personalized queue of movies, series, and contextual documentaries ({savedTitles.length} items)
          </react_native_1.Text>
        </react_native_1.View>

        {savedTitles.length === 0 ? (<react_native_1.View style={styles.emptyContainer}>
            <react_native_1.Text style={styles.emptyIcon}>🎬</react_native_1.Text>
            <react_native_1.Text style={styles.emptyTitle}>Your Watchlist is Empty</react_native_1.Text>
            <react_native_1.Text style={styles.emptySubtitle}>
              Explore our cinematic library and press "Add to My List" on any title.
            </react_native_1.Text>
            <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
              <react_tv_space_navigation_1.DefaultFocus>
                <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => navigation.navigate('Home')}>
                  {({ isFocused: btnFocused }) => (<react_native_1.View style={[styles.exploreBtn, btnFocused && styles.exploreBtnFocused]}>
                      <react_native_1.Text style={[styles.exploreBtnText, btnFocused && styles.exploreBtnTextFocused]}>
                        Browse Featured Titles
                      </react_native_1.Text>
                    </react_native_1.View>)}
                </react_tv_space_navigation_1.SpatialNavigationFocusableView>
              </react_tv_space_navigation_1.DefaultFocus>
            </react_tv_space_navigation_1.SpatialNavigationNode>
          </react_native_1.View>) : (<react_native_1.ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <react_tv_space_navigation_1.SpatialNavigationNode orientation="vertical">
              <react_native_1.View style={styles.cardList}>
                {savedTitles.map((title, idx) => (<react_native_1.View key={title.id} style={styles.savedCardRow}>
                    <react_native_1.Image source={{ uri: title.headerImage }} style={styles.cardThumb} resizeMode="cover"/>
                    <react_native_1.View style={styles.cardMeta}>
                      <react_native_1.View style={styles.cardMetaHeader}>
                        <react_native_1.Text style={styles.cardTitle}>{title.title}</react_native_1.Text>
                        <react_native_1.View style={styles.ratingBadge}>
                          <react_native_1.Text style={styles.ratingText}>★ {title.rating}</react_native_1.Text>
                        </react_native_1.View>
                      </react_native_1.View>
                      <react_native_1.Text style={styles.cardGenres}>
                        {title.releaseYear} • {title.contentRating} • {title.genres.join(', ')}
                      </react_native_1.Text>
                      <react_native_1.Text style={styles.cardDescription} numberOfLines={2}>
                        {title.description}
                      </react_native_1.Text>
                    </react_native_1.View>

                    {/* Actions */}
                    <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
                      <react_native_1.View style={styles.cardActions}>
                        {idx === 0 ? (<react_tv_space_navigation_1.DefaultFocus>
                            <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => navigateToPlayer(title)}>
                              {({ isFocused: btnFocused }) => (<react_native_1.View style={[styles.playBtn, btnFocused && styles.btnFocused]}>
                                  <react_native_1.Text style={[styles.playBtnText, btnFocused && styles.playBtnTextFocused]}>
                                    ▶ Play
                                  </react_native_1.Text>
                                </react_native_1.View>)}
                            </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                          </react_tv_space_navigation_1.DefaultFocus>) : (<react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => navigateToPlayer(title)}>
                            {({ isFocused: btnFocused }) => (<react_native_1.View style={[styles.playBtn, btnFocused && styles.btnFocused]}>
                                <react_native_1.Text style={[styles.playBtnText, btnFocused && styles.playBtnTextFocused]}>
                                  ▶ Play
                                </react_native_1.Text>
                              </react_native_1.View>)}
                          </react_tv_space_navigation_1.SpatialNavigationFocusableView>)}

                        <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => navigateToDetails(title)}>
                          {({ isFocused: btnFocused }) => (<react_native_1.View style={[styles.infoBtn, btnFocused && styles.btnFocused]}>
                              <react_native_1.Text style={[styles.infoBtnText, btnFocused && styles.infoBtnTextFocused]}>
                                ℹ Details
                              </react_native_1.Text>
                            </react_native_1.View>)}
                        </react_tv_space_navigation_1.SpatialNavigationFocusableView>

                        <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => handleRemove(title.id)}>
                          {({ isFocused: btnFocused }) => (<react_native_1.View style={[styles.removeBtn, btnFocused && styles.btnFocused]}>
                              <react_native_1.Text style={[styles.removeBtnText, btnFocused && styles.removeBtnTextFocused]}>
                                ✕ Remove
                              </react_native_1.Text>
                            </react_native_1.View>)}
                        </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                      </react_native_1.View>
                    </react_tv_space_navigation_1.SpatialNavigationNode>
                  </react_native_1.View>))}
              </react_native_1.View>
            </react_tv_space_navigation_1.SpatialNavigationNode>
          </react_native_1.ScrollView>)}
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
        marginBottom: (0, useScale_1.scaledPixels)(24),
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
    scrollContent: {
        flex: 1,
    },
    cardList: {
        paddingBottom: (0, useScale_1.scaledPixels)(30),
    },
    savedCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme_1.colors.card,
        borderRadius: (0, useScale_1.scaledPixels)(12),
        padding: (0, useScale_1.scaledPixels)(16),
        marginBottom: (0, useScale_1.scaledPixels)(16),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: theme_1.colors.border,
    },
    cardThumb: {
        width: (0, useScale_1.scaledPixels)(220),
        height: (0, useScale_1.scaledPixels)(124),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        backgroundColor: theme_1.colors.cardElevated,
    },
    cardMeta: {
        flex: 1,
        marginHorizontal: (0, useScale_1.scaledPixels)(20),
    },
    cardMetaHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(22),
        fontWeight: '700',
        marginBottom: (0, useScale_1.scaledPixels)(4),
    },
    ratingBadge: {
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(8),
        paddingVertical: (0, useScale_1.scaledPixels)(2),
        borderRadius: (0, useScale_1.scaledPixels)(4),
    },
    ratingText: {
        color: theme_1.colors.primaryLight,
        fontWeight: '700',
        fontSize: (0, useScale_1.scaledPixels)(13),
    },
    cardGenres: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(14),
        fontWeight: '600',
        marginBottom: (0, useScale_1.scaledPixels)(6),
    },
    cardDescription: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(15),
        lineHeight: (0, useScale_1.scaledPixels)(22),
    },
    cardActions: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: (0, useScale_1.scaledPixels)(130),
    },
    playBtn: {
        backgroundColor: theme_1.colors.primary,
        borderRadius: (0, useScale_1.scaledPixels)(6),
        paddingVertical: (0, useScale_1.scaledPixels)(8),
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.primary,
    },
    infoBtn: {
        backgroundColor: theme_1.colors.cardElevated,
        borderRadius: (0, useScale_1.scaledPixels)(6),
        paddingVertical: (0, useScale_1.scaledPixels)(8),
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.border,
    },
    removeBtn: {
        backgroundColor: 'transparent',
        borderRadius: (0, useScale_1.scaledPixels)(6),
        paddingVertical: (0, useScale_1.scaledPixels)(8),
        alignItems: 'center',
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.borderLight,
    },
    btnFocused: {
        backgroundColor: theme_1.colors.primaryLight,
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.06 }],
    },
    playBtnText: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '700',
        fontSize: (0, useScale_1.scaledPixels)(14),
    },
    playBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    infoBtnText: {
        color: theme_1.colors.text,
        fontWeight: '600',
        fontSize: (0, useScale_1.scaledPixels)(14),
    },
    infoBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    removeBtnText: {
        color: theme_1.colors.textTertiary,
        fontWeight: '600',
        fontSize: (0, useScale_1.scaledPixels)(13),
    },
    removeBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: (0, useScale_1.scaledPixels)(60),
    },
    emptyIcon: {
        fontSize: (0, useScale_1.scaledPixels)(64),
        marginBottom: (0, useScale_1.scaledPixels)(16),
    },
    emptyTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(28),
        fontWeight: '700',
        marginBottom: (0, useScale_1.scaledPixels)(8),
    },
    emptySubtitle: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(18),
        marginBottom: (0, useScale_1.scaledPixels)(24),
    },
    exploreBtn: {
        backgroundColor: theme_1.colors.primary,
        paddingHorizontal: (0, useScale_1.scaledPixels)(28),
        paddingVertical: (0, useScale_1.scaledPixels)(14),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.primary,
    },
    exploreBtnFocused: {
        backgroundColor: theme_1.colors.primaryLight,
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.05 }],
    },
    exploreBtnText: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '700',
        fontSize: (0, useScale_1.scaledPixels)(18),
    },
    exploreBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
});
