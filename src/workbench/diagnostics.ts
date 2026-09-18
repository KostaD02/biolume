import { withAlpha } from "../color.ts";
import type { Palette } from "../palettes.ts";
import type { WorkbenchColors } from "./index.ts";

export function diagnostics(p: Palette): WorkbenchColors {
  return {
    // Errors, warnings, info and hints
    errorForeground: p.danger,
    "editorError.foreground": p.danger,
    "editorWarning.foreground": p.warning,
    "editorInfo.foreground": p.info,
    "editorHint.foreground": withAlpha(p.textSecondary, 0.7),
    "problemsErrorIcon.foreground": p.danger,
    "problemsWarningIcon.foreground": p.warning,
    "problemsInfoIcon.foreground": p.info,
    "list.errorForeground": p.danger,
    "list.warningForeground": p.warning,
    "notificationsErrorIcon.foreground": p.danger,
    "notificationsWarningIcon.foreground": p.warning,
    "notificationsInfoIcon.foreground": p.info,

    // Overview ruler and minimap
    "editorOverviewRuler.errorForeground": withAlpha(p.danger, 0.7),
    "editorOverviewRuler.warningForeground": withAlpha(p.warning, 0.7),
    "editorOverviewRuler.infoForeground": withAlpha(p.info, 0.7),
    "minimap.errorHighlight": withAlpha(p.danger, 0.7),
    "minimap.warningHighlight": withAlpha(p.warning, 0.7),
    "minimap.infoHighlight": withAlpha(p.info, 0.7),

    // Marker navigation
    "editorMarkerNavigation.background": p.elevated,
    "editorMarkerNavigationError.background": p.danger,
    "editorMarkerNavigationWarning.background": p.warning,
    "editorMarkerNavigationInfo.background": p.info,
    "editorMarkerNavigationError.headerBackground": p.dangerSoft,
    "editorMarkerNavigationWarning.headerBackground": p.warningSoft,
    "editorMarkerNavigationInfo.headerBackground": withAlpha(p.info, 0.1),

    // Input validation
    "inputValidation.errorBackground": p.elevated,
    "inputValidation.errorForeground": p.text,
    "inputValidation.errorBorder": p.danger,
    "inputValidation.warningBackground": p.elevated,
    "inputValidation.warningForeground": p.text,
    "inputValidation.warningBorder": p.warning,
    "inputValidation.infoBackground": p.elevated,
    "inputValidation.infoForeground": p.text,
    "inputValidation.infoBorder": p.info,

    // Status bar items and activity bar badges
    "statusBarItem.errorBackground": p.danger,
    "statusBarItem.errorForeground": p.inverse,
    "statusBarItem.errorHoverBackground": withAlpha(p.danger, 0.85),
    "statusBarItem.errorHoverForeground": p.inverse,
    "statusBarItem.warningBackground": p.warning,
    "statusBarItem.warningForeground": p.inverse,
    "statusBarItem.warningHoverBackground": withAlpha(p.warning, 0.85),
    "statusBarItem.warningHoverForeground": p.inverse,
    "activityErrorBadge.background": p.danger,
    "activityErrorBadge.foreground": p.inverse,
    "activityWarningBadge.background": p.warning,
    "activityWarningBadge.foreground": p.inverse,

    // Debug exception widget
    "debugExceptionWidget.background": p.elevated,
    "debugExceptionWidget.border": p.danger,

    // Testing
    "testing.iconPassed": p.accent,
    "testing.iconFailed": p.danger,
    "testing.iconErrored": p.danger,
    "testing.iconQueued": p.warning,
    "testing.iconUnset": p.muted,
    "testing.iconSkipped": p.muted,
    "testing.runAction": p.accent,
    "testing.message.error.lineBackground": p.dangerSoft,
    "testing.message.error.badgeBackground": p.danger,
    "testing.message.error.badgeBorder": p.danger,
    "testing.message.error.badgeForeground": p.inverse,
  };
}
