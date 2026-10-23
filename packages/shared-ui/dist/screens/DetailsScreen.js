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
const theme_1 = require("../theme");
const PlatformLinearGradient_1 = __importDefault(require("../components/PlatformLinearGradient"));
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
const StorageService_1 = require("../services/StorageService");
const TopNavigationBar_1 = require("../components/TopNavigationBar");
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
    const [hoveredRelatedId, setHoveredRelatedId] = (0, react_1.useState)(null);
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
        return viewEaseCatalog_1.VIEWEASE_CATALOG.filter((t) => t.id !== catalogEntry.id).slice(0, 5);
    }, [catalogEntry.id]);
    return (<react_native_1.View style={styles.rootScreen}>
      {/* 1. Sleek Top Navigation Bar */}
      <TopNavigationBar_1.TopNavigationBar />

      <react_native_1.ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
        {/* Backdrop Banner */}
        <react_native_1.View style={styles.backdropContainer}>
          <react_native_1.Image source={{ uri: catalogEntry.headerImage || headerImage }} style={styles.backgroundImage} resizeMode="cover"/>

          <PlatformLinearGradient_1.default colors={['rgba(11,13,17,0.95)', 'rgba(11,13,17,0.85)', 'rgba(11,13,17,0.3)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientLeft}/>
          <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11,13,17,0.8)', '#0B0D11']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.gradientBottom}/>

          {/* Details Content Overlay */}
          <react_native_1.View style={styles.detailsContentWrapper}>
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
            {catalogEntry.tagline ? (<react_native_1.Text style={styles.tagline}>"{catalogEntry.tagline}"</react_native_1.Text>) : null}

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
            <react_native_1.View style={styles.actionsRow}>
              <react_native_1.Pressable accessibilityRole="button" onPress={() => navigateToPlayer(0)} style={({ hovered }) => [
            styles.actionBtn,
            styles.playBtn,
            hovered && styles.playBtnHovered,
        ]}>
                <react_native_1.Text style={styles.playBtnText}>▶ Play Movie</react_native_1.Text>
              </react_native_1.Pressable>

              <react_native_1.Pressable accessibilityRole="button" onPress={toggleWatchlist} style={({ hovered }) => [
            styles.actionBtn,
            styles.watchlistBtn,
            inWatchlist && styles.inWatchlistBtn,
            hovered && styles.secondaryBtnHovered,
        ]}>
                <react_native_1.Text style={[
            styles.secondaryBtnText,
            inWatchlist && styles.inWatchlistText,
        ]}>
                  {inWatchlist ? '✓ In My List' : '➕ Add to My List'}
                </react_native_1.Text>
              </react_native_1.Pressable>

              <react_native_1.Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={({ hovered }) => [
            styles.actionBtn,
            styles.backBtn,
            hovered && styles.secondaryBtnHovered,
        ]}>
                <react_native_1.Text style={styles.secondaryBtnText}>← Back</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

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
          </react_native_1.View>
        </react_native_1.View>

        {/* Related Titles Carousel */}
        <react_native_1.View style={styles.relatedSection}>
          <react_native_1.Text style={styles.relatedHeading}>More Like This</react_native_1.Text>
          <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedRow}>
            {relatedTitles.map((item) => {
            const isHovered = hoveredRelatedId === item.id;
            return (<react_native_1.Pressable key={item.id} accessibilityRole="button" onPress={() => {
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
                }} 
            // @ts-ignore
            onMouseEnter={() => setHoveredRelatedId(item.id)} onMouseLeave={() => setHoveredRelatedId(null)} style={({ pressed }) => [
                    styles.relatedCard,
                    isHovered && styles.relatedCardHovered,
                    pressed && styles.relatedCardPressed,
                ]}>
                  <react_native_1.Image source={{ uri: item.headerImage || item.posterImage }} style={styles.relatedImage} resizeMode="cover"/>
                  <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11, 13, 17, 0.95)']} start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} style={styles.cardGradient}/>
                  <react_native_1.View style={styles.relatedInfo}>
                    <react_native_1.Text style={styles.relatedTitle} numberOfLines={1}>{item.title}</react_native_1.Text>
                    <react_native_1.Text style={styles.relatedMeta}>{item.category} • ★ {item.rating}</react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.Pressable>);
        })}
          </react_native_1.ScrollView>
        </react_native_1.View>
      </react_native_1.ScrollView>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    rootScreen: {
        flex: 1,
        backgroundColor: '#0B0D11',
    },
    mainScrollView: {
        flex: 1,
    },
    backdropContainer: {
        width: '100%',
        minHeight: 560,
        position: 'relative',
        backgroundColor: '#0D0F14',
    },
    backgroundImage: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 0.5,
    },
    gradientLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '75%',
    },
    gradientBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 140,
    },
    detailsContentWrapper: {
        paddingHorizontal: 48,
        paddingTop: 36,
        paddingBottom: 24,
        maxWidth: 820,
        zIndex: 10,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 14,
    },
    originalBadge: {
        backgroundColor: 'rgba(229, 169, 60, 0.25)',
        borderWidth: 1,
        borderColor: theme_1.colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    originalBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: theme_1.colors.primary,
        letterSpacing: 1,
    },
    metaBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    metaBadgeText: {
        fontSize: 11,
        color: theme_1.colors.textMuted,
        fontWeight: '600',
    },
    ratingBadge: {
        backgroundColor: 'rgba(229, 169, 60, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 11,
        color: theme_1.colors.primary,
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
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: theme_1.colors.text,
        lineHeight: 50,
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    tagline: {
        fontSize: 15,
        fontStyle: 'italic',
        color: theme_1.colors.primary,
        marginBottom: 14,
    },
    genresRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    genrePill: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
    },
    genrePillText: {
        fontSize: 11,
        color: theme_1.colors.textMuted,
    },
    synopsis: {
        fontSize: 15,
        lineHeight: 24,
        color: 'rgba(240, 243, 248, 0.9)',
        marginBottom: 24,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 28,
    },
    actionBtn: {
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 8,
        // @ts-ignore
        cursor: 'pointer',
    },
    playBtn: {
        backgroundColor: theme_1.colors.primary,
    },
    playBtnHovered: {
        backgroundColor: '#F5BE58',
        // @ts-ignore
        boxShadow: '0 0 20px rgba(229, 169, 60, 0.7)',
        transform: [{ scale: 1.04 }],
    },
    playBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0B0D11',
    },
    watchlistBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    inWatchlistBtn: {
        backgroundColor: 'rgba(229, 169, 60, 0.2)',
        borderColor: theme_1.colors.primary,
    },
    backBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    secondaryBtnHovered: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.04 }],
    },
    secondaryBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme_1.colors.text,
    },
    inWatchlistText: {
        color: theme_1.colors.primary,
    },
    crewCard: {
        flexDirection: 'row',
        backgroundColor: '#161B22',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 16,
        gap: 20,
    },
    crewColumn: {
        flex: 1,
    },
    crewLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: theme_1.colors.textMuted,
        letterSpacing: 1,
        marginBottom: 4,
    },
    crewValue: {
        fontSize: 12,
        color: theme_1.colors.text,
        lineHeight: 18,
    },
    relatedSection: {
        paddingHorizontal: 48,
        paddingTop: 10,
        paddingBottom: 40,
    },
    relatedHeading: {
        fontSize: 22,
        fontWeight: '800',
        color: theme_1.colors.text,
        marginBottom: 16,
    },
    relatedRow: {
        gap: 16,
    },
    relatedCard: {
        width: 250,
        height: 144,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#161B22',
        borderWidth: 2,
        borderColor: 'transparent',
        // @ts-ignore
        cursor: 'pointer',
    },
    relatedCardHovered: {
        borderWidth: 3,
        borderColor: '#FFFFFF',
        // @ts-ignore
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.55)',
        transform: [{ scale: 1.06 }],
    },
    relatedCardPressed: {
        transform: [{ scale: 1.02 }],
    },
    relatedImage: {
        width: '100%',
        height: '100%',
    },
    cardGradient: {
        ...react_native_1.StyleSheet.absoluteFillObject,
    },
    relatedInfo: {
        position: 'absolute',
        bottom: 8,
        left: 10,
        right: 10,
    },
    relatedTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: theme_1.colors.text,
    },
    relatedMeta: {
        fontSize: 10,
        color: theme_1.colors.textMuted,
        marginTop: 2,
    },
});
