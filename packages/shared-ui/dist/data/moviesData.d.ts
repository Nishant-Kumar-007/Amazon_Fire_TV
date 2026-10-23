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
export declare const transformCatalogItem: (item: CatalogItem) => CardData;
export declare const fetchMoviesData: () => Promise<CardData[]>;
export declare const moviesData: CardData[];
//# sourceMappingURL=moviesData.d.ts.map