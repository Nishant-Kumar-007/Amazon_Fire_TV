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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const useScale_1 = require("../hooks/useScale");
const moviesData_1 = require("../data/moviesData");
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
const StorageService_1 = require("../services/StorageService");
const theme_1 = require("../theme");
const PlatformLinearGradient_1 = __importDefault(require("../components/PlatformLinearGradient"));
const rtl_1 = require("../utils/rtl");
const MenuContext_1 = require("../components/MenuContext");
// Memoized Movie Card Component with warm amber focus state
const MovieItem = react_1.default.memo(({ item, isFocused, progress, }) => {
    const imageSource = (0, react_1.useMemo)(() => ({ uri: item.headerImage }), [item.headerImage]);
    return (<react_native_1.View style={[styles.cardContainer, isFocused && styles.cardContainerFocused]}>
        <react_native_1.Image source={imageSource} style={styles.cardImage} resizeMode="cover"/>

        {/* Focus Glow Overlay */}
        {isFocused && (<react_native_1.View style={styles.cardFocusedOverlay}>
            <react_native_1.Text style={styles.cardFocusedTitle} numberOfLines={1}>
              {item.title}
            </react_native_1.Text>
            {item.category && (<react_native_1.Text style={styles.cardFocusedCategory}>{item.category}</react_native_1.Text>)}
          </react_native_1.View>)}

        {/* Progress Bar for Continue Watching */}
        {progress && (<react_native_1.View style={styles.progressContainer}>
            <react_native_1.View style={[styles.progressBar, { width: `${progress.percent}%` }]}/>
          </react_native_1.View>)}
      </react_native_1.View>);
});
function HomeScreen() {
    const navigation = (0, native_1.useNavigation)();
    const { isOpen: isMenuOpen, toggleMenu } = (0, MenuContext_1.useMenuContext)();
    const [focusedIndex, setFocusedIndex] = (0, react_1.useState)(0);
    const [allMovies, setAllMovies] = (0, react_1.useState)(viewEaseCatalog_1.VIEWEASE_CATALOG);
    const [continueWatching, setContinueWatching] = (0, react_1.useState)([]);
    const isFocused = (0, native_1.useIsFocused)();
    const isActive = isFocused && !isMenuOpen;
    // Load movies and continue watching on mount & on focus
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const load = async () => {
            try {
                const data = await (0, moviesData_1.fetchMoviesData)();
                if (isMounted)
                    setAllMovies(data);
            }
            catch (err) {
                if (isMounted)
                    setAllMovies(viewEaseCatalog_1.VIEWEASE_CATALOG);
            }
        };
        load();
        const updateContinueWatching = () => {
            setContinueWatching(StorageService_1.StorageService.getContinueWatching());
        };
        updateContinueWatching();
        const unsubscribe = StorageService_1.StorageService.subscribe(updateContinueWatching);
        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [isFocused]);
    const focusedItem = (0, react_1.useMemo)(() => allMovies[focusedIndex] || allMovies[0] || viewEaseCatalog_1.VIEWEASE_CATALOG[0], [focusedIndex, allMovies]);
    const headerImageSource = (0, react_1.useMemo)(() => ({ uri: focusedItem.headerImage }), [focusedItem.headerImage]);
    const onDirectionHandledWithoutMovement = (0, react_1.useCallback)((movement) => {
        if (movement === (0, rtl_1.getOpenDrawerDirection)() && focusedIndex === 0) {
            navigation.dispatch(native_1.DrawerActions.openDrawer());
            toggleMenu(true);
        }
    }, [toggleMenu, focusedIndex, navigation]);
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
    const navigateToPlayer = (0, react_1.useCallback)((item, startTime = 0) => {
        navigation.navigate('Player', {
            movie: item.movie,
            headerImage: item.headerImage,
            title: item.title,
            id: String(item.id),
        });
    }, [navigation]);
    // Rows configuration
    const trendingMovies = (0, react_1.useMemo)(() => allMovies.slice(0, 5), [allMovies]);
    const originalMovies = (0, react_1.useMemo)(() => allMovies.filter((m) => m.category === 'ViewEase Originals' || m.genres?.includes('Sci-Fi')), [allMovies]);
    const documentaries = (0, react_1.useMemo)(() => allMovies.filter((m) => m.category === 'Documentaries' || m.genres?.includes('Nature')), [allMovies]);
    const renderCard = (0, react_1.useCallback)(({ item, index }, progress) => (<react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => {
            if (progress) {
                navigateToPlayer(item, progress.positionSec);
            }
            else {
                navigateToDetails(item);
            }
        }} onFocus={() => setFocusedIndex(index)}>
        {({ isFocused: cardFocused }) => (<MovieItem item={item} isFocused={cardFocused} progress={progress}/>)}
      </react_tv_space_navigation_1.SpatialNavigationFocusableView>), [navigateToDetails, navigateToPlayer]);
    return (<react_tv_space_navigation_1.SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <react_native_1.View style={styles.container}>
        {/* Cinematic Hero Header with Real-Time Backdrop */}
        <react_native_1.View style={styles.header}>
          <react_native_1.Image style={styles.headerImage} source={headerImageSource} resizeMode="cover"/>

          {/* Gradients for text contrast */}
          <PlatformLinearGradient_1.default colors={['rgba(11,13,17,0.95)', 'rgba(11,13,17,0.7)', 'rgba(11,13,17,0.2)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientLeft}/>
          <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11,13,17,0.85)', theme_1.colors.background]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBottom}/>

          {/* Hero Content Information */}
          <react_native_1.View style={styles.headerContent}>
            {/* Badges Row */}
            <react_native_1.View style={styles.badgeRow}>
              <react_native_1.View style={styles.brandBadge}>
                <react_native_1.Text style={styles.brandBadgeText}>VIEWEASE ORIGINAL</react_native_1.Text>
              </react_native_1.View>
              {focusedItem.contentRating && (<react_native_1.View style={styles.metaBadge}>
                  <react_native_1.Text style={styles.metaBadgeText}>{focusedItem.contentRating}</react_native_1.Text>
                </react_native_1.View>)}
              {focusedItem.releaseYear && (<react_native_1.View style={styles.metaBadge}>
                  <react_native_1.Text style={styles.metaBadgeText}>{focusedItem.releaseYear}</react_native_1.Text>
                </react_native_1.View>)}
              {focusedItem.rating && (<react_native_1.View style={styles.ratingBadge}>
                  <react_native_1.Text style={styles.ratingText}>★ {focusedItem.rating}</react_native_1.Text>
                </react_native_1.View>)}
              <react_native_1.View style={styles.assistPill}>
                <react_native_1.Text style={styles.assistPillIcon}>⚡</react_native_1.Text>
                <react_native_1.Text style={styles.assistPillText}>ASSIST ENABLED</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>

            {/* Title & Description */}
            <react_native_1.Text style={styles.heroTitle} numberOfLines={1}>
              {focusedItem.title}
            </react_native_1.Text>
            <react_native_1.Text style={styles.heroDescription} numberOfLines={3}>
              {focusedItem.description}
            </react_native_1.Text>

            {/* Hero CTAs */}
            <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
              <react_native_1.View style={styles.heroActionsRow}>
                <react_tv_space_navigation_1.DefaultFocus>
                  <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => navigateToPlayer(focusedItem)}>
                    {({ isFocused: btnFocused }) => (<react_native_1.View style={[styles.heroBtn, styles.playBtn, btnFocused && styles.heroBtnFocused]}>
                        <react_native_1.Text style={[styles.heroBtnText, styles.playBtnText, btnFocused && styles.heroBtnTextFocused]}>
                          ▶ Play Now
                        </react_native_1.Text>
                      </react_native_1.View>)}
                  </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                </react_tv_space_navigation_1.DefaultFocus>

                <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => navigateToDetails(focusedItem)}>
                  {({ isFocused: btnFocused }) => (<react_native_1.View style={[styles.heroBtn, styles.detailsBtn, btnFocused && styles.heroBtnFocused]}>
                      <react_native_1.Text style={[styles.heroBtnText, btnFocused && styles.heroBtnTextFocused]}>
                        ℹ More Details
                      </react_native_1.Text>
                    </react_native_1.View>)}
                </react_tv_space_navigation_1.SpatialNavigationFocusableView>
              </react_native_1.View>
            </react_tv_space_navigation_1.SpatialNavigationNode>
          </react_native_1.View>
        </react_native_1.View>

        {/* Horizontal Content Rows */}
        <react_tv_space_navigation_1.SpatialNavigationScrollView offsetFromStart={(0, useScale_1.scaledPixels)(40)} style={styles.scrollContent}>
          {/* Continue Watching Row (Dynamically populated) */}
          {continueWatching.length > 0 && (<react_native_1.View style={styles.rowContainer}>
              <react_native_1.View style={styles.rowHeader}>
                <react_native_1.Text style={styles.rowTitle}>Continue Watching</react_native_1.Text>
                <react_native_1.Text style={styles.rowBadge}>Resume from last scene</react_native_1.Text>
              </react_native_1.View>
              <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
                <react_native_1.View style={styles.rowCards}>
                  {continueWatching.map((p, idx) => {
                const title = allMovies.find((m) => String(m.id) === p.id) || viewEaseCatalog_1.VIEWEASE_CATALOG[0];
                return (<react_native_1.View key={p.id} style={{ marginEnd: (0, useScale_1.scaledPixels)(20) }}>
                        {renderCard({ item: title, index: idx }, p)}
                      </react_native_1.View>);
            })}
                </react_native_1.View>
              </react_tv_space_navigation_1.SpatialNavigationNode>
            </react_native_1.View>)}

          {/* Trending Row */}
          <react_native_1.View style={styles.rowContainer}>
            <react_native_1.View style={styles.rowHeader}>
              <react_native_1.Text style={styles.rowTitle}>Trending Now</react_native_1.Text>
              <react_native_1.Text style={styles.rowBadge}>Top picks today</react_native_1.Text>
            </react_native_1.View>
            <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
              <react_native_1.View style={styles.rowCards}>
                {trendingMovies.map((item, idx) => (<react_native_1.View key={String(item.id)} style={{ marginEnd: (0, useScale_1.scaledPixels)(20) }}>
                    {renderCard({ item, index: idx })}
                  </react_native_1.View>))}
              </react_native_1.View>
            </react_tv_space_navigation_1.SpatialNavigationNode>
          </react_native_1.View>

          {/* ViewEase Originals Row */}
          <react_native_1.View style={styles.rowContainer}>
            <react_native_1.View style={styles.rowHeader}>
              <react_native_1.Text style={styles.rowTitle}>ViewEase Originals</react_native_1.Text>
              <react_native_1.Text style={styles.rowBadge}>Contextual viewing enabled</react_native_1.Text>
            </react_native_1.View>
            <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
              <react_native_1.View style={styles.rowCards}>
                {originalMovies.map((item, idx) => (<react_native_1.View key={String(item.id)} style={{ marginEnd: (0, useScale_1.scaledPixels)(20) }}>
                    {renderCard({ item, index: idx })}
                  </react_native_1.View>))}
              </react_native_1.View>
            </react_tv_space_navigation_1.SpatialNavigationNode>
          </react_native_1.View>

          {/* Documentaries Row */}
          <react_native_1.View style={styles.rowContainer}>
            <react_native_1.View style={styles.rowHeader}>
              <react_native_1.Text style={styles.rowTitle}>Nature & Science</react_native_1.Text>
              <react_native_1.Text style={styles.rowBadge}>4K Ultra HD</react_native_1.Text>
            </react_native_1.View>
            <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
              <react_native_1.View style={styles.rowCards}>
                {documentaries.map((item, idx) => (<react_native_1.View key={String(item.id)} style={{ marginEnd: (0, useScale_1.scaledPixels)(20) }}>
                    {renderCard({ item, index: idx })}
                  </react_native_1.View>))}
              </react_native_1.View>
            </react_tv_space_navigation_1.SpatialNavigationNode>
          </react_native_1.View>
        </react_tv_space_navigation_1.SpatialNavigationScrollView>
      </react_native_1.View>
    </react_tv_space_navigation_1.SpatialNavigationRoot>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme_1.colors.background,
    },
    header: {
        height: (0, useScale_1.scaledPixels)(500),
        width: '100%',
        position: 'relative',
        justifyContent: 'flex-end',
    },
    headerImage: {
        ...react_native_1.StyleSheet.absoluteFillObject,
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
        height: (0, useScale_1.scaledPixels)(180),
    },
    headerContent: {
        paddingHorizontal: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
        paddingBottom: (0, useScale_1.scaledPixels)(28),
        maxWidth: '65%',
        zIndex: 10,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(12),
        flexWrap: 'wrap',
    },
    brandBadge: {
        backgroundColor: theme_1.colors.primary,
        paddingHorizontal: (0, useScale_1.scaledPixels)(10),
        paddingVertical: (0, useScale_1.scaledPixels)(4),
        borderRadius: (0, useScale_1.scaledPixels)(4),
        marginEnd: (0, useScale_1.scaledPixels)(10),
    },
    brandBadgeText: {
        color: theme_1.colors.textOnPrimary,
        fontSize: (0, useScale_1.scaledPixels)(12),
        fontWeight: '800',
        letterSpacing: 1,
    },
    metaBadge: {
        backgroundColor: theme_1.colors.cardElevated,
        paddingHorizontal: (0, useScale_1.scaledPixels)(10),
        paddingVertical: (0, useScale_1.scaledPixels)(4),
        borderRadius: (0, useScale_1.scaledPixels)(4),
        marginEnd: (0, useScale_1.scaledPixels)(10),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: theme_1.colors.border,
    },
    metaBadgeText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(13),
        fontWeight: '600',
    },
    ratingBadge: {
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(10),
        paddingVertical: (0, useScale_1.scaledPixels)(4),
        borderRadius: (0, useScale_1.scaledPixels)(4),
        marginEnd: (0, useScale_1.scaledPixels)(10),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: theme_1.colors.badgeBorder,
    },
    ratingText: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(13),
        fontWeight: '700',
    },
    assistPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 199, 89, 0.15)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(10),
        paddingVertical: (0, useScale_1.scaledPixels)(4),
        borderRadius: (0, useScale_1.scaledPixels)(4),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: 'rgba(52, 199, 89, 0.4)',
    },
    assistPillIcon: {
        fontSize: (0, useScale_1.scaledPixels)(12),
        marginEnd: (0, useScale_1.scaledPixels)(4),
    },
    assistPillText: {
        color: theme_1.colors.success,
        fontSize: (0, useScale_1.scaledPixels)(12),
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    heroTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(44),
        fontWeight: '800',
        marginBottom: (0, useScale_1.scaledPixels)(10),
        letterSpacing: 0.5,
    },
    heroDescription: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(18),
        lineHeight: (0, useScale_1.scaledPixels)(26),
        marginBottom: (0, useScale_1.scaledPixels)(20),
    },
    heroActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroBtn: {
        paddingVertical: (0, useScale_1.scaledPixels)(12),
        paddingHorizontal: (0, useScale_1.scaledPixels)(26),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        marginEnd: (0, useScale_1.scaledPixels)(16),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playBtn: {
        backgroundColor: theme_1.colors.primary,
    },
    detailsBtn: {
        backgroundColor: theme_1.colors.cardElevated,
        borderColor: theme_1.colors.border,
    },
    heroBtnFocused: {
        backgroundColor: theme_1.colors.primaryLight,
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.06 }],
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: (0, useScale_1.scaledPixels)(12),
        elevation: 8,
    },
    heroBtnText: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(18),
        fontWeight: '700',
    },
    playBtnText: {
        color: theme_1.colors.textOnPrimary,
    },
    heroBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    scrollContent: {
        flex: 1,
        paddingTop: (0, useScale_1.scaledPixels)(10),
    },
    rowContainer: {
        marginBottom: (0, useScale_1.scaledPixels)(32),
        paddingHorizontal: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
    },
    rowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(14),
    },
    rowTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(24),
        fontWeight: '700',
        letterSpacing: 0.5,
        marginEnd: (0, useScale_1.scaledPixels)(12),
    },
    rowBadge: {
        color: theme_1.colors.textTertiary,
        fontSize: (0, useScale_1.scaledPixels)(14),
        fontWeight: '500',
    },
    rowCards: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContainer: {
        width: (0, useScale_1.scaledPixels)(320),
        height: (0, useScale_1.scaledPixels)(180),
        borderRadius: (0, useScale_1.scaledPixels)(10),
        overflow: 'hidden',
        backgroundColor: theme_1.colors.card,
        borderWidth: (0, useScale_1.scaledPixels)(3),
        borderColor: 'transparent',
    },
    cardContainerFocused: {
        borderColor: theme_1.colors.primary,
        transform: [{ scale: 1.06 }],
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: (0, useScale_1.scaledPixels)(14),
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
        paddingHorizontal: (0, useScale_1.scaledPixels)(12),
        paddingVertical: (0, useScale_1.scaledPixels)(8),
    },
    cardFocusedTitle: {
        color: theme_1.colors.text,
        fontWeight: '700',
        fontSize: (0, useScale_1.scaledPixels)(15),
    },
    cardFocusedCategory: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(12),
        fontWeight: '600',
        marginTop: (0, useScale_1.scaledPixels)(2),
    },
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: (0, useScale_1.scaledPixels)(5),
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme_1.colors.primary,
    },
});
