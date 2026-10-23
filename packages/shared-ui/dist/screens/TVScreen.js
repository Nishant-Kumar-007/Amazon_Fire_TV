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
exports.default = TVScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const theme_1 = require("../theme");
const StorageService_1 = require("../services/StorageService");
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
const TopNavigationBar_1 = require("../components/TopNavigationBar");
const PlatformLinearGradient_1 = __importDefault(require("../components/PlatformLinearGradient"));
function TVScreen() {
    const navigation = (0, native_1.useNavigation)();
    const isFocused = (0, native_1.useIsFocused)();
    const [watchlistIds, setWatchlistIds] = (0, react_1.useState)(() => StorageService_1.StorageService.getWatchlist());
    const [hoveredCardId, setHoveredCardId] = (0, react_1.useState)(null);
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
    return (<react_native_1.View style={styles.rootScreen}>
      {/* 1. Sleek Top Navigation Bar */}
      <TopNavigationBar_1.TopNavigationBar activeTab="TV"/>

      <react_native_1.ScrollView style={styles.mainScrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <react_native_1.View style={styles.headerSection}>
          <react_native_1.Text style={styles.headerTitle}>My Saved Watchlist</react_native_1.Text>
          <react_native_1.Text style={styles.headerSubtitle}>
            Your personalized queue of movies, web series, and anime ({savedTitles.length} saved)
          </react_native_1.Text>
        </react_native_1.View>

        {savedTitles.length === 0 ? (<react_native_1.View style={styles.emptyContainer}>
            <react_native_1.Text style={styles.emptyIcon}>🔖</react_native_1.Text>
            <react_native_1.Text style={styles.emptyTitle}>Your watchlist is empty</react_native_1.Text>
            <react_native_1.Text style={styles.emptySubtitle}>
              Explore our cinematic catalog and click "+ Add to My List" to build your queue.
            </react_native_1.Text>
            <react_native_1.Pressable accessibilityRole="button" onPress={() => navigation.navigate('Home')} style={({ hovered }) => [
                styles.browseBtn,
                hovered && styles.browseBtnHovered,
            ]}>
              <react_native_1.Text style={styles.browseBtnText}>Explore Home Screen</react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>) : (<react_native_1.View style={styles.gridContainer}>
            {savedTitles.map((item) => {
                const isHovered = hoveredCardId === item.id;
                return (<react_native_1.View key={item.id} style={[
                        styles.cardWrapper,
                        isHovered && styles.cardWrapperHovered,
                    ]} 
                // @ts-ignore
                onMouseEnter={() => setHoveredCardId(item.id)} onMouseLeave={() => setHoveredCardId(null)}>
                  <react_native_1.Pressable style={styles.cardPressable} onPress={() => navigateToDetails(item)}>
                    <react_native_1.Image source={{ uri: item.headerImage || item.posterImage }} style={styles.cardImage} resizeMode="cover"/>

                    <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11, 13, 17, 0.95)']} start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} style={styles.cardGradient}/>

                    <react_native_1.View style={styles.cardInfo}>
                      <react_native_1.Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                      </react_native_1.Text>
                      <react_native_1.View style={styles.cardMeta}>
                        <react_native_1.Text style={styles.cardCategory}>{item.category || item.genres[0]}</react_native_1.Text>
                        <react_native_1.Text style={styles.cardRating}>★ {item.rating}</react_native_1.Text>
                      </react_native_1.View>
                    </react_native_1.View>
                  </react_native_1.Pressable>

                  {/* Actions Bar */}
                  <react_native_1.View style={styles.cardActionsRow}>
                    <react_native_1.Pressable accessibilityRole="button" onPress={() => navigateToPlayer(item)} style={({ hovered }) => [
                        styles.playActionBtn,
                        hovered && styles.playActionBtnHovered,
                    ]}>
                      <react_native_1.Text style={styles.playActionText}>▶ Play</react_native_1.Text>
                    </react_native_1.Pressable>

                    <react_native_1.Pressable accessibilityRole="button" onPress={() => handleRemove(item.id)} style={({ hovered }) => [
                        styles.removeActionBtn,
                        hovered && styles.removeActionBtnHovered,
                    ]}>
                      <react_native_1.Text style={styles.removeActionText}>✕ Remove</react_native_1.Text>
                    </react_native_1.Pressable>
                  </react_native_1.View>
                </react_native_1.View>);
            })}
          </react_native_1.View>)}
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
        color: theme_1.colors.text,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: theme_1.colors.textMuted,
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
        ...react_native_1.StyleSheet.absoluteFillObject,
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
        color: theme_1.colors.text,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 3,
    },
    cardCategory: {
        fontSize: 10,
        color: theme_1.colors.textMuted,
        fontWeight: '600',
    },
    cardRating: {
        fontSize: 10,
        color: theme_1.colors.primary,
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
        backgroundColor: theme_1.colors.primary,
    },
    playActionText: {
        fontSize: 12,
        fontWeight: '800',
        color: theme_1.colors.primary,
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
        color: theme_1.colors.textMuted,
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
        color: theme_1.colors.text,
    },
    emptySubtitle: {
        fontSize: 14,
        color: theme_1.colors.textMuted,
        marginTop: 8,
        maxWidth: 450,
        textAlign: 'center',
    },
    browseBtn: {
        marginTop: 24,
        backgroundColor: theme_1.colors.primary,
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
