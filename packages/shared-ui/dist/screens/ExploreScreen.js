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
exports.default = ExploreScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
const theme_1 = require("../theme");
const TopNavigationBar_1 = require("../components/TopNavigationBar");
const PlatformLinearGradient_1 = __importDefault(require("../components/PlatformLinearGradient"));
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
function ExploreScreen() {
    const navigation = (0, native_1.useNavigation)();
    const [selectedGenre, setSelectedGenre] = (0, react_1.useState)('All');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [hoveredCardId, setHoveredCardId] = (0, react_1.useState)(null);
    const filteredTitles = (0, react_1.useMemo)(() => {
        return viewEaseCatalog_1.VIEWEASE_CATALOG.filter((item) => {
            const matchesGenre = selectedGenre === 'All' ||
                item.category === selectedGenre ||
                item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch = !q ||
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.genres.some((g) => g.toLowerCase().includes(q)) ||
                (item.cast && item.cast.some((c) => c.toLowerCase().includes(q)));
            return matchesGenre && matchesSearch;
        });
    }, [selectedGenre, searchQuery]);
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
    return (<react_native_1.View style={styles.rootScreen}>
      {/* 1. Sleek Top Navigation Bar */}
      <TopNavigationBar_1.TopNavigationBar activeTab="Explore" onSelectCategory={(cat) => {
            if (cat === 'All')
                setSelectedGenre('All');
            else
                setSelectedGenre(cat);
        }}/>

      <react_native_1.ScrollView style={styles.mainScrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header & Search Bar */}
        <react_native_1.View style={styles.headerSection}>
          <react_native_1.Text style={styles.headerTitle}>Explore & Search Library</react_native_1.Text>
          <react_native_1.Text style={styles.headerSubtitle}>
            Browse {filteredTitles.length} titles across Web Series, Blockbusters, Anime & Documentaries
          </react_native_1.Text>

          {/* Search Box */}
          <react_native_1.View style={styles.searchBarWrapper}>
            <react_native_1.Text style={styles.searchIcon}>🔍</react_native_1.Text>
            <react_native_1.TextInput style={styles.searchInput} placeholder="Search by title, genre, director or actor..." placeholderTextColor="rgba(240, 243, 248, 0.45)" value={searchQuery} onChangeText={setSearchQuery}/>
            {searchQuery.length > 0 && (<react_native_1.Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <react_native_1.Text style={styles.clearSearchText}>✕</react_native_1.Text>
              </react_native_1.Pressable>)}
          </react_native_1.View>
        </react_native_1.View>

        {/* Category Filter Pills */}
        <react_native_1.View style={styles.filterSection}>
          <react_native_1.Text style={styles.filterSectionTitle}>BROWSE CATEGORIES</react_native_1.Text>
          <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
            {GENRES.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (<react_native_1.Pressable key={genre} accessibilityRole="button" onPress={() => setSelectedGenre(genre)} style={({ hovered }) => [
                    styles.filterPill,
                    isSelected && styles.filterPillSelected,
                    hovered && styles.filterPillHovered,
                ]}>
                  <react_native_1.Text style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextSelected,
                ]}>
                    {genre}
                  </react_native_1.Text>
                </react_native_1.Pressable>);
        })}
          </react_native_1.ScrollView>
        </react_native_1.View>

        {/* Quick Keyword Pills */}
        <react_native_1.View style={styles.filterSection}>
          <react_native_1.Text style={styles.filterSectionTitle}>QUICK SEARCH TAGS</react_native_1.Text>
          <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
            {SEARCH_PRESETS.map((preset) => {
            const isSelected = preset === 'All Titles' ? searchQuery === '' : searchQuery === preset;
            return (<react_native_1.Pressable key={preset} accessibilityRole="button" onPress={() => setSearchQuery(preset === 'All Titles' ? '' : preset)} style={({ hovered }) => [
                    styles.searchPresetPill,
                    isSelected && styles.searchPresetPillSelected,
                    hovered && styles.searchPresetPillHovered,
                ]}>
                  <react_native_1.Text style={[
                    styles.searchPresetText,
                    isSelected && styles.searchPresetTextSelected,
                ]}>
                    #{preset}
                  </react_native_1.Text>
                </react_native_1.Pressable>);
        })}
          </react_native_1.ScrollView>
        </react_native_1.View>

        {/* Responsive Grid of Cards */}
        <react_native_1.View style={styles.gridContainer}>
          {filteredTitles.map((item) => {
            const isHovered = hoveredCardId === item.id;
            return (<react_native_1.Pressable key={item.id} accessibilityRole="button" onPress={() => handleSelectTitle(item)} 
            // @ts-ignore
            onMouseEnter={() => setHoveredCardId(item.id)} onMouseLeave={() => setHoveredCardId(null)} style={({ pressed }) => [
                    styles.gridCard,
                    isHovered && styles.gridCardHighlighted,
                    pressed && styles.gridCardPressed,
                ]}>
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

                {/* White Boundary overlay when hovered/focused */}
                {isHovered && (<react_native_1.View style={styles.hoverOverlay}>
                    <react_native_1.View style={styles.playBadge}>
                      <react_native_1.Text style={styles.playBadgeText}>▶ DETAILS</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>)}
              </react_native_1.Pressable>);
        })}
        </react_native_1.View>

        {filteredTitles.length === 0 && (<react_native_1.View style={styles.emptyState}>
            <react_native_1.Text style={styles.emptyIcon}>🔍</react_native_1.Text>
            <react_native_1.Text style={styles.emptyTitle}>No matching titles found</react_native_1.Text>
            <react_native_1.Text style={styles.emptyText}>
              Try searching for "Quantum", "Kyoto", "RoboBunny", or reset filters.
            </react_native_1.Text>
            <react_native_1.Pressable onPress={() => {
                setSelectedGenre('All');
                setSearchQuery('');
            }} style={styles.resetBtn}>
              <react_native_1.Text style={styles.resetBtnText}>Reset All Filters</react_native_1.Text>
            </react_native_1.Pressable>
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
        paddingBottom: 20,
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
        color: theme_1.colors.text,
        fontSize: 15,
        outlineStyle: 'none',
    },
    clearSearchBtn: {
        padding: 6,
        // @ts-ignore
        cursor: 'pointer',
    },
    clearSearchText: {
        color: theme_1.colors.textMuted,
        fontSize: 14,
    },
    filterSection: {
        paddingHorizontal: 48,
        marginBottom: 16,
    },
    filterSectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: theme_1.colors.textMuted,
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
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primary,
    },
    filterPillHovered: {
        borderColor: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    filterPillText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme_1.colors.textMuted,
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
        borderColor: theme_1.colors.primary,
        backgroundColor: 'rgba(229, 169, 60, 0.15)',
    },
    searchPresetPillHovered: {
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    searchPresetText: {
        fontSize: 12,
        color: theme_1.colors.textMuted,
        fontWeight: '500',
    },
    searchPresetTextSelected: {
        color: theme_1.colors.primary,
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
    hoverOverlay: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBadge: {
        backgroundColor: theme_1.colors.primary,
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
        color: theme_1.colors.text,
    },
    emptyText: {
        fontSize: 13,
        color: theme_1.colors.textMuted,
        marginTop: 6,
    },
    resetBtn: {
        marginTop: 18,
        backgroundColor: theme_1.colors.primary,
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
