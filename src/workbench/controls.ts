import { withAlpha } from "../color.ts";
import type { Palette } from "../palettes.ts";
import type { WorkbenchColors } from "./index.ts";

export function controls(p: Palette): WorkbenchColors {
  const transparent = withAlpha(p.bg, 0);
  const disabled = withAlpha(p.muted, p.opacity.disabled);
  const placeholder = withAlpha(p.muted, 0.8);

  return {
    // Base colors
    foreground: p.textSecondary,
    descriptionForeground: p.muted,
    disabledForeground: disabled,
    focusBorder: p.accentLine,
    "icon.foreground": p.textSecondary,
    "selection.background": withAlpha(p.accent, 0.25),
    "widget.border": p.border,
    "widget.shadow": p.shadow,
    "sash.hoverBorder": p.accentLine,
    "toolbar.hoverBackground": p.elevated,
    "toolbar.activeBackground": p.elevatedHover,
    "actionBar.toggledBackground": p.accentSoft,

    // Text
    "textLink.foreground": p.accentMuted,
    "textLink.activeForeground": p.accent,
    "textBlockQuote.background": p.surface,
    "textBlockQuote.border": p.accentLine,
    "textCodeBlock.background": p.surface,
    "textPreformat.foreground": p.codeInline,
    "textPreformat.background": p.surface,
    "textSeparator.foreground": p.border,

    // Buttons
    "button.background": p.accentFill,
    "button.foreground": p.inverse,
    "button.hoverBackground": withAlpha(p.accent, 0.85),
    "button.border": p.accentLine,
    "button.separator": withAlpha(p.inverse, 0.4),
    "button.secondaryBackground": transparent,
    "button.secondaryForeground": p.accent,
    "button.secondaryHoverBackground": p.accentSoft,
    "button.secondaryBorder": p.accent,

    // Extension buttons
    "extensionButton.background": p.accentFill,
    "extensionButton.foreground": p.inverse,
    "extensionButton.hoverBackground": withAlpha(p.accent, 0.85),
    "extensionButton.border": p.accentLine,
    "extensionButton.separator": withAlpha(p.inverse, 0.4),
    "extensionButton.prominentBackground": p.accentFill,
    "extensionButton.prominentForeground": p.inverse,
    "extensionButton.prominentHoverBackground": withAlpha(p.accent, 0.85),

    // Badges and progress
    "badge.background": p.accent,
    "badge.foreground": p.inverse,
    "profileBadge.background": p.accent,
    "profileBadge.foreground": p.inverse,
    "extensionBadge.remoteBackground": p.accent,
    "extensionBadge.remoteForeground": p.inverse,
    "progressBar.background": p.accent,

    // Extension icons
    "extensionIcon.starForeground": p.warning,
    "extensionIcon.verifiedForeground": p.accent,
    "extensionIcon.preReleaseForeground": p.syntax.control,
    "extensionIcon.sponsorForeground": p.syntax.regexp,
    "extensionIcon.privateForeground": p.muted,

    // Inputs
    "input.background": p.elevated,
    "input.foreground": p.text,
    "input.border": p.border,
    "input.placeholderForeground": placeholder,
    "inlineChatInput.border": p.border,
    "searchEditor.textInputBorder": p.border,

    // Input options
    "inputOption.activeBackground": p.accentSoft,
    "inputOption.activeBorder": p.accentMid,
    "inputOption.activeForeground": p.accent,
    "inputOption.hoverBackground": p.elevatedHover,

    // Dropdowns
    "dropdown.background": p.elevated,
    "dropdown.listBackground": p.elevated,
    "dropdown.foreground": p.text,
    "dropdown.border": p.border,

    // Checkboxes
    "checkbox.background": p.elevated,
    "checkbox.foreground": p.accent,
    "checkbox.border": p.borderStrong,
    "checkbox.selectBackground": p.elevated,
    "checkbox.selectBorder": p.accent,
    "checkbox.disabled.background": withAlpha(p.elevated, p.opacity.disabled),
    "checkbox.disabled.foreground": disabled,

    // Radio buttons
    "radio.activeBackground": p.accentSoft,
    "radio.activeForeground": p.accent,
    "radio.activeBorder": p.accent,
    "radio.inactiveBackground": p.elevated,
    "radio.inactiveForeground": p.muted,
    "radio.inactiveBorder": p.border,
    "radio.inactiveHoverBackground": p.elevatedHover,

    // Settings inputs
    "settings.textInputBackground": p.elevated,
    "settings.textInputForeground": p.text,
    "settings.textInputBorder": p.border,
    "settings.numberInputBackground": p.elevated,
    "settings.numberInputForeground": p.text,
    "settings.numberInputBorder": p.border,
    "settings.dropdownBackground": p.elevated,
    "settings.dropdownForeground": p.text,
    "settings.dropdownBorder": p.border,
    "settings.dropdownListBorder": p.border,
    "settings.checkboxBackground": p.elevated,
    "settings.checkboxForeground": p.accent,
    "settings.checkboxBorder": p.borderStrong,

    // Scrollbars
    "scrollbar.shadow": p.shadow,
    "scrollbarSlider.background": withAlpha(p.scrollbar, 0.4),
    "scrollbarSlider.hoverBackground": withAlpha(p.scrollbar, 0.6),
    "scrollbarSlider.activeBackground": withAlpha(p.accent, 0.4),

    // Lists: active selection
    "list.activeSelectionBackground": p.selection,
    "list.activeSelectionForeground": p.selectionText,
    "list.activeSelectionIconForeground": p.selectionText,
    "quickInputList.focusBackground": p.selection,
    "quickInputList.focusForeground": p.selectionText,
    "quickInputList.focusIconForeground": p.selectionText,
    "menu.selectionBackground": p.selection,
    "menu.selectionForeground": p.selectionText,
    "editorActionList.focusBackground": p.selection,
    "editorActionList.focusForeground": p.selectionText,
    "peekViewResult.selectionBackground": p.selection,
    "peekViewResult.selectionForeground": p.selectionText,

    // Lists: inactive selection, focus and hover
    "list.inactiveSelectionBackground": p.elevated,
    "list.inactiveSelectionForeground": p.text,
    "list.inactiveSelectionIconForeground": p.text,
    "list.focusBackground": p.elevated,
    "list.focusForeground": p.text,
    "list.inactiveFocusBackground": p.elevated,
    "list.hoverBackground": p.elevated,
    "list.hoverForeground": p.text,

    // Lists: outlines, highlights and drops
    "list.focusOutline": p.accentLine,
    "list.focusAndSelectionOutline": p.accentLine,
    "list.inactiveFocusOutline": p.border,
    "list.highlightForeground": p.accent,
    "list.focusHighlightForeground": p.accent,
    "list.dropBackground": withAlpha(p.accent, 0.1),
    "list.dropBetweenBackground": p.accent,
    "list.deemphasizedForeground": p.muted,
    "list.invalidItemForeground": p.danger,

    // Lists: filtering
    "list.filterMatchBackground": withAlpha(p.warning, 0.15),
    "list.filterMatchBorder": withAlpha(p.warning, 0.5),
    "listFilterWidget.background": p.elevated,
    "listFilterWidget.outline": p.accentLine,
    "listFilterWidget.noMatchesOutline": p.danger,
    "listFilterWidget.shadow": p.shadow,

    // Trees and tables
    "tree.indentGuidesStroke": p.borderStrong,
    "tree.inactiveIndentGuidesStroke": p.border,
    "tree.tableColumnsBorder": p.border,
    "tree.tableOddRowsBackground": withAlpha(p.elevated, 0.5),
    "keybindingTable.headerBackground": p.surface,
    "keybindingTable.rowsBackground": withAlpha(p.elevated, 0.5),

    // Floating UI: Quick Open
    "quickInput.background": p.elevated,
    "quickInput.foreground": p.text,
    "quickInputTitle.background": p.surface,

    // Floating UI: menus
    "menu.background": p.elevated,
    "menu.foreground": p.text,
    "menu.border": p.border,
    "menu.separatorBackground": p.border,

    // Floating UI: editor widgets
    "editorWidget.background": p.elevated,
    "editorWidget.foreground": p.text,
    "editorWidget.border": p.border,
    "editorWidget.resizeBorder": p.accentLine,
    "simpleFindWidget.sashBorder": p.border,

    // Floating UI: hovers
    "editorHoverWidget.background": p.elevated,
    "editorHoverWidget.foreground": p.text,
    "editorHoverWidget.border": p.border,
    "editorHoverWidget.highlightForeground": p.accent,
    "editorHoverWidget.statusBarBackground": p.surface,

    // Floating UI: action lists and the debug toolbar
    "editorActionList.background": p.elevated,
    "editorActionList.foreground": p.text,
    "debugToolBar.background": p.elevated,
    "debugToolBar.border": p.border,

    // Floating UI: notifications
    "notifications.background": p.elevated,
    "notifications.foreground": p.text,
    "notifications.border": p.border,
    "notificationToast.border": p.border,
    "notificationCenter.border": p.border,
    "notificationCenterHeader.background": p.surface,
    "notificationCenterHeader.foreground": p.text,
    "notificationLink.foreground": p.accentMuted,

    // Suggestions
    "editorSuggestWidget.background": p.elevated,
    "editorSuggestWidget.foreground": p.textSecondary,
    "editorSuggestWidget.border": p.border,
    "editorSuggestWidget.highlightForeground": p.accent,
    "editorSuggestWidget.focusHighlightForeground": p.accent,
    "editorSuggestWidget.selectedBackground": p.selection,
    "editorSuggestWidget.selectedForeground": p.bright,
    "editorSuggestWidget.selectedIconForeground": p.accent,
    "editorSuggestWidgetStatus.foreground": p.muted,

    // Pickers
    "pickerGroup.border": p.border,
    "pickerGroup.foreground": p.accent,

    // Keybinding labels
    "keybindingLabel.background": p.surface,
    "keybindingLabel.foreground": p.text,
    "keybindingLabel.border": p.border,
    "keybindingLabel.bottomBorder": p.borderStrong,

    // Peek view
    "peekView.border": p.accentLine,
    "peekViewTitle.background": p.elevated,
    "peekViewTitleLabel.foreground": p.bright,
    "peekViewTitleDescription.foreground": p.muted,
    "peekViewEditor.background": p.surface,
    "peekViewEditorGutter.background": p.surface,
    "peekViewEditorStickyScroll.background": p.surface,
    "peekViewEditorStickyScrollGutter.background": p.surface,
    "peekViewEditor.matchHighlightBackground": withAlpha(p.warning, 0.25),
    "peekViewResult.background": p.elevated,
    "peekViewResult.fileForeground": p.text,
    "peekViewResult.lineForeground": p.textSecondary,
    "peekViewResult.matchHighlightBackground": withAlpha(p.warning, 0.25),

    // Settings
    "settings.headerForeground": p.bright,
    "settings.headerBorder": p.border,
    "settings.settingsHeaderHoverForeground": p.text,
    "settings.modifiedItemIndicator": p.accent,
    "settings.sashBorder": p.border,
    "settings.focusedRowBackground": withAlpha(p.elevated, 0.6),
    "settings.focusedRowBorder": p.accentLine,
    "settings.rowHoverBackground": withAlpha(p.elevated, 0.4),

    // Charts
    "charts.foreground": p.text,
    "charts.lines": p.border,
    "charts.red": p.danger,
    "charts.blue": p.info,
    "charts.yellow": p.warning,
    "charts.orange": p.syntax.regexp,
    "charts.green": p.accent,
    "charts.purple": p.chartPurple,
    "ports.iconRunningProcessForeground": p.accent,
  };
}
