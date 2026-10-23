import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  SpatialNavigationFocusableView,
  SpatialNavigationNode,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { scaledPixels } from '../../hooks/useScale';
import { colors, safeZones } from '../../theme';
import {
  DefaultAssistProvider,
  AssistActionType,
  AssistResult,
} from '../../services/assist/ViewEaseAssistProvider';
import { TranscriptSegment } from '../../data/viewEaseCatalog';

interface ViewEaseAssistOverlayProps {
  visible: boolean;
  titleId: string;
  currentTime: number;
  onClose: () => void;
  onSeekTo?: (timeSec: number) => void;
}

const ACTION_TABS: Array<{ type: AssistActionType; label: string; icon: string }> = [
  { type: 'explain', label: 'Explain Line', icon: '💡' },
  { type: 'simplify', label: 'Make It Simpler', icon: '✨' },
  { type: 'translate', label: 'Hindi', icon: '🌐' },
  { type: 'speaker', label: 'Who Said That?', icon: '👤' },
  { type: 'recap', label: 'Story So Far', icon: '⏪' },
];

export const ViewEaseAssistOverlay: React.FC<ViewEaseAssistOverlayProps> = ({
  visible,
  titleId,
  currentTime,
  onClose,
  onSeekTo,
}) => {
  const [selectedAction, setSelectedAction] = useState<AssistActionType>('explain');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const [result, setResult] = useState<AssistResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const segments = useMemo(() => {
    return DefaultAssistProvider.getAllSegments(titleId);
  }, [titleId]);

  // Find the segment matching current playback time on open
  useEffect(() => {
    if (visible && segments.length > 0) {
      const currentSegment = DefaultAssistProvider.getSegmentForTimestamp(titleId, currentTime);
      if (currentSegment) {
        const idx = segments.findIndex((s) => s.id === currentSegment.id);
        setActiveSegmentIndex(idx !== -1 ? idx : 0);
      }
    }
  }, [visible, titleId, currentTime, segments]);

  const activeSegment: TranscriptSegment | undefined = segments[activeSegmentIndex];

  // Fetch or generate assist output when action or segment changes
  useEffect(() => {
    if (!visible) return;

    let isMounted = true;
    setIsLoading(true);

    const runAction = async () => {
      try {
        let res: AssistResult;
        if (selectedAction === 'recap') {
          res = await DefaultAssistProvider.previouslyInStory(titleId, currentTime);
        } else if (activeSegment) {
          switch (selectedAction) {
            case 'simplify':
              res = await DefaultAssistProvider.simplifyLine(activeSegment);
              break;
            case 'translate':
              res = await DefaultAssistProvider.translateLine(activeSegment);
              break;
            case 'speaker':
              res = await DefaultAssistProvider.whoSaidThat(activeSegment);
              break;
            case 'explain':
            default:
              res = await DefaultAssistProvider.explainLine(activeSegment);
              break;
          }
        } else {
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
      } catch (err) {
        console.error('ViewEase Assist calculation error:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    runAction();

    return () => {
      isMounted = false;
    };
  }, [visible, selectedAction, activeSegmentIndex, activeSegment, titleId, currentTime]);

  const formatTimestamp = useCallback((sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.modalBackdrop}>
      <View style={styles.sheetContainer}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeIcon}>⚡</Text>
              <Text style={styles.brandBadgeText}>VIEWEASE ASSIST</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Contextual Viewing Companion • Scene at {formatTimestamp(currentTime)}
            </Text>
          </View>

          <SpatialNavigationFocusableView onSelect={onClose}>
            {({ isFocused }) => (
              <View style={[styles.closeButton, isFocused && styles.closeButtonFocused]}>
                <Text style={[styles.closeButtonText, isFocused && styles.closeButtonTextFocused]}>
                  ✕ Resume Watching
                </Text>
              </View>
            )}
          </SpatialNavigationFocusableView>
        </View>

        <View style={styles.bodyRow}>
          {/* Left Panel: Dialogue Timeline / Segments */}
          <View style={styles.leftTimelinePanel}>
            <Text style={styles.sectionHeading}>RECENT SCENE DIALOGUE</Text>
            <ScrollView style={styles.segmentList} showsVerticalScrollIndicator={false}>
              <SpatialNavigationNode orientation="vertical">
                <View>
                  {segments.map((seg, idx) => {
                    const isCurrent = idx === activeSegmentIndex;
                    return (
                      <SpatialNavigationFocusableView
                        key={seg.id}
                        onSelect={() => {
                          setActiveSegmentIndex(idx);
                          if (onSeekTo) onSeekTo(seg.startSec);
                        }}
                      >
                        {({ isFocused }) => (
                          <View
                            style={[
                              styles.segmentCard,
                              isCurrent && styles.segmentCardSelected,
                              isFocused && styles.segmentCardFocused,
                            ]}
                          >
                            <View style={styles.segmentMetaRow}>
                              <Text style={styles.segmentSpeaker}>{seg.speaker}</Text>
                              <Text style={styles.segmentTime}>{formatTimestamp(seg.startSec)}</Text>
                            </View>
                            <Text style={styles.segmentText} numberOfLines={2}>
                              "{seg.dialogue}"
                            </Text>
                          </View>
                        )}
                      </SpatialNavigationFocusableView>
                    );
                  })}
                </View>
              </SpatialNavigationNode>
            </ScrollView>
          </View>

          {/* Right Panel: Action Tabs & Dynamic Companion Output */}
          <View style={styles.rightContentPanel}>
            {/* Action Bar Pills */}
            <SpatialNavigationNode orientation="horizontal">
              <View style={styles.tabBar}>
                {ACTION_TABS.map((tab, idx) => {
                  const isSelected = selectedAction === tab.type;
                  const TabComponent = idx === 0 ? DefaultFocus : React.Fragment;
                  return (
                    <TabComponent key={tab.type}>
                      <SpatialNavigationFocusableView onSelect={() => setSelectedAction(tab.type)}>
                        {({ isFocused }) => (
                          <View
                            style={[
                              styles.actionPill,
                              isSelected && styles.actionPillSelected,
                              isFocused && styles.actionPillFocused,
                            ]}
                          >
                            <Text style={styles.actionPillIcon}>{tab.icon}</Text>
                            <Text
                              style={[
                                styles.actionPillLabel,
                                isSelected && styles.actionPillLabelSelected,
                                isFocused && styles.actionPillLabelFocused,
                              ]}
                            >
                              {tab.label}
                            </Text>
                          </View>
                        )}
                      </SpatialNavigationFocusableView>
                    </TabComponent>
                  );
                })}
              </View>
            </SpatialNavigationNode>

            {/* Content Output Box */}
            <View style={styles.outputBox}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Synthesizing contextual insight...</Text>
                </View>
              ) : result ? (
                <View style={styles.resultContainer}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>{result.title}</Text>
                    <View style={styles.sourceTag}>
                      <Text style={styles.sourceTagText}>{result.badge}</Text>
                    </View>
                  </View>

                  <ScrollView style={styles.resultScroll} showsVerticalScrollIndicator={false}>
                    <Text style={styles.resultBody}>{result.content}</Text>

                    {result.supplementary && (
                      <View style={styles.supplementaryBox}>
                        <Text style={styles.supplementaryLabel}>ORIGINAL REFERENCE</Text>
                        <Text style={styles.supplementaryText}>{result.supplementary}</Text>
                      </View>
                    )}

                    {activeSegment && selectedAction === 'speaker' && (
                      <View style={styles.characterDetailBox}>
                        <Text style={styles.characterDetailRole}>{activeSegment.speakerRole}</Text>
                        <Text style={styles.characterDetailBio}>{activeSegment.speakerBio}</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              ) : null}

              {/* Offline Disclaimer Footer */}
              <View style={styles.disclaimerBar}>
                <Text style={styles.disclaimerText}>
                  Verified local deterministic engine • No external APIs or network required
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 10, 13, 0.88)',
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  sheetContainer: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: scaledPixels(24),
    borderTopRightRadius: scaledPixels(24),
    borderTopWidth: scaledPixels(2),
    borderTopColor: colors.primary,
    height: '68%',
    paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
    paddingTop: scaledPixels(20),
    paddingBottom: scaledPixels(safeZones.actionSafe.vertical),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: scaledPixels(20),
    elevation: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: scaledPixels(16),
    borderBottomWidth: scaledPixels(1),
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(6),
    borderRadius: scaledPixels(6),
    marginEnd: scaledPixels(16),
  },
  brandBadgeIcon: {
    fontSize: scaledPixels(18),
    marginEnd: scaledPixels(6),
  },
  brandBadgeText: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: scaledPixels(16),
    letterSpacing: 1.2,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: colors.card,
    paddingHorizontal: scaledPixels(20),
    paddingVertical: scaledPixels(10),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
  },
  closeButtonFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.05 }],
  },
  closeButtonText: {
    color: colors.text,
    fontSize: scaledPixels(18),
    fontWeight: '600',
  },
  closeButtonTextFocused: {
    color: colors.textOnPrimary,
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: scaledPixels(16),
  },
  leftTimelinePanel: {
    width: '35%',
    borderEndWidth: scaledPixels(1),
    borderEndColor: colors.border,
    paddingEnd: scaledPixels(20),
  },
  sectionHeading: {
    color: colors.textTertiary,
    fontSize: scaledPixels(14),
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: scaledPixels(12),
  },
  segmentList: {
    flex: 1,
  },
  segmentCard: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(10),
    padding: scaledPixels(14),
    marginBottom: scaledPixels(10),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
  },
  segmentCardSelected: {
    borderColor: colors.borderLight,
    backgroundColor: colors.cardElevated,
  },
  segmentCardFocused: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
    transform: [{ scale: 1.03 }],
  },
  segmentMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaledPixels(6),
  },
  segmentSpeaker: {
    color: colors.primaryLight,
    fontWeight: '700',
    fontSize: scaledPixels(16),
  },
  segmentTime: {
    color: colors.textTertiary,
    fontSize: scaledPixels(14),
  },
  segmentText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
    lineHeight: scaledPixels(22),
  },
  rightContentPanel: {
    flex: 1,
    paddingStart: scaledPixels(24),
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: scaledPixels(16),
    flexWrap: 'wrap',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: scaledPixels(18),
    paddingVertical: scaledPixels(10),
    borderRadius: scaledPixels(20),
    marginEnd: scaledPixels(12),
    marginBottom: scaledPixels(8),
    borderWidth: scaledPixels(2),
    borderColor: colors.border,
  },
  actionPillSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(229, 169, 60, 0.16)',
  },
  actionPillFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
    transform: [{ scale: 1.06 }],
  },
  actionPillIcon: {
    fontSize: scaledPixels(16),
    marginEnd: scaledPixels(6),
  },
  actionPillLabel: {
    color: colors.textSecondary,
    fontSize: scaledPixels(16),
    fontWeight: '600',
  },
  actionPillLabelSelected: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  actionPillLabelFocused: {
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  outputBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: scaledPixels(12),
    padding: scaledPixels(20),
    borderWidth: scaledPixels(1),
    borderColor: colors.border,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(20),
  },
  resultContainer: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledPixels(16),
  },
  resultTitle: {
    color: colors.text,
    fontSize: scaledPixels(26),
    fontWeight: '700',
  },
  sourceTag: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    paddingHorizontal: scaledPixels(12),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(6),
    borderWidth: scaledPixels(1),
    borderColor: colors.badgeBorder,
  },
  sourceTagText: {
    color: colors.primaryLight,
    fontSize: scaledPixels(13),
    fontWeight: '600',
  },
  resultScroll: {
    flex: 1,
  },
  resultBody: {
    color: colors.text,
    fontSize: scaledPixels(22),
    lineHeight: scaledPixels(34),
    marginBottom: scaledPixels(20),
    fontWeight: '400',
  },
  supplementaryBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: scaledPixels(8),
    padding: scaledPixels(14),
    borderStartWidth: scaledPixels(4),
    borderStartColor: colors.primary,
    marginBottom: scaledPixels(14),
  },
  supplementaryLabel: {
    color: colors.primaryLight,
    fontSize: scaledPixels(12),
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: scaledPixels(4),
  },
  supplementaryText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(17),
    fontStyle: 'italic',
  },
  characterDetailBox: {
    backgroundColor: colors.cardElevated,
    borderRadius: scaledPixels(8),
    padding: scaledPixels(14),
    marginTop: scaledPixels(8),
  },
  characterDetailRole: {
    color: colors.textAccent,
    fontWeight: '700',
    fontSize: scaledPixels(16),
    marginBottom: scaledPixels(4),
  },
  characterDetailBio: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
    lineHeight: scaledPixels(22),
  },
  disclaimerBar: {
    paddingTop: scaledPixels(10),
    borderTopWidth: scaledPixels(1),
    borderTopColor: colors.divider,
    marginTop: scaledPixels(10),
  },
  disclaimerText: {
    color: colors.textTertiary,
    fontSize: scaledPixels(12),
    textAlign: 'center',
  },
});
