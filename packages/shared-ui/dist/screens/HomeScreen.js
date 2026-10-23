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
const viewEaseCatalog_1 = require("../data/viewEaseCatalog");
const StorageService_1 = require("../services/StorageService");
const theme_1 = require("../theme");
const PlatformLinearGradient_1 = __importDefault(require("../components/PlatformLinearGradient"));
const TopNavigationBar_1 = require("../components/TopNavigationBar");
const MovieCard = ({ item, isFocused = false, progress, onPress, onFocus, onHoverChange, }) => {
    const [isHovered, setIsHovered] = (0, react_1.useState)(false);
    const activeHighlight = isFocused || isHovered;
    return (<react_native_1.Pressable accessibilityRole="button" accessibilityLabel={`Watch ${item.title}`} onPress={onPress} 
    // @ts-ignore - web hover events
    onMouseEnter={() => {
            setIsHovered(true);
            if (onHoverChange)
                onHoverChange(true);
            if (onFocus)
                onFocus();
        }} onMouseLeave={() => {
            setIsHovered(false);
            if (onHoverChange)
                onHoverChange(false);
        }} style={({ pressed }) => [
            styles.cardContainer,
            activeHighlight && styles.cardContainerHighlighted,
            pressed && styles.cardContainerPressed,
        ]}>
      <react_native_1.Image source={{ uri: item.headerImage || item.posterImage }} style={styles.cardImage} resizeMode="cover"/>

      {/* Subtle bottom gradient for card legibility */}
      <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11, 13, 17, 0.92)']} start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} style={styles.cardGradient}/>

      {/* Card Info Overlay */}
      <react_native_1.View style={styles.cardInfoContainer}>
        <react_native_1.Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </react_native_1.Text>
        <react_native_1.View style={styles.cardMetaRow}>
          {item.category && (<react_native_1.Text style={styles.cardCategory} numberOfLines={1}>
              {item.category}
            </react_native_1.Text>)}
          {item.rating && (<react_native_1.Text style={styles.cardRating}>★ {item.rating}</react_native_1.Text>)}
        </react_native_1.View>
      </react_native_1.View>

      {/* White / Glow Boundary on Focus or Mouse Hover */}
      {activeHighlight && (<react_native_1.View style={styles.whiteBoundaryGlow}>
          <react_native_1.View style={styles.playBadgeFloating}>
            <react_native_1.Text style={styles.playBadgeText}>▶ PLAY</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>)}

      {/* Continue Watching Progress Bar */}
      {progress && (<react_native_1.View style={styles.progressContainer}>
          <react_native_1.View style={[styles.progressBar, { width: `${progress.percent}%` }]}/>
        </react_native_1.View>)}
    </react_native_1.Pressable>);
};
function HomeScreen() {
    const navigation = (0, native_1.useNavigation)();
    const isFocused = (0, native_1.useIsFocused)();
    // Catalog and user state
    const [allMovies, setAllMovies] = (0, react_1.useState)(viewEaseCatalog_1.VIEWEASE_CATALOG);
    const [continueWatching, setContinueWatching] = (0, react_1.useState)([]);
    const [activeCategoryFilter, setActiveCategoryFilter] = (0, react_1.useState)('Home');
    const mainScrollViewRef = (0, react_1.useRef)(null);
    // Hero carousel state
    const [heroIndex, setHeroIndex] = (0, react_1.useState)(0);
    const [isHeroHovered, setIsHeroHovered] = (0, react_1.useState)(false);
    const [isAnyCardHovered, setIsAnyCardHovered] = (0, react_1.useState)(false);
    // Category "View All" modal state
    const [viewAllModalVisible, setViewAllModalVisible] = (0, react_1.useState)(false);
    const [viewAllCategoryName, setViewAllCategoryName] = (0, react_1.useState)('');
    const [viewAllMovies, setViewAllMovies] = (0, react_1.useState)([]);
    // Dynamic Hero Titles based on the active tab
    const heroFeaturedTitles = (0, react_1.useMemo)(() => {
        if (activeCategoryFilter === 'All' || activeCategoryFilter === 'Home') {
            return allMovies.slice(0, 8);
        }
        if (activeCategoryFilter === 'Movies') {
            const movies = allMovies.filter((m) => m.category === 'Movies' ||
                m.category === 'ViewEase Originals' ||
                m.category === 'Featured' ||
                m.genres?.includes('Movies') ||
                m.genres?.includes('Action') ||
                m.genres?.includes('Thriller') ||
                m.genres?.includes('Drama'));
            return movies.length > 0 ? movies : allMovies.slice(0, 5);
        }
        if (activeCategoryFilter === 'Web Series') {
            const series = allMovies.filter((m) => m.category === 'Web Series' || m.genres?.includes('Web Series'));
            return series.length > 0 ? series : allMovies.slice(0, 4);
        }
        if (activeCategoryFilter === 'Cartoons & Animation' || activeCategoryFilter === 'Cartoons') {
            const cartoons = allMovies.filter((m) => m.category === 'Cartoons & Animation' ||
                m.category.includes('Cartoon') ||
                m.genres?.includes('Animation') ||
                m.genres?.includes('Anime'));
            return cartoons.length > 0 ? cartoons : allMovies.slice(0, 4);
        }
        if (activeCategoryFilter === 'Documentaries') {
            const docs = allMovies.filter((m) => m.category === 'Documentaries' ||
                m.genres?.includes('Documentary') ||
                m.genres?.includes('Nature') ||
                m.genres?.includes('Science') ||
                m.genres?.includes('Space'));
            return docs.length > 0 ? docs : allMovies.slice(0, 4);
        }
        return allMovies.slice(0, 8);
    }, [allMovies, activeCategoryFilter]);
    const activeHeroTitle = (0, react_1.useMemo)(() => {
        return heroFeaturedTitles[heroIndex] || heroFeaturedTitles[0] || viewEaseCatalog_1.VIEWEASE_CATALOG[0];
    }, [heroFeaturedTitles, heroIndex]);
    // Reset carousel index and scroll to top immediately when user switches tabs
    (0, react_1.useEffect)(() => {
        setHeroIndex(0);
        mainScrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, [activeCategoryFilter]);
    // Auto-advance hero showcase every 5 seconds (unless hovered/interacting with hero or any card)
    (0, react_1.useEffect)(() => {
        if (isHeroHovered || isAnyCardHovered)
            return;
        const interval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroFeaturedTitles.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroFeaturedTitles.length, isHeroHovered, isAnyCardHovered]);
    // Load Continue Watching on mount and focus
    (0, react_1.useEffect)(() => {
        const updateContinueWatching = () => {
            setContinueWatching(StorageService_1.StorageService.getContinueWatching());
        };
        updateContinueWatching();
        const unsubscribe = StorageService_1.StorageService.subscribe(updateContinueWatching);
        return () => {
            unsubscribe();
        };
    }, [isFocused]);
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
            startTime,
        });
    }, [navigation]);
    // Subcategory filters for Movies section
    const moviesTrending = (0, react_1.useMemo)(() => allMovies.filter((m) => m.category === 'Movies' ||
        m.category === 'Featured' ||
        m.category === 'ViewEase Originals' ||
        m.genres?.includes('Movies')), [allMovies]);
    const moviesSciFiAction = (0, react_1.useMemo)(() => moviesTrending.filter((m) => m.genres?.includes('Sci-Fi') ||
        m.genres?.includes('Action') ||
        m.genres?.includes('Thriller')), [moviesTrending]);
    const moviesTopRated = (0, react_1.useMemo)(() => moviesTrending.filter((m) => (m.rating || 0) >= 4.8), [moviesTrending]);
    const moviesOriginals = (0, react_1.useMemo)(() => moviesTrending.filter((m) => m.category === 'ViewEase Originals' ||
        m.badges?.some((b) => b.includes('Original') || b.includes('ViewEase'))), [moviesTrending]);
    // Subcategory filters for Web Series section
    const seriesTrending = (0, react_1.useMemo)(() => allMovies.filter((m) => m.category === 'Web Series' || m.genres?.includes('Web Series')), [allMovies]);
    const seriesCyberpunk = (0, react_1.useMemo)(() => seriesTrending.filter((m) => m.genres?.includes('Cyberpunk') ||
        m.genres?.includes('Thriller') ||
        m.genres?.includes('Crime') ||
        m.title.includes('Shadows') ||
        m.title.includes('Singularity')), [seriesTrending]);
    const seriesSciFi = (0, react_1.useMemo)(() => seriesTrending.filter((m) => m.genres?.includes('Sci-Fi') ||
        m.genres?.includes('Adventure') ||
        m.title.includes('Starlight') ||
        m.title.includes('Chronicles')), [seriesTrending]);
    // Subcategory filters for Cartoons section
    const cartoonsTrending = (0, react_1.useMemo)(() => allMovies.filter((m) => m.category === 'Cartoons & Animation' ||
        m.genres?.includes('Animation') ||
        m.genres?.includes('Anime')), [allMovies]);
    const cartoonsAnime = (0, react_1.useMemo)(() => cartoonsTrending.filter((m) => m.genres?.includes('Anime') ||
        m.genres?.includes('Fantasy') ||
        m.title.includes('Aetheria') ||
        m.title.includes('Kitsune')), [cartoonsTrending]);
    const cartoonsFamily = (0, react_1.useMemo)(() => cartoonsTrending.filter((m) => m.genres?.includes('Family') ||
        m.genres?.includes('Comedy') ||
        m.contentRating === 'TV-G' ||
        m.contentRating === 'TV-Y7'), [cartoonsTrending]);
    // Subcategory filters for Documentaries section
    const docsTrending = (0, react_1.useMemo)(() => allMovies.filter((m) => m.category === 'Documentaries' ||
        m.genres?.includes('Documentary') ||
        m.genres?.includes('Nature') ||
        m.genres?.includes('Science')), [allMovies]);
    const docsSpace = (0, react_1.useMemo)(() => docsTrending.filter((m) => m.genres?.includes('Space') ||
        m.genres?.includes('Cosmic') ||
        m.title.includes('Cosmic') ||
        m.title.includes('Horizon')), [docsTrending]);
    const docsOceans = (0, react_1.useMemo)(() => docsTrending.filter((m) => m.genres?.includes('Science') ||
        m.title.includes('Deep') ||
        m.title.includes('Voices')), [docsTrending]);
    const docsPolarWildlife = (0, react_1.useMemo)(() => docsTrending.filter((m) => m.genres?.includes('Nature') ||
        m.genres?.includes('Wildlife') ||
        m.title.includes('Aurora') ||
        m.title.includes('Serengeti')), [docsTrending]);
    // Open "View All" modal for a category
    const openViewAll = (categoryTitle, moviesList) => {
        setViewAllCategoryName(categoryTitle);
        setViewAllMovies(moviesList);
        setViewAllModalVisible(true);
    };
    // Horizontal row scrolling references
    const rowRefs = (0, react_1.useRef)({});
    const scrollRow = (key, direction) => {
        const scrollEl = rowRefs.current[key];
        if (scrollEl) {
            // @ts-ignore
            if (scrollEl.scrollBy) {
                // @ts-ignore
                scrollEl.scrollBy({ left: direction === 'left' ? -500 : 500, behavior: 'smooth' });
            }
        }
    };
    return (<react_native_1.View style={styles.rootScreen}>
      {/* 1. Sleek Top Navigation Bar (Always Visible, No Side Drawer Covering Page) */}
      <TopNavigationBar_1.TopNavigationBar activeTab={activeCategoryFilter} onSelectCategory={(cat) => {
            setActiveCategoryFilter(cat);
        }} onOpenSearch={() => navigation.navigate('Explore')}/>

      <react_native_1.ScrollView ref={mainScrollViewRef} style={styles.mainScrollView} contentContainerStyle={styles.mainScrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Split-Screen Auto-Advancing Top Hero Showcase (8 Featured Titles) */}
        <react_native_1.View style={styles.heroShowcaseContainer} 
    // @ts-ignore - pause auto-rotation when user hovers on laptop
    onMouseEnter={() => setIsHeroHovered(true)} onMouseLeave={() => setIsHeroHovered(false)}>
          {/* Background image & gradient overlay */}
          <react_native_1.Image source={{ uri: activeHeroTitle.headerImage }} style={styles.heroBackdropImage} resizeMode="cover"/>
          <PlatformLinearGradient_1.default colors={['rgba(11,13,17,0.7)', 'rgba(11,13,17,0.25)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.heroGradientLeft}/>
          <PlatformLinearGradient_1.default colors={['transparent', 'rgba(11,13,17,0.6)', theme_1.colors.background]} start={{ x: 0, y: 0.7 }} end={{ x: 0, y: 1 }} style={styles.heroGradientBottom}/>

          {/* Split Screen Layout */}
          <react_native_1.View style={styles.heroSplitContent}>
            {/* Left Split Column: Metadata, Title, CTAs & Numbered Title Switcher */}
            <react_native_1.View style={styles.heroLeftCol}>
              {/* Badges Row */}
              <react_native_1.View style={styles.heroBadgeRow}>
                {activeHeroTitle.category && (<react_native_1.View style={styles.categoryPill}>
                    <react_native_1.Text style={styles.categoryPillText}>{activeHeroTitle.category}</react_native_1.Text>
                  </react_native_1.View>)}
                {activeHeroTitle.releaseYear && (<react_native_1.View style={styles.yearPill}>
                    <react_native_1.Text style={styles.yearPillText}>{activeHeroTitle.releaseYear}</react_native_1.Text>
                  </react_native_1.View>)}
                {activeHeroTitle.contentRating && (<react_native_1.View style={styles.contentRatingPill}>
                    <react_native_1.Text style={styles.contentRatingPillText}>{activeHeroTitle.contentRating}</react_native_1.Text>
                  </react_native_1.View>)}
                <react_native_1.View style={styles.assistPill}>
                  <react_native_1.Text style={styles.assistPillIcon}>⚡</react_native_1.Text>
                  <react_native_1.Text style={styles.assistPillText}>ASSIST READY</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              {/* Title & Tagline */}
              <react_native_1.Text style={styles.heroTitle} numberOfLines={2}>
                {activeHeroTitle.title}
              </react_native_1.Text>
              {activeHeroTitle.tagline ? (<react_native_1.Text style={styles.heroTagline} numberOfLines={1}>
                  "{activeHeroTitle.tagline}"
                </react_native_1.Text>) : null}

              {/* Synopsis */}
              <react_native_1.Text style={styles.heroDescription} numberOfLines={3}>
                {activeHeroTitle.description}
              </react_native_1.Text>

              {/* Action Buttons */}
              <react_native_1.View style={styles.heroCtaRow}>
                <react_native_1.Pressable accessibilityRole="button" onPress={() => navigateToPlayer(activeHeroTitle)} style={({ hovered }) => [
            styles.primaryCtaBtn,
            hovered && styles.primaryCtaBtnHovered,
        ]}>
                  <react_native_1.Text style={styles.primaryCtaText}>▶ Play Now</react_native_1.Text>
                </react_native_1.Pressable>

                <react_native_1.Pressable accessibilityRole="button" onPress={() => {
            StorageService_1.StorageService.toggleMyList(activeHeroTitle);
        }} style={({ hovered }) => [
            styles.secondaryCtaBtn,
            hovered && styles.secondaryCtaBtnHovered,
        ]}>
                  <react_native_1.Text style={styles.secondaryCtaText}>
                    {StorageService_1.StorageService.isInMyList(activeHeroTitle.id) ? '✓ In My List' : '+ Add to My List'}
                  </react_native_1.Text>
                </react_native_1.Pressable>

                <react_native_1.Pressable accessibilityRole="button" onPress={() => navigateToDetails(activeHeroTitle)} style={({ hovered }) => [
            styles.secondaryCtaBtn,
            hovered && styles.secondaryCtaBtnHovered,
        ]}>
                  <react_native_1.Text style={styles.secondaryCtaText}>ℹ Details</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>

              {/* Dot Indicators + Active Page Progress Bar */}
              <react_native_1.View style={styles.heroCarouselSelector}>
                <react_native_1.View style={styles.dotIndicatorRow}>
                  {heroFeaturedTitles.map((t, idx) => {
            const isSelected = idx === heroIndex;
            return (<react_native_1.Pressable key={t.id} onPress={() => setHeroIndex(idx)} 
            // @ts-ignore
            onMouseEnter={() => setHeroIndex(idx)} style={({ hovered }) => [
                    styles.dotIndicator,
                    isSelected && styles.dotIndicatorActive,
                    hovered && !isSelected && styles.dotIndicatorHovered,
                ]}/>);
        })}
                </react_native_1.View>
                {/* Wide progress bar showing current page position */}
                <react_native_1.View style={styles.heroProgressBarTrack}>
                  <react_native_1.View style={[
            styles.heroProgressBarFill,
            {
                width: `${((heroIndex + 1) / heroFeaturedTitles.length) * 100}%`,
            },
        ]}/>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>

          {/* Left / Right Carousel Arrow Buttons for Laptop Mouse Users */}
          <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Previous featured movie" onPress={() => setHeroIndex((prev) => (prev === 0 ? heroFeaturedTitles.length - 1 : prev - 1))} style={({ hovered }) => [
            styles.heroArrowBtn,
            styles.heroArrowLeft,
            hovered && styles.heroArrowBtnHovered,
        ]}>
            <react_native_1.Text style={styles.heroArrowText}>‹</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Next featured movie" onPress={() => setHeroIndex((prev) => (prev + 1) % heroFeaturedTitles.length)} style={({ hovered }) => [
            styles.heroArrowBtn,
            styles.heroArrowRight,
            hovered && styles.heroArrowBtnHovered,
        ]}>
            <react_native_1.Text style={styles.heroArrowText}>›</react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>

        {/* 3. Horizontal Content Rows with "View All →" and Scrolling Arrows */}
        <react_native_1.View style={styles.rowsWrapper}>
          {/* SECTION 1: HOME (ALL) */}
          {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Home') && (<>
              {continueWatching.length > 0 && (<CategoryRow rowKey="continue" title="Continue Watching" subtitle="Pick up exactly where you left off" movies={continueWatching.map((p) => {
                    const found = allMovies.find((m) => String(m.id) === p.id);
                    return found || allMovies[0];
                })} progressMap={continueWatching} onCardPress={(item, prog) => navigateToPlayer(item, prog?.positionSec || 0)} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Continue Watching', continueWatching.map((p) => allMovies.find((m) => String(m.id) === p.id) || allMovies[0]))} rowRef={(el) => {
                    rowRefs.current['continue'] = el;
                }} onScrollLeft={() => scrollRow('continue', 'left')} onScrollRight={() => scrollRow('continue', 'right')}/>)}

              <CategoryRow rowKey="web-series-home" title="Trending Web Series" subtitle="Bingeworthy multi-episode sagas" movies={seriesTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Trending Web Series', seriesTrending)} rowRef={(el) => {
                rowRefs.current['web-series-home'] = el;
            }} onScrollLeft={() => scrollRow('web-series-home', 'left')} onScrollRight={() => scrollRow('web-series-home', 'right')}/>

              <CategoryRow rowKey="movies-home" title="Blockbuster Movies" subtitle="Feature films in 4K HDR & Dolby Atmos" movies={moviesTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Blockbuster Movies', moviesTrending)} rowRef={(el) => {
                rowRefs.current['movies-home'] = el;
            }} onScrollLeft={() => scrollRow('movies-home', 'left')} onScrollRight={() => scrollRow('movies-home', 'right')}/>

              <CategoryRow rowKey="cartoons-home" title="Cartoons & Animation" subtitle="Anime epics & family friendly adventures" movies={cartoonsTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Cartoons & Animation', cartoonsTrending)} rowRef={(el) => {
                rowRefs.current['cartoons-home'] = el;
            }} onScrollLeft={() => scrollRow('cartoons-home', 'left')} onScrollRight={() => scrollRow('cartoons-home', 'right')}/>

              <CategoryRow rowKey="docs-home" title="Nature & Space Documentaries" subtitle="Real scientific discoveries and cosmic horizons" movies={docsTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Nature & Space Documentaries', docsTrending)} rowRef={(el) => {
                rowRefs.current['docs-home'] = el;
            }} onScrollLeft={() => scrollRow('docs-home', 'left')} onScrollRight={() => scrollRow('docs-home', 'right')}/>
            </>)}

          {/* SECTION 2: MOVIES */}
          {activeCategoryFilter === 'Movies' && (<>
              <react_native_1.View style={styles.sectionHeaderBanner}>
                <react_native_1.View>
                  <react_native_1.View style={styles.sectionBadge}>
                    <react_native_1.Text style={styles.sectionBadgeText}>CINEMA SPOTLIGHT</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.sectionHeaderTitle}>Feature Films & Blockbusters</react_native_1.Text>
                  <react_native_1.Text style={styles.sectionHeaderSub}>
                    Theatrical releases in 4K Ultra HD, HDR10+, and Dolby Atmos
                  </react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              <CategoryRow rowKey="movies-trending" title="Trending Blockbusters" subtitle="Most popular theatrical releases this week" movies={moviesTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Trending Blockbusters', moviesTrending)} rowRef={(el) => {
                rowRefs.current['movies-trending'] = el;
            }} onScrollLeft={() => scrollRow('movies-trending', 'left')} onScrollRight={() => scrollRow('movies-trending', 'right')}/>

              <CategoryRow rowKey="movies-scifi" title="Sci-Fi & Action Thrillers" subtitle="High-octane physics, quantum anomalies, and future tech" movies={moviesSciFiAction} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Sci-Fi & Action Thrillers', moviesSciFiAction)} rowRef={(el) => {
                rowRefs.current['movies-scifi'] = el;
            }} onScrollLeft={() => scrollRow('movies-scifi', 'left')} onScrollRight={() => scrollRow('movies-scifi', 'right')}/>

              <CategoryRow rowKey="movies-toprated" title="Critically Acclaimed Cinema" subtitle="Films rated 4.8★ and higher by critics & audiences" movies={moviesTopRated} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Critically Acclaimed Cinema', moviesTopRated)} rowRef={(el) => {
                rowRefs.current['movies-toprated'] = el;
            }} onScrollLeft={() => scrollRow('movies-toprated', 'left')} onScrollRight={() => scrollRow('movies-toprated', 'right')}/>

              <CategoryRow rowKey="movies-originals" title="ViewEase Original Features" subtitle="Exclusive productions crafted for next-gen display immersion" movies={moviesOriginals} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('ViewEase Original Features', moviesOriginals)} rowRef={(el) => {
                rowRefs.current['movies-originals'] = el;
            }} onScrollLeft={() => scrollRow('movies-originals', 'left')} onScrollRight={() => scrollRow('movies-originals', 'right')}/>
            </>)}

          {/* SECTION 3: WEB SERIES */}
          {activeCategoryFilter === 'Web Series' && (<>
              <react_native_1.View style={styles.sectionHeaderBanner}>
                <react_native_1.View>
                  <react_native_1.View style={styles.sectionBadge}>
                    <react_native_1.Text style={styles.sectionBadgeText}>MULTI-EPISODE SAGAS</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.sectionHeaderTitle}>Premium Web Series & Seasons</react_native_1.Text>
                  <react_native_1.Text style={styles.sectionHeaderSub}>
                    Binge-worthy serialized narratives with deep lore and evolving character arcs
                  </react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              <CategoryRow rowKey="series-trending" title="Trending Web Series" subtitle="The most-watched series streaming right now" movies={seriesTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Trending Web Series', seriesTrending)} rowRef={(el) => {
                rowRefs.current['series-trending'] = el;
            }} onScrollLeft={() => scrollRow('series-trending', 'left')} onScrollRight={() => scrollRow('series-trending', 'right')}/>

              <CategoryRow rowKey="series-cyberpunk" title="Cyberpunk & Tech Noir" subtitle="Neon underworlds, cyber-detectives, and neural conspiracies" movies={seriesCyberpunk} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Cyberpunk & Tech Noir', seriesCyberpunk)} rowRef={(el) => {
                rowRefs.current['series-cyberpunk'] = el;
            }} onScrollLeft={() => scrollRow('series-cyberpunk', 'left')} onScrollRight={() => scrollRow('series-cyberpunk', 'right')}/>

              <CategoryRow rowKey="series-scifi" title="Interstellar & Space Expeditions" subtitle="Colony ships, cosmic entities, and unknown horizons" movies={seriesSciFi} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Interstellar & Space Expeditions', seriesSciFi)} rowRef={(el) => {
                rowRefs.current['series-scifi'] = el;
            }} onScrollLeft={() => scrollRow('series-scifi', 'left')} onScrollRight={() => scrollRow('series-scifi', 'right')}/>

              <CategoryRow rowKey="series-all" title="Complete Series Collection" subtitle="All episodes and seasons available on ViewEase TV" movies={seriesTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Complete Series Collection', seriesTrending)} rowRef={(el) => {
                rowRefs.current['series-all'] = el;
            }} onScrollLeft={() => scrollRow('series-all', 'left')} onScrollRight={() => scrollRow('series-all', 'right')}/>
            </>)}

          {/* SECTION 4: CARTOONS & ANIMATION */}
          {(activeCategoryFilter === 'Cartoons & Animation' || activeCategoryFilter === 'Cartoons') && (<>
              <react_native_1.View style={styles.sectionHeaderBanner}>
                <react_native_1.View>
                  <react_native_1.View style={styles.sectionBadge}>
                    <react_native_1.Text style={styles.sectionBadgeText}>ANIMATION VAULT</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.sectionHeaderTitle}>Cartoons, Anime & Family Adventures</react_native_1.Text>
                  <react_native_1.Text style={styles.sectionHeaderSub}>
                    Vibrant worlds, mythical journeys, and wholesome laughter for every generation
                  </react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              <CategoryRow rowKey="cartoons-anime" title="Anime Epics & Mythical Worlds" subtitle="Breathtaking art styles and legends of flight and magic" movies={cartoonsAnime} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Anime Epics & Mythical Worlds', cartoonsAnime)} rowRef={(el) => {
                rowRefs.current['cartoons-anime'] = el;
            }} onScrollLeft={() => scrollRow('cartoons-anime', 'left')} onScrollRight={() => scrollRow('cartoons-anime', 'right')}/>

              <CategoryRow rowKey="cartoons-family" title="Kids Choice & Family Comedy" subtitle="Heartwarming laughs and energetic animated companions" movies={cartoonsFamily} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Kids Choice & Family Comedy', cartoonsFamily)} rowRef={(el) => {
                rowRefs.current['cartoons-family'] = el;
            }} onScrollLeft={() => scrollRow('cartoons-family', 'left')} onScrollRight={() => scrollRow('cartoons-family', 'right')}/>

              <CategoryRow rowKey="cartoons-all" title="All Animated Adventures" subtitle="The complete ViewEase animated catalog" movies={cartoonsTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('All Animated Adventures', cartoonsTrending)} rowRef={(el) => {
                rowRefs.current['cartoons-all'] = el;
            }} onScrollLeft={() => scrollRow('cartoons-all', 'left')} onScrollRight={() => scrollRow('cartoons-all', 'right')}/>
            </>)}

          {/* SECTION 5: DOCUMENTARIES */}
          {activeCategoryFilter === 'Documentaries' && (<>
              <react_native_1.View style={styles.sectionHeaderBanner}>
                <react_native_1.View>
                  <react_native_1.View style={styles.sectionBadge}>
                    <react_native_1.Text style={styles.sectionBadgeText}>REAL WORLD DISCOVERY</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.sectionHeaderTitle}>Earth, Oceans & Cosmos Documentaries</react_native_1.Text>
                  <react_native_1.Text style={styles.sectionHeaderSub}>
                    Witness unexplored ecosystems, deep sea acoustics, and galactic birth
                  </react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              <CategoryRow rowKey="docs-space" title="Cosmic Horizons & Space Science" subtitle="Spectacular astrophysics based on NASA and space telescope datasets" movies={docsSpace} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Cosmic Horizons & Space Science', docsSpace)} rowRef={(el) => {
                rowRefs.current['docs-space'] = el;
            }} onScrollLeft={() => scrollRow('docs-space', 'left')} onScrollRight={() => scrollRow('docs-space', 'right')}/>

              <CategoryRow rowKey="docs-oceans" title="Ocean & Deep Trench Mysteries" subtitle="Four miles below the surface: bioluminescence and uncharted life" movies={docsOceans} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Ocean & Deep Trench Mysteries', docsOceans)} rowRef={(el) => {
                rowRefs.current['docs-oceans'] = el;
            }} onScrollLeft={() => scrollRow('docs-oceans', 'left')} onScrollRight={() => scrollRow('docs-oceans', 'right')}/>

              <CategoryRow rowKey="docs-polar" title="Polar Expeditions & Wildlife" subtitle="Sub-zero arctic auroras and dramatic savannah migrations" movies={docsPolarWildlife} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('Polar Expeditions & Wildlife', docsPolarWildlife)} rowRef={(el) => {
                rowRefs.current['docs-polar'] = el;
            }} onScrollLeft={() => scrollRow('docs-polar', 'left')} onScrollRight={() => scrollRow('docs-polar', 'right')}/>

              <CategoryRow rowKey="docs-all" title="All Scientific & Nature Documentaries" subtitle="Full non-fiction documentary library" movies={docsTrending} onCardPress={navigateToDetails} onCardHover={setIsAnyCardHovered} onViewAll={() => openViewAll('All Scientific & Nature Documentaries', docsTrending)} rowRef={(el) => {
                rowRefs.current['docs-all'] = el;
            }} onScrollLeft={() => scrollRow('docs-all', 'left')} onScrollRight={() => scrollRow('docs-all', 'right')}/>
            </>)}
        </react_native_1.View>
      </react_native_1.ScrollView>

      {/* 4. "View All" Full Category Grid Modal */}
      <react_native_1.Modal visible={viewAllModalVisible} transparent animationType="slide" onRequestClose={() => setViewAllModalVisible(false)}>
        <react_native_1.View style={styles.viewAllBackdrop}>
          <react_native_1.View style={styles.viewAllCard}>
            {/* Modal Header */}
            <react_native_1.View style={styles.viewAllHeader}>
              <react_native_1.View>
                <react_native_1.Text style={styles.viewAllCategoryTitle}>{viewAllCategoryName}</react_native_1.Text>
                <react_native_1.Text style={styles.viewAllSub}>
                  Showing all {viewAllMovies.length} titles in this collection
                </react_native_1.Text>
              </react_native_1.View>

              <react_native_1.Pressable accessibilityRole="button" onPress={() => setViewAllModalVisible(false)} style={({ hovered }) => [
            styles.closeViewAllBtn,
            hovered && styles.closeViewAllBtnHovered,
        ]}>
                <react_native_1.Text style={styles.closeViewAllText}>✕ Close</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            {/* Grid of Movie Cards */}
            <react_native_1.ScrollView contentContainerStyle={styles.viewAllGridContent} showsVerticalScrollIndicator={true}>
              <react_native_1.View style={styles.viewAllGrid}>
                {viewAllMovies.map((movie) => (<react_native_1.View key={movie.id} style={styles.viewAllGridItem}>
                    <MovieCard item={movie} onPress={() => {
                setViewAllModalVisible(false);
                navigateToDetails(movie);
            }}/>
                  </react_native_1.View>))}
              </react_native_1.View>
            </react_native_1.ScrollView>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
    </react_native_1.View>);
}
const CategoryRow = ({ title, subtitle, movies, progressMap, onCardPress, onViewAll, rowRef, onScrollLeft, onScrollRight, onCardHover, }) => {
    return (<react_native_1.View style={styles.rowSection}>
      {/* Row Header with Category Title & "View All →" button */}
      <react_native_1.View style={styles.rowHeader}>
        <react_native_1.View style={styles.rowTitleWrapper}>
          <react_native_1.Text style={styles.rowTitle}>{title}</react_native_1.Text>
          <react_native_1.Text style={styles.rowSubtitle}>{subtitle}</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.rowHeaderActions}>
          {/* Scroll Arrows for Laptop Users */}
          <react_native_1.View style={styles.scrollArrowsGroup}>
            <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Scroll row left" onPress={onScrollLeft} style={({ hovered }) => [
            styles.rowArrowBtn,
            hovered && styles.rowArrowBtnHovered,
        ]}>
              <react_native_1.Text style={styles.rowArrowText}>‹</react_native_1.Text>
            </react_native_1.Pressable>
            <react_native_1.Pressable accessibilityRole="button" accessibilityLabel="Scroll row right" onPress={onScrollRight} style={({ hovered }) => [
            styles.rowArrowBtn,
            hovered && styles.rowArrowBtnHovered,
        ]}>
              <react_native_1.Text style={styles.rowArrowText}>›</react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>

          {/* View All Button */}
          <react_native_1.Pressable accessibilityRole="button" onPress={onViewAll} style={({ hovered }) => [
            styles.viewAllBtn,
            hovered && styles.viewAllBtnHovered,
        ]}>
            <react_native_1.Text style={styles.viewAllText}>View All →</react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>
      </react_native_1.View>

      {/* Horizontal Carousel */}
      <react_native_1.ScrollView ref={rowRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowCardsContainer}>
        {movies.map((item) => {
            const prog = progressMap?.find((p) => p.id === item.id) || null;
            return (<react_native_1.View key={item.id} style={styles.cardItemWrapper}>
              <MovieCard item={item} progress={prog} onPress={() => onCardPress(item, prog)} onHoverChange={onCardHover}/>
            </react_native_1.View>);
        })}
      </react_native_1.ScrollView>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    rootScreen: {
        flex: 1,
        backgroundColor: '#0B0D11',
    },
    mainScrollView: {
        flex: 1,
    },
    mainScrollContent: {
        paddingBottom: 60,
    },
    // Split-Screen Hero Showcase Styles
    heroShowcaseContainer: {
        width: '100%',
        height: 520,
        position: 'relative',
        backgroundColor: '#0D0F14',
        overflow: 'hidden',
        justifyContent: 'center',
    },
    heroBackdropImage: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        opacity: 1.0,
    },
    heroGradientLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '55%',
    },
    heroGradientBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 120,
    },
    heroSplitContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 48,
        paddingTop: 20,
        paddingBottom: 20,
        zIndex: 10,
    },
    heroLeftCol: {
        maxWidth: 780,
        width: '100%',
        justifyContent: 'center',
    },
    heroBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 14,
    },
    spotlightBadge: {
        backgroundColor: 'rgba(229, 169, 60, 0.25)',
        borderWidth: 1,
        borderColor: theme_1.colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    spotlightBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: theme_1.colors.primary,
        letterSpacing: 1,
    },
    categoryPill: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryPillText: {
        fontSize: 11,
        color: theme_1.colors.text,
        fontWeight: '600',
    },
    yearPill: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    yearPillText: {
        fontSize: 11,
        color: theme_1.colors.textMuted,
    },
    contentRatingPill: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 4,
    },
    contentRatingPillText: {
        fontSize: 10,
        color: theme_1.colors.text,
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
    heroTitle: {
        fontSize: 38,
        fontWeight: '900',
        color: theme_1.colors.text,
        lineHeight: 46,
        letterSpacing: 0.5,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    heroTagline: {
        fontSize: 14,
        fontStyle: 'italic',
        color: theme_1.colors.primary,
        marginBottom: 12,
    },
    heroDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: 'rgba(240, 243, 248, 0.85)',
        maxWidth: 620,
        marginBottom: 24,
    },
    heroCtaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    primaryCtaBtn: {
        backgroundColor: theme_1.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        // @ts-ignore
        cursor: 'pointer',
    },
    primaryCtaBtnHovered: {
        backgroundColor: '#F5BE58',
        // @ts-ignore
        boxShadow: '0 0 20px rgba(229, 169, 60, 0.7)',
        transform: [{ scale: 1.04 }],
    },
    primaryCtaText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0B0D11',
        letterSpacing: 0.5,
    },
    secondaryCtaBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 8,
        // @ts-ignore
        cursor: 'pointer',
    },
    secondaryCtaBtnHovered: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: '#FFFFFF',
        transform: [{ scale: 1.04 }],
    },
    secondaryCtaText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme_1.colors.text,
    },
    // Dot Indicators + Progress Bar
    heroCarouselSelector: {
        marginTop: 18,
    },
    dotIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    dotIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.28)',
        // @ts-ignore
        cursor: 'pointer',
    },
    dotIndicatorActive: {
        width: 22,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme_1.colors.primary,
        // @ts-ignore
        boxShadow: '0 0 10px rgba(229, 169, 60, 0.8)',
    },
    dotIndicatorHovered: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        transform: [{ scale: 1.2 }],
    },
    heroProgressBarTrack: {
        width: 280,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
    },
    heroProgressBarFill: {
        height: '100%',
        backgroundColor: theme_1.colors.primary,
        borderRadius: 2,
    },
    // Right Hero Column: Preview Card
    heroRightCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 280,
    },
    heroPreviewCard: {
        width: 380,
        maxWidth: '100%',
        height: 230,
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        // @ts-ignore
        cursor: 'pointer',
    },
    heroPreviewCardHovered: {
        borderWidth: 3,
        borderColor: '#FFFFFF',
        // @ts-ignore
        boxShadow: '0 0 25px rgba(255, 255, 255, 0.5)',
        transform: [{ scale: 1.05 }],
    },
    heroPreviewImage: {
        width: '100%',
        height: '100%',
    },
    heroPreviewOverlay: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(11, 13, 17, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    heroPlayCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(229, 169, 60, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 12,
    },
    heroPlayIcon: {
        fontSize: 22,
        color: '#0B0D11',
        marginLeft: 3,
    },
    heroPreviewTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: theme_1.colors.text,
        textAlign: 'center',
    },
    heroPreviewHint: {
        fontSize: 11,
        color: theme_1.colors.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    // Carousel Arrow Buttons for Laptop
    heroArrowBtn: {
        position: 'absolute',
        top: '46%',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(13, 15, 20, 0.75)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        // @ts-ignore
        cursor: 'pointer',
    },
    heroArrowLeft: {
        left: 14,
    },
    heroArrowRight: {
        right: 14,
    },
    heroArrowBtnHovered: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primary,
    },
    heroArrowText: {
        fontSize: 28,
        color: theme_1.colors.text,
        lineHeight: 30,
        fontWeight: '700',
    },
    // Category Rows Wrapper
    rowsWrapper: {
        paddingTop: 8,
    },
    sectionHeaderBanner: {
        paddingHorizontal: 48,
        paddingTop: 20,
        paddingBottom: 16,
    },
    sectionBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(229, 169, 60, 0.16)',
        borderWidth: 1,
        borderColor: theme_1.colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
        marginBottom: 6,
    },
    sectionBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: theme_1.colors.primary,
        letterSpacing: 1,
    },
    sectionHeaderTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: theme_1.colors.text,
        letterSpacing: 0.4,
    },
    sectionHeaderSub: {
        fontSize: 13,
        color: theme_1.colors.textMuted,
        marginTop: 4,
    },
    rowSection: {
        marginBottom: 32,
    },
    rowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 48,
        marginBottom: 14,
    },
    rowTitleWrapper: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: theme_1.colors.text,
        letterSpacing: 0.4,
    },
    rowSubtitle: {
        fontSize: 12,
        color: theme_1.colors.textMuted,
        marginTop: 2,
    },
    rowHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    scrollArrowsGroup: {
        flexDirection: 'row',
        gap: 6,
    },
    rowArrowBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        // @ts-ignore
        cursor: 'pointer',
    },
    rowArrowBtnHovered: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: '#FFFFFF',
    },
    rowArrowText: {
        fontSize: 20,
        color: theme_1.colors.text,
        lineHeight: 22,
        fontWeight: '800',
    },
    viewAllBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(229, 169, 60, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(229, 169, 60, 0.35)',
        // @ts-ignore
        cursor: 'pointer',
    },
    viewAllBtnHovered: {
        backgroundColor: 'rgba(229, 169, 60, 0.28)',
        borderColor: theme_1.colors.primary,
        // @ts-ignore
        boxShadow: '0 0 12px rgba(229, 169, 60, 0.4)',
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme_1.colors.primary,
        letterSpacing: 0.3,
    },
    rowCardsContainer: {
        paddingHorizontal: 48,
        gap: 18,
    },
    cardItemWrapper: {
        marginRight: 4,
    },
    // Movie Card with White Boundary & Hover Elevation
    cardContainer: {
        width: 260,
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#161B22',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        // @ts-ignore
        cursor: 'pointer',
    },
    cardContainerHighlighted: {
        // Exact White Boundary requested by user:
        borderWidth: 3,
        borderColor: '#FFFFFF',
        // @ts-ignore
        boxShadow: '0 0 22px rgba(255, 255, 255, 0.55)',
        transform: [{ scale: 1.06 }],
        zIndex: 50,
    },
    cardContainerPressed: {
        transform: [{ scale: 1.02 }],
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardGradient: {
        ...react_native_1.StyleSheet.absoluteFillObject,
    },
    cardInfoContainer: {
        position: 'absolute',
        bottom: 8,
        left: 10,
        right: 10,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: theme_1.colors.text,
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    cardMetaRow: {
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
    whiteBoundaryGlow: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    playBadgeFloating: {
        backgroundColor: theme_1.colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    playBadgeText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#0B0D11',
    },
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme_1.colors.primary,
    },
    // "View All" Modal Styles
    viewAllBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    viewAllCard: {
        width: '94%',
        maxHeight: '90%',
        backgroundColor: '#12151C',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.9,
        shadowRadius: 32,
    },
    viewAllHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 28,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    viewAllCategoryTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: theme_1.colors.text,
    },
    viewAllSub: {
        fontSize: 12,
        color: theme_1.colors.textMuted,
        marginTop: 2,
    },
    closeViewAllBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        // @ts-ignore
        cursor: 'pointer',
    },
    closeViewAllBtnHovered: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderColor: '#FFFFFF',
    },
    closeViewAllText: {
        fontSize: 13,
        fontWeight: '700',
        color: theme_1.colors.text,
    },
    viewAllGridContent: {
        padding: 28,
    },
    viewAllGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'flex-start',
    },
    viewAllGridItem: {
        width: 260,
    },
});
