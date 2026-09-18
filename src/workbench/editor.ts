import { withAlpha } from "../color.ts";
import type { Palette } from "../palettes.ts";
import type { WorkbenchColors } from "./index.ts";

export function editor(p: Palette): WorkbenchColors {
  const transparent = withAlpha(p.bg, 0);

  return {
    // Basics
    "editor.background": p.bg,
    "editor.foreground": p.codeFg,
    "editorCursor.foreground": p.accent,
    "editorCursor.background": p.bg,
    "editor.placeholder.foreground": p.dim,
    "editor.lineHighlightBackground": p.surface,
    "editor.lineHighlightBorder": transparent,
    "editorLineNumber.foreground": p.dim,
    "editorLineNumber.activeForeground": p.accent,
    "editorLineNumber.dimmedForeground": withAlpha(p.muted, p.opacity.disabled),
    "editorGutter.background": p.bg,
    "editorGutter.foldingControlForeground": p.muted,

    // Selections and occurrences
    "editor.selectionBackground": withAlpha(p.accent, 0.2),
    "editor.inactiveSelectionBackground": withAlpha(p.accent, 0.1),
    "editor.selectionHighlightBackground": p.accentSoft,
    "editor.wordHighlightBackground": withAlpha(p.bright, 0.08),
    "editor.wordHighlightStrongBackground": withAlpha(p.accent, 0.12),
    "editor.wordHighlightTextBackground": withAlpha(p.bright, 0.06),
    "editor.hoverHighlightBackground": withAlpha(p.bright, 0.08),
    "editor.rangeHighlightBackground": withAlpha(p.elevatedHover, 0.5),
    "editor.symbolHighlightBackground": withAlpha(p.warning, 0.15),
    "editor.linkedEditingBackground": withAlpha(p.accent, 0.1),

    // Find
    "editor.findMatchBackground": withAlpha(p.warning, 0.3),
    "editor.findMatchBorder": p.warning,
    "editor.findMatchHighlightBackground": withAlpha(p.warning, 0.15),
    "editor.findRangeHighlightBackground": withAlpha(p.elevatedHover, 0.5),
    "searchEditor.findMatchBackground": withAlpha(p.warning, 0.15),
    "searchEditor.findMatchBorder": withAlpha(p.warning, 0.5),

    // Brackets and guides
    "editorBracketMatch.background": p.accentSoft,
    "editorBracketMatch.border": withAlpha(p.accent, 0.5),
    "editorBracketHighlight.foreground1": p.syntax.escape,
    "editorBracketHighlight.foreground2": p.syntax.control,
    "editorBracketHighlight.foreground3": p.syntax.constant,
    "editorBracketHighlight.unexpectedBracket.foreground": p.danger,
    "editorIndentGuide.background1": p.border,
    "editorIndentGuide.activeBackground1": p.borderStrong,
    "editorRuler.foreground": p.border,
    "editorWhitespace.foreground": withAlpha(p.borderStrong, 0.6),

    // Inline decorations
    "editorCodeLens.foreground": p.muted,
    "editorLink.activeForeground": p.accent,
    "editorGhostText.foreground": p.dim,
    "editorInlayHint.foreground": p.muted,
    "editorInlayHint.background": withAlpha(p.elevated, 0.8),
    "editorLightBulb.foreground": p.warning,
    "editorLightBulbAutoFix.foreground": p.accent,
    "editorUnicodeHighlight.border": p.warning,
    "editor.foldBackground": withAlpha(p.elevated, 0.5),
    "editor.foldPlaceholderForeground": p.muted,
    "editor.snippetTabstopHighlightBackground": withAlpha(p.accent, 0.1),
    "editor.snippetTabstopHighlightBorder": p.accentLine,
    "editor.snippetFinalTabstopHighlightBackground": withAlpha(p.accent, 0.1),
    "editor.snippetFinalTabstopHighlightBorder": p.accentLine,
    "editor.inlineValuesForeground": p.muted,
    "editor.inlineValuesBackground": withAlpha(p.warning, 0.1),
    "editor.stackFrameHighlightBackground": withAlpha(p.warning, 0.15),
    "editor.focusedStackFrameHighlightBackground": withAlpha(p.accent, 0.15),

    // Sticky scroll
    "editorStickyScroll.background": p.bg,
    "editorStickyScroll.shadow": p.shadow,
    "editorStickyScrollGutter.background": p.bg,
    "editorStickyScrollHover.background": p.elevated,

    // Overview ruler
    "editorOverviewRuler.border": transparent,
    "editorOverviewRuler.findMatchForeground": withAlpha(p.warning, 0.6),
    "editorOverviewRuler.rangeHighlightForeground": withAlpha(p.info, 0.4),
    "editorOverviewRuler.selectionHighlightForeground": withAlpha(p.accent, 0.5),
    "editorOverviewRuler.wordHighlightStrongForeground": withAlpha(p.accent, 0.5),
    "editorOverviewRuler.bracketMatchForeground": withAlpha(p.accent, 0.5),
    "editorOverviewRuler.wordHighlightForeground": withAlpha(p.bright, 0.3),
    "editorOverviewRuler.wordHighlightTextForeground": withAlpha(p.bright, 0.3),

    // Minimap
    "minimap.background": p.bg,
    "minimap.selectionHighlight": withAlpha(p.accent, 0.3),
    "minimap.selectionOccurrenceHighlight": withAlpha(p.accent, 0.2),
    "minimap.findMatchHighlight": withAlpha(p.warning, 0.6),
    "minimapSlider.background": withAlpha(p.scrollbar, 0.2),
    "minimapSlider.hoverBackground": withAlpha(p.scrollbar, 0.3),
    "minimapSlider.activeBackground": withAlpha(p.scrollbar, 0.4),
  };
}
