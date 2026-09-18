import { withAlpha } from "../color.ts";
import type { Palette } from "../palettes.ts";
import type { WorkbenchColors } from "./index.ts";

export function terminal(p: Palette): WorkbenchColors {
  const transparent = withAlpha(p.bg, 0);

  return {
    // Basics
    "terminal.background": p.bg,
    "terminal.foreground": p.text,
    "terminal.border": p.border,
    "terminal.initialHintForeground": p.dim,

    // Selection and find
    "terminal.selectionBackground": withAlpha(p.accent, 0.2),
    "terminal.inactiveSelectionBackground": withAlpha(p.accent, 0.1),
    "terminal.findMatchBackground": withAlpha(p.warning, 0.3),
    "terminal.findMatchBorder": p.warning,
    "terminal.findMatchHighlightBackground": withAlpha(p.warning, 0.15),

    // Hover, drop and tabs
    "terminal.hoverHighlightBackground": withAlpha(p.bright, 0.08),
    "terminal.dropBackground": withAlpha(p.accent, 0.1),
    "terminal.tab.activeBorder": p.accent,

    // Cursor
    "terminalCursor.foreground": p.accent,
    "terminalCursor.background": p.bg,

    // Command decorations
    "terminalCommandDecoration.defaultBackground": p.muted,
    "terminalCommandDecoration.successBackground": p.accent,
    "terminalCommandDecoration.errorBackground": p.danger,
    "terminalCommandGuide.foreground": p.borderStrong,

    // Overview ruler
    "terminalOverviewRuler.border": transparent,
    "terminalOverviewRuler.cursorForeground": withAlpha(p.accent, 0.6),
    "terminalOverviewRuler.findMatchForeground": withAlpha(p.warning, 0.6),

    // Sticky scroll
    "terminalStickyScroll.background": p.bg,
    "terminalStickyScrollHover.background": p.elevated,

    // ANSI colors
    "terminal.ansiBlack": p.ansi.black,
    "terminal.ansiRed": p.ansi.red,
    "terminal.ansiGreen": p.ansi.green,
    "terminal.ansiYellow": p.ansi.yellow,
    "terminal.ansiBlue": p.ansi.blue,
    "terminal.ansiMagenta": p.ansi.magenta,
    "terminal.ansiCyan": p.ansi.cyan,
    "terminal.ansiWhite": p.ansi.white,
    "terminal.ansiBrightBlack": p.ansi.brightBlack,
    "terminal.ansiBrightRed": p.ansi.brightRed,
    "terminal.ansiBrightGreen": p.ansi.brightGreen,
    "terminal.ansiBrightYellow": p.ansi.brightYellow,
    "terminal.ansiBrightBlue": p.ansi.brightBlue,
    "terminal.ansiBrightMagenta": p.ansi.brightMagenta,
    "terminal.ansiBrightCyan": p.ansi.brightCyan,
    "terminal.ansiBrightWhite": p.ansi.brightWhite,
  };
}
