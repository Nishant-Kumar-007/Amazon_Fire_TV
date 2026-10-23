"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moviesData = exports.fetchMoviesData = exports.transformCatalogItem = void 0;
const CATALOG_URL = 'https://giolaq.github.io/scrap-tv-feed/catalog.json';
// Transform catalog item to CardData format
const transformCatalogItem = (item) => {
    const videoSource = item.sources.find(s => s.type === 'video/mp4') || item.sources[0];
    return {
        id: item.id,
        title: item.title,
        description: item.description,
        headerImage: item.images.poster_16x9,
        movie: videoSource?.url || '',
        duration: item.duration_sec,
        category: item.category,
        genres: item.genres,
        releaseYear: item.release_year,
        rating: item.rating_stars,
        ratingCount: item.rating_count,
        contentRating: item.content_rating,
        trending: item.trending,
    };
};
exports.transformCatalogItem = transformCatalogItem;
const viewEaseCatalog_1 = require("./viewEaseCatalog");
// Fetch movies from catalog with reliable offline fallback
const fetchMoviesData = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const response = await fetch(CATALOG_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
            const data = await response.json();
            const onlineItems = data.items.map(exports.transformCatalogItem);
            // Ensure ViewEase curated titles are front-and-center
            const combined = [...viewEaseCatalog_1.VIEWEASE_CATALOG];
            for (const item of onlineItems) {
                if (!combined.some(c => c.id === item.id || c.title.toLowerCase() === item.title.toLowerCase())) {
                    combined.push(item);
                }
            }
            return combined;
        }
    }
    catch (error) {
        // Graceful offline fallback - Zero cost & completely reliable
        console.log('Operating in offline-first mode, loaded bundled ViewEase catalog:', error);
    }
    return viewEaseCatalog_1.VIEWEASE_CATALOG;
};
exports.fetchMoviesData = fetchMoviesData;
// Export curated ViewEase titles as default
exports.moviesData = viewEaseCatalog_1.VIEWEASE_CATALOG;
