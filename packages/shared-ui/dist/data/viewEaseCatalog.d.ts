import { CardData } from './moviesData';
export interface TranscriptSegment {
    id: string;
    startSec: number;
    endSec: number;
    speaker: string;
    speakerRole: string;
    speakerBio: string;
    dialogue: string;
    explanation: string;
    simplified: string;
    hindiTranslation: string;
    hindiPhonetic: string;
    speakerContext: string;
    storyRecap: string;
}
export interface ViewEaseTitle extends CardData {
    id: string;
    title: string;
    tagline: string;
    description: string;
    headerImage: string;
    posterImage: string;
    movie: string;
    category: string;
    genres: string[];
    releaseYear: number;
    rating: number;
    ratingCount: number;
    contentRating: string;
    duration: number;
    badges: string[];
    director: string;
    cast: string[];
    audioTracks: string[];
    subtitleLanguages: string[];
    hasAssist: boolean;
    transcript: TranscriptSegment[];
}
export declare const VIEWEASE_CATALOG: ViewEaseTitle[];
export declare function getTitleById(id: string | number): ViewEaseTitle;
export declare function searchTitles(query: string, genreFilter?: string): ViewEaseTitle[];
//# sourceMappingURL=viewEaseCatalog.d.ts.map