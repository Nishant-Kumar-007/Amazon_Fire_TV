import { TranscriptSegment } from '../../data/viewEaseCatalog';
export type AssistActionType = 'explain' | 'simplify' | 'translate' | 'speaker' | 'recap';
export interface AssistResult {
    action: AssistActionType;
    title: string;
    badge: string;
    content: string;
    supplementary?: string;
    sourceType: 'offline-deterministic' | 'live-inference';
    timestampSec: number;
}
export interface SpeakerProfileResult {
    speakerName: string;
    role: string;
    bio: string;
    context: string;
    avatarColor: string;
}
export interface AssistProvider {
    id: string;
    displayName: string;
    isOfflineOnly: boolean;
    getSegmentForTimestamp(titleId: string, timestampSec: number): TranscriptSegment | null;
    getAllSegments(titleId: string): TranscriptSegment[];
    explainLine(segment: TranscriptSegment): Promise<AssistResult>;
    simplifyLine(segment: TranscriptSegment): Promise<AssistResult>;
    translateLine(segment: TranscriptSegment): Promise<AssistResult>;
    whoSaidThat(segment: TranscriptSegment): Promise<AssistResult>;
    previouslyInStory(titleId: string, currentTimestampSec: number): Promise<AssistResult>;
}
export declare class CuratedLocalAssistProvider implements AssistProvider {
    id: string;
    displayName: string;
    isOfflineOnly: boolean;
    getSegmentForTimestamp(titleId: string, timestampSec: number): TranscriptSegment | null;
    getAllSegments(titleId: string): TranscriptSegment[];
    explainLine(segment: TranscriptSegment): Promise<AssistResult>;
    simplifyLine(segment: TranscriptSegment): Promise<AssistResult>;
    translateLine(segment: TranscriptSegment): Promise<AssistResult>;
    whoSaidThat(segment: TranscriptSegment): Promise<AssistResult>;
    previouslyInStory(titleId: string, currentTimestampSec: number): Promise<AssistResult>;
}
export declare const DefaultAssistProvider: AssistProvider;
//# sourceMappingURL=ViewEaseAssistProvider.d.ts.map