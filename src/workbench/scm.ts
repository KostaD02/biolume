import { withAlpha } from "../color.ts";
import type { Palette } from "../palettes.ts";
import type { WorkbenchColors } from "./index.ts";

export function scm(p: Palette): WorkbenchColors {
  return {
    // Git decorations
    "gitDecoration.addedResourceForeground": p.accentMuted,
    "gitDecoration.untrackedResourceForeground": p.accentMuted,
    "gitDecoration.modifiedResourceForeground": p.warningMuted,
    "gitDecoration.stageModifiedResourceForeground": p.warningMuted,
    "gitDecoration.renamedResourceForeground": p.info,
    "gitDecoration.deletedResourceForeground": p.danger,
    "gitDecoration.stageDeletedResourceForeground": p.danger,
    "gitDecoration.conflictingResourceForeground": p.danger,
    "gitDecoration.ignoredResourceForeground": p.dim,
    "gitDecoration.submoduleResourceForeground": p.syntax.constant,
    "git.blame.editorDecorationForeground": p.dim,

    // Gutters
    "editorGutter.addedBackground": p.accent,
    "editorGutter.modifiedBackground": p.warning,
    "editorGutter.deletedBackground": p.danger,
    "editorGutter.addedSecondaryBackground": withAlpha(p.accent, 0.5),
    "editorGutter.modifiedSecondaryBackground": withAlpha(p.warning, 0.5),
    "editorGutter.deletedSecondaryBackground": withAlpha(p.danger, 0.5),
    "minimapGutter.addedBackground": p.accent,
    "minimapGutter.modifiedBackground": p.warning,
    "minimapGutter.deletedBackground": p.danger,
    "editorOverviewRuler.addedForeground": withAlpha(p.accent, 0.6),
    "editorOverviewRuler.modifiedForeground": withAlpha(p.warning, 0.6),
    "editorOverviewRuler.deletedForeground": withAlpha(p.danger, 0.6),

    // Diff editor
    "diffEditor.insertedTextBackground": withAlpha(p.accent, 0.15),
    "diffEditor.insertedLineBackground": withAlpha(p.accent, 0.07),
    "diffEditor.removedTextBackground": withAlpha(p.danger, 0.2),
    "diffEditor.removedLineBackground": withAlpha(p.danger, 0.08),
    "diffEditorGutter.insertedLineBackground": withAlpha(p.accent, 0.15),
    "diffEditorGutter.removedLineBackground": withAlpha(p.danger, 0.15),
    "diffEditorOverview.insertedForeground": withAlpha(p.accent, 0.6),
    "diffEditorOverview.removedForeground": withAlpha(p.danger, 0.6),
    "diffEditor.border": p.border,
    "diffEditor.diagonalFill": withAlpha(p.border, 0.6),
    "diffEditor.unchangedRegionBackground": p.surface,
    "diffEditor.unchangedRegionForeground": p.muted,
    "diffEditor.unchangedRegionShadow": p.shadow,
    "diffEditor.unchangedCodeBackground": withAlpha(p.surface, 0.5),
    "diffEditor.move.border": withAlpha(p.info, 0.5),
    "diffEditor.moveActive.border": p.warning,
    "multiDiffEditor.background": p.bg,
    "multiDiffEditor.headerBackground": p.surface,
    "multiDiffEditor.border": p.border,

    // Merge conflicts
    "merge.currentHeaderBackground": withAlpha(p.accent, 0.3),
    "merge.currentContentBackground": withAlpha(p.accent, 0.1),
    "merge.incomingHeaderBackground": withAlpha(p.info, 0.35),
    "merge.incomingContentBackground": withAlpha(p.info, 0.12),
    "merge.commonHeaderBackground": withAlpha(p.muted, 0.35),
    "merge.commonContentBackground": withAlpha(p.muted, 0.12),
    "merge.border": p.border,
    "editorOverviewRuler.currentContentForeground": withAlpha(p.accent, 0.6),
    "editorOverviewRuler.incomingContentForeground": withAlpha(p.info, 0.6),
    "editorOverviewRuler.commonContentForeground": withAlpha(p.muted, 0.6),

    // Merge editor
    "mergeEditor.change.background": withAlpha(p.accent, 0.1),
    "mergeEditor.change.word.background": withAlpha(p.accent, 0.2),
    "mergeEditor.changeBase.background": withAlpha(p.danger, 0.1),
    "mergeEditor.changeBase.word.background": withAlpha(p.danger, 0.2),
    "mergeEditor.conflict.unhandledUnfocused.border": withAlpha(p.warning, 0.5),
    "mergeEditor.conflict.unhandledFocused.border": p.warning,
    "mergeEditor.conflict.handledUnfocused.border": withAlpha(p.accent, 0.4),
    "mergeEditor.conflict.handledFocused.border": p.accent,
    "mergeEditor.conflict.unhandled.minimapOverViewRuler": withAlpha(p.warning, 0.6),
    "mergeEditor.conflict.handled.minimapOverViewRuler": withAlpha(p.accent, 0.6),
    "mergeEditor.conflict.input1.background": withAlpha(p.accent, 0.1),
    "mergeEditor.conflict.input2.background": withAlpha(p.info, 0.12),
    "mergeEditor.conflictingLines.background": withAlpha(p.warning, 0.15),

    // Source control graph
    "scmGraph.foreground1": p.accent,
    "scmGraph.foreground2": p.syntax.control,
    "scmGraph.foreground3": p.warning,
    "scmGraph.foreground4": p.info,
    "scmGraph.foreground5": p.syntax.regexp,
    "scmGraph.historyItemRefColor": p.accent,
    "scmGraph.historyItemRemoteRefColor": p.syntax.control,
    "scmGraph.historyItemBaseRefColor": p.warning,
    "scmGraph.historyItemHoverAdditionsForeground": p.accent,
    "scmGraph.historyItemHoverDeletionsForeground": p.danger,
    "scmGraph.historyItemHoverLabelForeground": p.inverse,
    "scmGraph.historyItemHoverDefaultLabelForeground": p.text,
    "scmGraph.historyItemHoverDefaultLabelBackground": p.elevatedHover,
  };
}
