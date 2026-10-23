// Catalog API types
export type CatalogItem = {
  id: string;
  type: string;
  title: string;
  category: string;
  genres: string[];
  trending: boolean;
  rating_count: number;
  rating_stars: number;
  content_rating: string;
  release_year: number;
  duration_sec: number;
  images: {
    poster_16x9: string;
  };
  sources: Array<{
    type: string;
    url: string;
  }>;
  description: string;
};

export type CatalogResponse = {
  catalog_version: string;
  updated_at: string;
  items: CatalogItem[];
};

// Simplified card data for UI components
export type CardData = {
  id: string | number;
  title: string;
  description: string;
  headerImage: string;
  movie: string;
  duration?: number;
  category?: string;
  genres?: string[];
  releaseYear?: number;
  rating?: number;
  ratingCount?: number;
  contentRating?: string;
  trending?: boolean;
};

const CATALOG_URL = 'https://giolaq.github.io/scrap-tv-feed/catalog.json';

// Transform catalog item to CardData format
export const transformCatalogItem = (item: CatalogItem): CardData => {
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

import { VIEWEASE_CATALOG } from './viewEaseCatalog';

// Fetch movies from catalog with reliable offline fallback
export const fetchMoviesData = async (): Promise<CardData[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(CATALOG_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data: CatalogResponse = await response.json();
      const onlineItems = data.items.map(transformCatalogItem);
      // Ensure ViewEase curated titles are front-and-center
      const combined: CardData[] = [...VIEWEASE_CATALOG];
      for (const item of onlineItems) {
        if (!combined.some(c => c.id === item.id || c.title.toLowerCase() === item.title.toLowerCase())) {
          combined.push(item);
        }
      }
      return combined;
    }
  } catch (error) {
    // Graceful offline fallback - Zero cost & completely reliable
    console.log('Operating in offline-first mode, loaded bundled ViewEase catalog:', error);
  }
  return VIEWEASE_CATALOG;
};

// Export curated ViewEase titles as default
export const moviesData: CardData[] = VIEWEASE_CATALOG;

