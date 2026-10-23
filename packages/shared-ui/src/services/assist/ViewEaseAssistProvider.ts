import { TranscriptSegment, getTitleById } from '../../data/viewEaseCatalog';

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

// Deterministic offline demonstration provider
// Uses verified, curated ground-truth data for the 2026 hackathon demo
export class CuratedLocalAssistProvider implements AssistProvider {
  public id = 'viewease-offline-deterministic';
  public displayName = 'ViewEase Local Companion Engine';
  public isOfflineOnly = true;

  public getSegmentForTimestamp(titleId: string, timestampSec: number): TranscriptSegment | null {
    const title = getTitleById(titleId);
    if (!title || !title.transcript || title.transcript.length === 0) {
      return null;
    }

    // Find segment covering this timestamp
    const active = title.transcript.find(
      (s) => timestampSec >= s.startSec && timestampSec <= s.endSec,
    );
    if (active) return active;

    // Or find closest preceding segment
    const preceding = [...title.transcript]
      .reverse()
      .find((s) => timestampSec >= s.startSec);
    if (preceding) return preceding;

    return title.transcript[0];
  }

  public getAllSegments(titleId: string): TranscriptSegment[] {
    const title = getTitleById(titleId);
    return title?.transcript || [];
  }

  public async explainLine(segment: TranscriptSegment): Promise<AssistResult> {
    return {
      action: 'explain',
      title: 'Explain This Line',
      badge: 'Offline Demonstration — Curated Context',
      content: segment.explanation,
      supplementary: `Dialogue: "${segment.dialogue}"`,
      sourceType: 'offline-deterministic',
      timestampSec: segment.startSec,
    };
  }

  public async simplifyLine(segment: TranscriptSegment): Promise<AssistResult> {
    return {
      action: 'simplify',
      title: 'Make It Simpler',
      badge: 'Cognitive Accessibility Mode',
      content: segment.simplified,
      supplementary: 'Rewritten into everyday, direct phrasing without confusing technical jargon.',
      sourceType: 'offline-deterministic',
      timestampSec: segment.startSec,
    };
  }

  public async translateLine(segment: TranscriptSegment): Promise<AssistResult> {
    return {
      action: 'translate',
      title: 'Hindi Translation',
      badge: 'Multilingual Viewing Support',
      content: segment.hindiTranslation,
      supplementary: `Pronunciation / Romanized: "${segment.hindiPhonetic}"`,
      sourceType: 'offline-deterministic',
      timestampSec: segment.startSec,
    };
  }

  public async whoSaidThat(segment: TranscriptSegment): Promise<AssistResult> {
    return {
      action: 'speaker',
      title: `Speaker: ${segment.speaker}`,
      badge: segment.speakerRole,
      content: segment.speakerContext,
      supplementary: segment.speakerBio,
      sourceType: 'offline-deterministic',
      timestampSec: segment.startSec,
    };
  }

  public async previouslyInStory(
    titleId: string,
    currentTimestampSec: number,
  ): Promise<AssistResult> {
    const title = getTitleById(titleId);
    const segment = this.getSegmentForTimestamp(titleId, currentTimestampSec);

    const minutes = Math.floor(currentTimestampSec / 60);
    const seconds = Math.floor(currentTimestampSec % 60)
      .toString()
      .padStart(2, '0');

    const recapText = segment?.storyRecap ||
      `At ${minutes}:${seconds}, the crew has entered the anomaly zone. Prior to this, they detected an encrypted distress beacon and stabilized the USS Chronos 40 kilometers from the horizon.`;

    return {
      action: 'recap',
      title: 'Previously in this Story',
      badge: `Spoiler-Free Up to ${minutes}:${seconds}`,
      content: recapText,
      supplementary:
        'This recap strictly summarizes events leading up to this exact second. It is safe from future spoilers.',
      sourceType: 'offline-deterministic',
      timestampSec: currentTimestampSec,
    };
  }
}

// Singleton provider instance for ViewEase TV
export const DefaultAssistProvider: AssistProvider = new CuratedLocalAssistProvider();
