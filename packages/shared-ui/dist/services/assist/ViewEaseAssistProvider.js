"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAssistProvider = exports.CuratedLocalAssistProvider = void 0;
const viewEaseCatalog_1 = require("../../data/viewEaseCatalog");
// Deterministic offline demonstration provider
// Uses verified, curated ground-truth data for the 2026 hackathon demo
class CuratedLocalAssistProvider {
    id = 'viewease-offline-deterministic';
    displayName = 'ViewEase Local Companion Engine';
    isOfflineOnly = true;
    getSegmentForTimestamp(titleId, timestampSec) {
        const title = (0, viewEaseCatalog_1.getTitleById)(titleId);
        if (!title || !title.transcript || title.transcript.length === 0) {
            return null;
        }
        // Find segment covering this timestamp
        const active = title.transcript.find((s) => timestampSec >= s.startSec && timestampSec <= s.endSec);
        if (active)
            return active;
        // Or find closest preceding segment
        const preceding = [...title.transcript]
            .reverse()
            .find((s) => timestampSec >= s.startSec);
        if (preceding)
            return preceding;
        return title.transcript[0];
    }
    getAllSegments(titleId) {
        const title = (0, viewEaseCatalog_1.getTitleById)(titleId);
        return title?.transcript || [];
    }
    async explainLine(segment) {
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
    async simplifyLine(segment) {
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
    async translateLine(segment) {
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
    async whoSaidThat(segment) {
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
    async previouslyInStory(titleId, currentTimestampSec) {
        const title = (0, viewEaseCatalog_1.getTitleById)(titleId);
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
            supplementary: 'This recap strictly summarizes events leading up to this exact second. It is safe from future spoilers.',
            sourceType: 'offline-deterministic',
            timestampSec: currentTimestampSec,
        };
    }
}
exports.CuratedLocalAssistProvider = CuratedLocalAssistProvider;
// Singleton provider instance for ViewEase TV
exports.DefaultAssistProvider = new CuratedLocalAssistProvider();
