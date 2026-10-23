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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewEaseAssistOverlay = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_tv_space_navigation_1 = require("react-tv-space-navigation");
const useScale_1 = require("../../hooks/useScale");
const theme_1 = require("../../theme");
const ViewEaseAssistProvider_1 = require("../../services/assist/ViewEaseAssistProvider");
const ACTION_TABS = [
    { type: 'explain', label: 'Explain Line', icon: '💡' },
    { type: 'simplify', label: 'Make It Simpler', icon: '✨' },
    { type: 'translate', label: 'Hindi', icon: '🌐' },
    { type: 'speaker', label: 'Who Said That?', icon: '👤' },
    { type: 'recap', label: 'Story So Far', icon: '⏪' },
];
const ViewEaseAssistOverlay = ({ visible, titleId, currentTime, onClose, onSeekTo, }) => {
    const [selectedAction, setSelectedAction] = (0, react_1.useState)('explain');
    const [activeSegmentIndex, setActiveSegmentIndex] = (0, react_1.useState)(0);
    const [result, setResult] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const segments = (0, react_1.useMemo)(() => {
        return ViewEaseAssistProvider_1.DefaultAssistProvider.getAllSegments(titleId);
    }, [titleId]);
    // Find the segment matching current playback time on open
    (0, react_1.useEffect)(() => {
        if (visible && segments.length > 0) {
            const currentSegment = ViewEaseAssistProvider_1.DefaultAssistProvider.getSegmentForTimestamp(titleId, currentTime);
            if (currentSegment) {
                const idx = segments.findIndex((s) => s.id === currentSegment.id);
                setActiveSegmentIndex(idx !== -1 ? idx : 0);
            }
        }
    }, [visible, titleId, currentTime, segments]);
    const activeSegment = segments[activeSegmentIndex];
    // Fetch or generate assist output when action or segment changes
    (0, react_1.useEffect)(() => {
        if (!visible)
            return;
        let isMounted = true;
        setIsLoading(true);
        const runAction = async () => {
            try {
                let res;
                if (selectedAction === 'recap') {
                    res = await ViewEaseAssistProvider_1.DefaultAssistProvider.previouslyInStory(titleId, currentTime);
                }
                else if (activeSegment) {
                    switch (selectedAction) {
                        case 'simplify':
                            res = await ViewEaseAssistProvider_1.DefaultAssistProvider.simplifyLine(activeSegment);
                            break;
                        case 'translate':
                            res = await ViewEaseAssistProvider_1.DefaultAssistProvider.translateLine(activeSegment);
                            break;
                        case 'speaker':
                            res = await ViewEaseAssistProvider_1.DefaultAssistProvider.whoSaidThat(activeSegment);
                            break;
                        case 'explain':
                        default:
                            res = await ViewEaseAssistProvider_1.DefaultAssistProvider.explainLine(activeSegment);
                            break;
                    }
                }
                else {
                    res = {
                        action: selectedAction,
                        title: 'No Dialogue Track Available',
                        badge: 'Instrumental / Ambient Scene',
                        content: 'There is no dialogue recorded for this scene moment.',
                        sourceType: 'offline-deterministic',
                        timestampSec: currentTime,
                    };
                }
                if (isMounted) {
                    setResult(res);
                    setIsLoading(false);
                }
            }
            catch (err) {
                console.error('ViewEase Assist calculation error:', err);
                if (isMounted)
                    setIsLoading(false);
            }
        };
        runAction();
        return () => {
            isMounted = false;
        };
    }, [visible, selectedAction, activeSegmentIndex, activeSegment, titleId, currentTime]);
    const formatTimestamp = (0, react_1.useCallback)((sec) => {
        const mins = Math.floor(sec / 60);
        const secs = Math.floor(sec % 60)
            .toString()
            .padStart(2, '0');
        return `${mins}:${secs}`;
    }, []);
    if (!visible)
        return null;
    return (<react_native_1.View style={styles.modalBackdrop}>
      <react_native_1.View style={styles.sheetContainer}>
        {/* Header Bar */}
        <react_native_1.View style={styles.headerBar}>
          <react_native_1.View style={styles.headerLeft}>
            <react_native_1.View style={styles.brandBadge}>
              <react_native_1.Text style={styles.brandBadgeIcon}>⚡</react_native_1.Text>
              <react_native_1.Text style={styles.brandBadgeText}>VIEWEASE ASSIST</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.Text style={styles.headerSubtitle}>
              Contextual Viewing Companion • Scene at {formatTimestamp(currentTime)}
            </react_native_1.Text>
          </react_native_1.View>

          <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={onClose}>
            {({ isFocused }) => (<react_native_1.View style={[styles.closeButton, isFocused && styles.closeButtonFocused]}>
                <react_native_1.Text style={[styles.closeButtonText, isFocused && styles.closeButtonTextFocused]}>
                  ✕ Resume Watching
                </react_native_1.Text>
              </react_native_1.View>)}
          </react_tv_space_navigation_1.SpatialNavigationFocusableView>
        </react_native_1.View>

        <react_native_1.View style={styles.bodyRow}>
          {/* Left Panel: Dialogue Timeline / Segments */}
          <react_native_1.View style={styles.leftTimelinePanel}>
            <react_native_1.Text style={styles.sectionHeading}>RECENT SCENE DIALOGUE</react_native_1.Text>
            <react_native_1.ScrollView style={styles.segmentList} showsVerticalScrollIndicator={false}>
              <react_tv_space_navigation_1.SpatialNavigationNode orientation="vertical">
                <react_native_1.View>
                  {segments.map((seg, idx) => {
            const isCurrent = idx === activeSegmentIndex;
            return (<react_tv_space_navigation_1.SpatialNavigationFocusableView key={seg.id} onSelect={() => {
                    setActiveSegmentIndex(idx);
                    if (onSeekTo)
                        onSeekTo(seg.startSec);
                }}>
                        {({ isFocused }) => (<react_native_1.View style={[
                        styles.segmentCard,
                        isCurrent && styles.segmentCardSelected,
                        isFocused && styles.segmentCardFocused,
                    ]}>
                            <react_native_1.View style={styles.segmentMetaRow}>
                              <react_native_1.Text style={styles.segmentSpeaker}>{seg.speaker}</react_native_1.Text>
                              <react_native_1.Text style={styles.segmentTime}>{formatTimestamp(seg.startSec)}</react_native_1.Text>
                            </react_native_1.View>
                            <react_native_1.Text style={styles.segmentText} numberOfLines={2}>
                              "{seg.dialogue}"
                            </react_native_1.Text>
                          </react_native_1.View>)}
                      </react_tv_space_navigation_1.SpatialNavigationFocusableView>);
        })}
                </react_native_1.View>
              </react_tv_space_navigation_1.SpatialNavigationNode>
            </react_native_1.ScrollView>
          </react_native_1.View>

          {/* Right Panel: Action Tabs & Dynamic Companion Output */}
          <react_native_1.View style={styles.rightContentPanel}>
            {/* Action Bar Pills */}
            <react_tv_space_navigation_1.SpatialNavigationNode orientation="horizontal">
              <react_native_1.View style={styles.tabBar}>
                {ACTION_TABS.map((tab, idx) => {
            const isSelected = selectedAction === tab.type;
            const TabComponent = idx === 0 ? react_tv_space_navigation_1.DefaultFocus : react_1.default.Fragment;
            return (<TabComponent key={tab.type}>
                      <react_tv_space_navigation_1.SpatialNavigationFocusableView onSelect={() => setSelectedAction(tab.type)}>
                        {({ isFocused }) => (<react_native_1.View style={[
                        styles.actionPill,
                        isSelected && styles.actionPillSelected,
                        isFocused && styles.actionPillFocused,
                    ]}>
                            <react_native_1.Text style={styles.actionPillIcon}>{tab.icon}</react_native_1.Text>
                            <react_native_1.Text style={[
                        styles.actionPillLabel,
                        isSelected && styles.actionPillLabelSelected,
                        isFocused && styles.actionPillLabelFocused,
                    ]}>
                              {tab.label}
                            </react_native_1.Text>
                          </react_native_1.View>)}
                      </react_tv_space_navigation_1.SpatialNavigationFocusableView>
                    </TabComponent>);
        })}
              </react_native_1.View>
            </react_tv_space_navigation_1.SpatialNavigationNode>

            {/* Content Output Box */}
            <react_native_1.View style={styles.outputBox}>
              {isLoading ? (<react_native_1.View style={styles.loadingContainer}>
                  <react_native_1.Text style={styles.loadingText}>Synthesizing contextual insight...</react_native_1.Text>
                </react_native_1.View>) : result ? (<react_native_1.View style={styles.resultContainer}>
                  <react_native_1.View style={styles.resultHeader}>
                    <react_native_1.Text style={styles.resultTitle}>{result.title}</react_native_1.Text>
                    <react_native_1.View style={styles.sourceTag}>
                      <react_native_1.Text style={styles.sourceTagText}>{result.badge}</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>

                  <react_native_1.ScrollView style={styles.resultScroll} showsVerticalScrollIndicator={false}>
                    <react_native_1.Text style={styles.resultBody}>{result.content}</react_native_1.Text>

                    {result.supplementary && (<react_native_1.View style={styles.supplementaryBox}>
                        <react_native_1.Text style={styles.supplementaryLabel}>ORIGINAL REFERENCE</react_native_1.Text>
                        <react_native_1.Text style={styles.supplementaryText}>{result.supplementary}</react_native_1.Text>
                      </react_native_1.View>)}

                    {activeSegment && selectedAction === 'speaker' && (<react_native_1.View style={styles.characterDetailBox}>
                        <react_native_1.Text style={styles.characterDetailRole}>{activeSegment.speakerRole}</react_native_1.Text>
                        <react_native_1.Text style={styles.characterDetailBio}>{activeSegment.speakerBio}</react_native_1.Text>
                      </react_native_1.View>)}
                  </react_native_1.ScrollView>
                </react_native_1.View>) : null}

              {/* Offline Disclaimer Footer */}
              <react_native_1.View style={styles.disclaimerBar}>
                <react_native_1.Text style={styles.disclaimerText}>
                  Verified local deterministic engine • No external APIs or network required
                </react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.ViewEaseAssistOverlay = ViewEaseAssistOverlay;
const styles = react_native_1.StyleSheet.create({
    modalBackdrop: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(8, 10, 13, 0.88)',
        justifyContent: 'flex-end',
        zIndex: 999,
    },
    sheetContainer: {
        backgroundColor: theme_1.colors.backgroundElevated,
        borderTopLeftRadius: (0, useScale_1.scaledPixels)(24),
        borderTopRightRadius: (0, useScale_1.scaledPixels)(24),
        borderTopWidth: (0, useScale_1.scaledPixels)(2),
        borderTopColor: theme_1.colors.primary,
        height: '68%',
        paddingHorizontal: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.horizontal),
        paddingTop: (0, useScale_1.scaledPixels)(20),
        paddingBottom: (0, useScale_1.scaledPixels)(theme_1.safeZones.actionSafe.vertical),
        shadowColor: theme_1.colors.primary,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.35,
        shadowRadius: (0, useScale_1.scaledPixels)(20),
        elevation: 20,
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: (0, useScale_1.scaledPixels)(16),
        borderBottomWidth: (0, useScale_1.scaledPixels)(1),
        borderBottomColor: theme_1.colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    brandBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme_1.colors.primary,
        paddingHorizontal: (0, useScale_1.scaledPixels)(14),
        paddingVertical: (0, useScale_1.scaledPixels)(6),
        borderRadius: (0, useScale_1.scaledPixels)(6),
        marginEnd: (0, useScale_1.scaledPixels)(16),
    },
    brandBadgeIcon: {
        fontSize: (0, useScale_1.scaledPixels)(18),
        marginEnd: (0, useScale_1.scaledPixels)(6),
    },
    brandBadgeText: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '800',
        fontSize: (0, useScale_1.scaledPixels)(16),
        letterSpacing: 1.2,
    },
    headerSubtitle: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(18),
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: theme_1.colors.card,
        paddingHorizontal: (0, useScale_1.scaledPixels)(20),
        paddingVertical: (0, useScale_1.scaledPixels)(10),
        borderRadius: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.border,
    },
    closeButtonFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.05 }],
    },
    closeButtonText: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(18),
        fontWeight: '600',
    },
    closeButtonTextFocused: {
        color: theme_1.colors.textOnPrimary,
    },
    bodyRow: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: (0, useScale_1.scaledPixels)(16),
    },
    leftTimelinePanel: {
        width: '35%',
        borderEndWidth: (0, useScale_1.scaledPixels)(1),
        borderEndColor: theme_1.colors.border,
        paddingEnd: (0, useScale_1.scaledPixels)(20),
    },
    sectionHeading: {
        color: theme_1.colors.textTertiary,
        fontSize: (0, useScale_1.scaledPixels)(14),
        fontWeight: '700',
        letterSpacing: 1.1,
        marginBottom: (0, useScale_1.scaledPixels)(12),
    },
    segmentList: {
        flex: 1,
    },
    segmentCard: {
        backgroundColor: theme_1.colors.card,
        borderRadius: (0, useScale_1.scaledPixels)(10),
        padding: (0, useScale_1.scaledPixels)(14),
        marginBottom: (0, useScale_1.scaledPixels)(10),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: 'transparent',
    },
    segmentCardSelected: {
        borderColor: theme_1.colors.borderLight,
        backgroundColor: theme_1.colors.cardElevated,
    },
    segmentCardFocused: {
        backgroundColor: theme_1.colors.secondary,
        borderColor: theme_1.colors.primary,
        transform: [{ scale: 1.03 }],
    },
    segmentMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: (0, useScale_1.scaledPixels)(6),
    },
    segmentSpeaker: {
        color: theme_1.colors.primaryLight,
        fontWeight: '700',
        fontSize: (0, useScale_1.scaledPixels)(16),
    },
    segmentTime: {
        color: theme_1.colors.textTertiary,
        fontSize: (0, useScale_1.scaledPixels)(14),
    },
    segmentText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(15),
        lineHeight: (0, useScale_1.scaledPixels)(22),
    },
    rightContentPanel: {
        flex: 1,
        paddingStart: (0, useScale_1.scaledPixels)(24),
    },
    tabBar: {
        flexDirection: 'row',
        marginBottom: (0, useScale_1.scaledPixels)(16),
        flexWrap: 'wrap',
    },
    actionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme_1.colors.card,
        paddingHorizontal: (0, useScale_1.scaledPixels)(18),
        paddingVertical: (0, useScale_1.scaledPixels)(10),
        borderRadius: (0, useScale_1.scaledPixels)(20),
        marginEnd: (0, useScale_1.scaledPixels)(12),
        marginBottom: (0, useScale_1.scaledPixels)(8),
        borderWidth: (0, useScale_1.scaledPixels)(2),
        borderColor: theme_1.colors.border,
    },
    actionPillSelected: {
        borderColor: theme_1.colors.primary,
        backgroundColor: 'rgba(229, 169, 60, 0.16)',
    },
    actionPillFocused: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primaryLight,
        transform: [{ scale: 1.06 }],
    },
    actionPillIcon: {
        fontSize: (0, useScale_1.scaledPixels)(16),
        marginEnd: (0, useScale_1.scaledPixels)(6),
    },
    actionPillLabel: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(16),
        fontWeight: '600',
    },
    actionPillLabelSelected: {
        color: theme_1.colors.primaryLight,
        fontWeight: '700',
    },
    actionPillLabelFocused: {
        color: theme_1.colors.textOnPrimary,
        fontWeight: '700',
    },
    outputBox: {
        flex: 1,
        backgroundColor: theme_1.colors.card,
        borderRadius: (0, useScale_1.scaledPixels)(12),
        padding: (0, useScale_1.scaledPixels)(20),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: theme_1.colors.border,
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(20),
    },
    resultContainer: {
        flex: 1,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: (0, useScale_1.scaledPixels)(16),
    },
    resultTitle: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(26),
        fontWeight: '700',
    },
    sourceTag: {
        backgroundColor: 'rgba(229, 169, 60, 0.15)',
        paddingHorizontal: (0, useScale_1.scaledPixels)(12),
        paddingVertical: (0, useScale_1.scaledPixels)(4),
        borderRadius: (0, useScale_1.scaledPixels)(6),
        borderWidth: (0, useScale_1.scaledPixels)(1),
        borderColor: theme_1.colors.badgeBorder,
    },
    sourceTagText: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(13),
        fontWeight: '600',
    },
    resultScroll: {
        flex: 1,
    },
    resultBody: {
        color: theme_1.colors.text,
        fontSize: (0, useScale_1.scaledPixels)(22),
        lineHeight: (0, useScale_1.scaledPixels)(34),
        marginBottom: (0, useScale_1.scaledPixels)(20),
        fontWeight: '400',
    },
    supplementaryBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        borderRadius: (0, useScale_1.scaledPixels)(8),
        padding: (0, useScale_1.scaledPixels)(14),
        borderStartWidth: (0, useScale_1.scaledPixels)(4),
        borderStartColor: theme_1.colors.primary,
        marginBottom: (0, useScale_1.scaledPixels)(14),
    },
    supplementaryLabel: {
        color: theme_1.colors.primaryLight,
        fontSize: (0, useScale_1.scaledPixels)(12),
        fontWeight: '800',
        letterSpacing: 1.1,
        marginBottom: (0, useScale_1.scaledPixels)(4),
    },
    supplementaryText: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(17),
        fontStyle: 'italic',
    },
    characterDetailBox: {
        backgroundColor: theme_1.colors.cardElevated,
        borderRadius: (0, useScale_1.scaledPixels)(8),
        padding: (0, useScale_1.scaledPixels)(14),
        marginTop: (0, useScale_1.scaledPixels)(8),
    },
    characterDetailRole: {
        color: theme_1.colors.textAccent,
        fontWeight: '700',
        fontSize: (0, useScale_1.scaledPixels)(16),
        marginBottom: (0, useScale_1.scaledPixels)(4),
    },
    characterDetailBio: {
        color: theme_1.colors.textSecondary,
        fontSize: (0, useScale_1.scaledPixels)(15),
        lineHeight: (0, useScale_1.scaledPixels)(22),
    },
    disclaimerBar: {
        paddingTop: (0, useScale_1.scaledPixels)(10),
        borderTopWidth: (0, useScale_1.scaledPixels)(1),
        borderTopColor: theme_1.colors.divider,
        marginTop: (0, useScale_1.scaledPixels)(10),
    },
    disclaimerText: {
        color: theme_1.colors.textTertiary,
        fontSize: (0, useScale_1.scaledPixels)(12),
        textAlign: 'center',
    },
});
