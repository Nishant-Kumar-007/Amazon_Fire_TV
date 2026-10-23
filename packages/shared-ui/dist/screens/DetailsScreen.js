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
exports.default = DetailsScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const useScale_1 = require("../hooks/useScale");
const theme_1 = require("../theme");
const PlatformLinearGradient_1 = __importDefault(require("../components/PlatformLinearGradient"));
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
const StorageService_1 = require("../services/StorageService");
function DetailsScreen() {
    const route = (0, native_1.useRoute)();
    const navigation = (0, native_1.useNavigation)();
    const isFocused = (0, native_1.useIsFocused)();
    const { title, description, movie, headerImage, genres, releaseYear, rating, ratingCount, contentRating, duration, } = route.params;
    // Look up full metadata from catalog
    const catalogEntry = (0, react_1.useMemo)(() => {
        const found = viewEaseCatalog_1.VIEWEASE_CATALOG.find((t) => t.title === title || t.movie === movie);
        return found || (0, viewEaseCatalog_1.getTitleById)('quantum-horizon');
    }, [title, movie]);
    const [inWatchlist, setInWatchlist] = (0, react_1.useState)(() => StorageService_1.StorageService.isInWatchlist(catalogEntry.id));
    (0, react_1.useEffect)(() => {
        setInWatchlist(StorageService_1.StorageService.isInWatchlist(catalogEntry.id));
        const unsubscribe = StorageService_1.StorageService.subscribe(() => {
            setInWatchlist(StorageService_1.StorageService.isInWatchlist(catalogEntry.id));
        });
        return unsubscribe;
    }, [catalogEntry.id]);
    const toggleWatchlist = (0, react_1.useCallback)(() => {
        const nextState = StorageService_1.StorageService.toggleWatchlist(catalogEntry.id);
        setInWatchlist(nextState);
    }, [catalogEntry.id]);
    const navigateToPlayer = (0, react_1.useCallback)((timeSec = 0) => {
        navigation.navigate('Player', {
            movie: catalogEntry.movie || movie,
            headerImage: catalogEntry.headerImage || headerImage,
            title: catalogEntry.title || title,
            id: catalogEntry.id,
        });
    }, [navigation, catalogEntry, movie, headerImage, title]);
    const formattedDuration = (0, react_1.useMemo)(() => {
        const d = duration || catalogEntry.duration;
        if (!d)
            return '2h 8m';
        const mins = Math.floor(d / 60);
        const secs = d % 60;
        return `${mins}m ${secs}s`;
    }, [duration, catalogEntry.duration]);
    const relatedTitles = (0, react_1.useMemo)(() => {
        return viewEaseCatalog_1.VIEWEASE_CATALOG.filter((t) => t.id !== catalogEntry.id).slice(0, 4);
    }, [catalogEntry.id]);
    return (<react_tv_space_navigation_1.SpatialNavigationRoot isActive={isFocused}>
      <react_native_1.View style={styles.container}>
        {/* Background Backdrop Artwork */}
        <react_native_1.Image source={{ uri: catalogEntry.headerImage || headerImage }} style={styles.backgroundImage} resizeMode="cover"/>

        {/* Dual Gradients for Cinematic Readability */}
        <PlatformLinearGradient_1.default colors={['rgba(11,13,17,0.95)', 'rgba(11,13,17,0.85)', 'rgba(11,13,17,0.3)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientLeft}/>
        <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11,13,17,0.8)', theme_1.colors.background]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBottom}/>

        {/* Details Content Container */}
        <react_native_1.ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <react_native_1.View style={styles.contentWrapper}>
            {/* Badges Bar */}
            <react_native_1.View style={styles.badgeRow}>
              <react_native_1.View style={styles.originalBadge}>
                <react_native_1.Text style={styles.originalBadgeText}>VIEWEASE EXCLUSIVE</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.metaBadge}>
                <react_native_1.Text style={styles.metaBadgeText}>{contentRating || catalogEntry.contentRating || 'TV-14'}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.metaBadge}>
                <react_native_1.Text style={styles.metaBadgeText}>{releaseYear || catalogEntry.releaseYear || 2026}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.metaBadge}>
                <react_native_1.Text style={styles.metaBadgeText}>{formattedDuration}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.ratingBadge}>
                <react_native_1.Text style={styles.ratingText}>
                  ★ {(rating || catalogEntry.rating || 4.9).toFixed(1)} ({ratingCount || catalogEntry.ratingCount || 1200})
                </react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.assistPill}>
                <react_native_1.Text style={styles.assistPillIcon}>⚡</react_native_1.Text>
                <react_native_1.Text style={styles.assistPillText}>ASSIST AVAILABLE</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>

            {/* Title & Tagline */}
            <react_native_1.Text style={styles.title}>{title || catalogEntry.title}</react_native_1.Text>
            {catalogEntry.tagline ? (<react_native_1.Text style={styles.tagline}>{catalogEntry.tagline}</react_native_1.Text>) : null}

            {/* Genres */}
            <react_native_1.View style={styles.genresRow}>
              {(genres || catalogEntry.genres || []).map((genre, idx) => (<react_native_1.View key={idx} style={styles.genrePill}>
                  <react_native_1.Text style={styles.genrePillText}>{genre}</react_native_1.Text>
                </react_native_1.View>))}
            </react_native_1.View>

            {/* Synopsis Description */}
            <react_native_1.Text style={styles.synopsis}>
              {description || catalogEntry.description}
            </react_native_1.Text>

            {/* Interactive Action Controls */}
            <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
              <react_native_1.View style={styles.actionsRow}>
                <react_tv_space_navigation_1.DefaultFocus>
                  <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => navigateToPlayer(0)}>
                    {({ isFocused: btnFocused }) => (<react_native_1.View style={[
                styles.actionBtn,
                styles.playBtn,
                btnFocused && styles.actionBtnFocused,
            ]}>
                        <react_native_1.Text style={[
                styles.actionBtnText,
                styles.playBtnText,
                btnFocused && styles.actionBtnTextFocused,
            ]}>
                          ▶ Play Movie
                        </react_native_1.Text>
                      </react_native_1.View>)}
                  </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                </react_tv_space_navigation_1.DefaultFocus>

                <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={toggleWatchlist}>
                  {({ isFocused: btnFocused }) => (<react_native_1.View style={[
                styles.actionBtn,
                styles.watchlistBtn,
                inWatchlist && styles.inWatchlistBtn,
                btnFocused && styles.actionBtnFocused,
            ]}>
                      <react_native_1.Text style={[
                styles.actionBtnText,
                inWatchlist && styles.inWatchlistText,
                btnFocused && styles.actionBtnTextFocused,
            ]}>
                        {inWatchlist ? '✓ In My List' : '➕ Add to My List'}
                      </react_native_1.Text>
                    </react_native_1.View>)}
                </react_tv_space_navigation_1.SpatialNavigationFocusableView>

                <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => navigation.goBack()}>
                  {({ isFocused: btnFocused }) => (<react_native_1.View style={[
                styles.actionBtn,
                styles.backBtn,
                btnFocused && styles.actionBtnFocused,
            ]}>
                      <react_native_1.Text style={[
                styles.actionBtnText,
                btnFocused && styles.actionBtnTextFocused,
            ]}>
                        ← Back
                      </react_native_1.Text>
                    </react_native_1.View>)}
                </react_tv_space_navigation_1.SpatialNavigationFocusableView>
              </react_native_1.View>
            </react_tv_space_navigation_1.SpatialNavigationNode>

            {/* Production & Cast Metadata Panel */}
            <react_native_1.View style={styles.crewCard}>
              <react_native_1.View style={styles.crewColumn}>
                <react_native_1.Text style={styles.crewLabel}>DIRECTOR</react_native_1.Text>
                <react_native_1.Text style={styles.crewValue}>{catalogEntry.director || 'Elena Rostova'}</react_native_1.Text>
              </react_native_1.View>

              <react_native_1.View style={[styles.crewColumn, { flex: 2 }]}>
                <react_native_1.Text style={styles.crewLabel}>STARRING</react_native_1.Text>
                <react_native_1.Text style={styles.crewValue}>
                  {(catalogEntry.cast || ['David Sterling', 'Maya Lin']).join(', ')}
                </react_native_1.Text>
              </react_native_1.View>

              <react_native_1.View style={styles.crewColumn}>
                <react_native_1.Text style={styles.crewLabel}>AUDIO & SUBTITLES</react_native_1.Text>
                <react_native_1.Text style={styles.crewValue}>English (Dolby 5.1), Hindi • English [CC], Hindi</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>

            {/* Related Titles Section */}
            <react_native_1.View style={styles.relatedSection}>
              <react_native_1.Text style={styles.relatedHeading}>MORE LIKE THIS</react_native_1.Text>
              <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
                <react_native_1.View style={styles.relatedGrid}>
                  {relatedTitles.map((item) => (<react_tv_space_navigation_1.SpatialNavigationFocusableView key={item.id} onSelect={() => {
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
            }}>
                      {({ isFocused: cardFocused }) => (<react_native_1.View style={[
                    styles.relatedCard,
                    cardFocused && styles.relatedCardFocused,
                ]}>
                          <react_native_1.Image source={{ uri: item.headerImage }} style={styles.relatedImage} resizeMode="cover"/>
                          <react_native_1.View style={styles.relatedOverlay}>
                            <react_native_1.Text style={styles.relatedTitle} numberOfLines={1}>
                              {item.title}
                            </react_native_1.Text>
                            <react_native_1.Text style={styles.relatedRating}>★ {item.rating}</react_native_1.Text>
                          </react_native_1.View>
                        </react_native_1.View>)}
                    </react_tv_space_navigation_1.SpatialNavigationFocusableView>))}
                </react_native_1.View>
              </react_tv_space_navigation_1.SpatialNavigationNode>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_1.View>
    </react_tv_space_navigation_1.SpatialNavigationRoot>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme_1.colors.background,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '65%',
    },
    gradientLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '75%',
    },
    gradientBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: (0, useScale_1.scaledPixels)(160),
    },
    scrollContent: {
        flex: 1,
    },
    contentWrapper: {
        paddingHorizontal: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
        paddingTop: (0, useScale_1.scaledPixels)(theme_1.safeZones.titleSafe.vertical),
        paddingBottom: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.vertical + 40),
        maxWidth: '65%',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(14),
        flexWrap: 'wrap',
    },
    originalBadge: {
        backgroundColor: theme_1.colors.primary,
        paddingHorizontal: (0, useScale_1.scaledPixels)(10),
        paddingVertical: (0, useScale_1.scaledPixels)(4),
        borderRadius: (0, useScale_1.scaledPixels)(4),
        marginEnd: (0, useScale_1.scaledPixels)(10),
    },
    originalBadgeText: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '800',
        fontSize: (0, useScale_1.scaledPixels)(12),
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
    },
    title: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(52),
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: (0, useScale_1.scaledPixels)(8),
    },
    tagline: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(20),
        fontWeight: '500',
        fontStyle: 'italic',
        marginBottom: (0, useScale_1.scaledPixels)(16),
    },
    genresRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(18),
    },
    genrePill: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(12),
        paddingVertical: (0, useScale_1.scaledPixels)(4),
        borderRadius: (0, useScale_1.scaledPixels)(6),
        marginEnd: (0, useScale_1.scaledPixels)(8),
    },
    genrePillText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(13),
        fontWeight: '600',
    },
    synopsis: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(19),
        lineHeight: (0, useScale_1.scaledPixels)(28),
        marginBottom: (0, useScale_1.scaledPixels)(26),
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(32),
    },
    actionBtn: {
        paddingVertical: (0, useScale_1.scaledPixels)(14),
        paddingHorizontal: (0, useScale_1.scaledPixels)(24),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        marginEnd: (0, useScale_1.scaledPixels)(14),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playBtn: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primary,
    },
    watchlistBtn: {
        backgroundColor: theme_1.colors.cardElevated,
    },
    inWatchlistBtn: {
        borderColor: theme_1.colors.primaryLight,
        backgroundColor: 'rgba(229, 169, 60, 0.15)',
    },
    backBtn: {
        backgroundColor: 'transparent',
        borderColor: theme_1.colors.borderLight,
    },
    actionBtnFocused: {
        backgroundColor: theme_1.colors.primaryLight,
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.06 }],
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: (0, useScale_1.scaledPixels)(12),
        elevation: 8,
    },
    actionBtnText: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(17),
        fontWeight: '700',
    },
    playBtnText: {
        color: theme_1.colors.textOnPrimary,
    },
    inWatchlistText: {
        color: theme_1.colors.primaryLight,
    },
    actionBtnTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    crewCard: {
        backgroundColor: theme_1.colors.card,
        borderRadius: (0, useScale_1.scaledPixels)(12),
        padding: (0, useScale_1.scaledPixels)(18),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: theme_1.colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: (0, useScale_1.scaledPixels)(32),
    },
    crewColumn: {
        flex: 1,
        marginEnd: (0, useScale_1.scaledPixels)(16),
    },
    crewLabel: {
        color: theme_1.colors.textTertiary,
        fontSize: (0, useScale_1.scaledPixels)(12),
        fontWeight: '700',
        letterSpacing: 1.1,
        marginBottom: (0, useScale_1.scaledPixels)(6),
    },
    crewValue: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(15),
        lineHeight: (0, useScale_1.scaledPixels)(22),
        fontWeight: '500',
    },
    relatedSection: {
        marginTop: (0, useScale_1.scaledPixels)(10),
    },
    relatedHeading: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(20),
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: (0, useScale_1.scaledPixels)(14),
    },
    relatedGrid: {
        flexDirection: 'row',
    },
    relatedCard: {
        width: (0, useScale_1.scaledPixels)(240),
        height: (0, useScale_1.scaledPixels)(135),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        overflow: 'hidden',
        backgroundColor: theme_1.colors.card,
        marginEnd: (0, useScale_1.scaledPixels)(16),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: 'transparent',
    },
    relatedCardFocused: {
        borderColor: theme_1.colors.primary,
        transform: [{ scale: 1.06 }],
    },
    relatedImage: {
        width: '100%',
        height: '100%',
    },
    relatedOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(11, 13, 17, 0.9)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(10),
        paddingVertical: (0, useScale_1.scaledPixels)(6),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    relatedTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(13),
        fontWeight: '600',
        flex: 1,
    },
    relatedRating: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(12),
        fontWeight: '700',
        marginStart: (0, useScale_1.scaledPixels)(6),
    },
});
