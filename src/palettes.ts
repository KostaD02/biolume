import { brand, type ThemeRole } from "./brand.ts";
import { ensureContrast, type Hex, mix, withAlpha } from "./color.ts";
import type { SyntaxRole } from "./syntax/roles.ts";

export const ansiColors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "brightBlack",
  "brightRed",
  "brightGreen",
  "brightYellow",
  "brightBlue",
  "brightMagenta",
  "brightCyan",
  "brightWhite",
] as const;

export type AnsiColor = (typeof ansiColors)[number];

export interface Palette {
  /** Editor, terminal, active tab and the flat chrome */
  bg: Hex;
  /** Tab strip, inactive tabs, current line, quotes and code blocks */
  surface: Hex;
  /** Widgets, menus, inputs, dropdowns, notifications, hovers */
  elevated: Hex;
  /** Pressed and active states */
  elevatedHover: Hex;
  border: Hex;
  borderStrong: Hex;
  text: Hex;
  textSecondary: Hex;
  muted: Hex;
  bright: Hex;
  /** Text on accent, warning and danger fills */
  inverse: Hex;
  accent: Hex;
  accentSoft: Hex;
  accentLine: Hex;
  /** Git decorations and links: the accent calmed toward the text around it */
  accentMuted: Hex;
  /** Button fills, dimmed in dark so they don't glare */
  accentFill: Hex;
  /** Active toggle borders and slider fills, dark enough for a `foreground` thumb */
  accentMid: Hex;
  warning: Hex;
  warningSoft: Hex;
  /** Modified files, calmed like `accentMuted` */
  warningMuted: Hex;
  danger: Hex;
  dangerSoft: Hex;
  /** The brand has no info color, so this is the syntax `constant` color */
  info: Hex;
  /** `charts.purple`, dark enough for a `foreground` slider thumb */
  chartPurple: Hex;
  selection: Hex;
  selectionText: Hex;
  /** Line numbers, placeholders, ghost text, ignored files */
  dim: Hex;
  scrollbar: Hex;
  /** Widget and scroll shadows */
  shadow: Hex;
  /** Editor text */
  codeFg: Hex;
  /** Inline code in hovers, previews and settings */
  codeInline: Hex;
  opacity: {
    disabled: number;
    muted: number;
  };
  syntax: Record<SyntaxRole, Hex>;
  ansi: Record<AnsiColor, Hex>;
}

type BrandRoles = Record<ThemeRole, Hex>;

/** Roles drawn as text on `bg`, which must stay readable when `bg` changes */
const textRoles = [
  "text-secondary",
  "text-muted",
  "accent",
  "warning",
  "danger",
  "code-inline-fg",
  "code-comment",
  "code-storage",
  "code-control",
  "code-function",
  "code-type",
  "code-variable",
  "code-constant",
  "code-string",
  "code-number",
  "code-regexp",
  "code-escape",
  "code-punctuation",
  "code-invalid",
] as const satisfies readonly ThemeRole[];

/** Deepens text roles toward the primary text just enough to stay readable on `bg` */
function readableOnBackground(roles: BrandRoles): BrandRoles {
  const readable = { ...roles };

  for (const role of textRoles) {
    const minimum = role === "code-comment" ? 3 : 4.5;
    readable[role] = ensureContrast(
      roles[role],
      roles.bg,
      minimum,
      roles["text-primary"],
    );
  }

  return readable;
}

function syntaxColors(roles: BrandRoles): Record<SyntaxRole, Hex> {
  return {
    text: roles["code-fg"],
    comment: roles["code-comment"],
    storage: roles["code-storage"],
    control: roles["code-control"],
    function: roles["code-function"],
    type: roles["code-type"],
    variable: roles["code-variable"],
    constant: roles["code-constant"],
    string: roles["code-string"],
    number: roles["code-number"],
    regexp: roles["code-regexp"],
    escape: roles["code-escape"],
    punctuation: roles["code-punctuation"],
    invalid: roles["code-invalid"],
  };
}

type SharedFields = Omit<
  Palette,
  | "accentMuted"
  | "accentFill"
  | "accentMid"
  | "warningMuted"
  | "chartPurple"
  | "dim"
  | "scrollbar"
  | "shadow"
  | "ansi"
>;

function sharedFields(roles: BrandRoles): SharedFields {
  const syntax = syntaxColors(roles);

  return {
    bg: roles.bg,
    surface: roles["bg-surface"],
    elevated: roles["bg-elevated"],
    elevatedHover: roles["bg-elevated-hover"],
    border: roles.border,
    borderStrong: roles["border-strong"],
    text: roles["text-primary"],
    textSecondary: roles["text-secondary"],
    muted: roles["text-muted"],
    bright: roles["text-bright"],
    inverse: roles["text-inverse"],
    accent: roles.accent,
    accentSoft: roles["accent-soft"],
    accentLine: roles["accent-line"],
    warning: roles.warning,
    warningSoft: roles["warning-soft"],
    danger: roles.danger,
    dangerSoft: roles["danger-soft"],
    info: syntax.constant,
    selection: roles["selection-bg"],
    selectionText: roles["selection-fg"],
    codeFg: syntax.text,
    codeInline: roles["code-inline-fg"],
    opacity: brand.opacity,
    syntax,
  };
}

const darkFields = sharedFields(brand.dark);

export const dark: Palette = {
  ...darkFields,
  accentMuted: mix(darkFields.accent, darkFields.bg, 0.8),
  accentFill: withAlpha(darkFields.accent, 0.7),
  accentMid: mix(darkFields.accent, darkFields.bg, 0.45),
  warningMuted: mix(darkFields.warning, darkFields.bg, 0.8),
  chartPurple: mix(darkFields.syntax.control, darkFields.bg, 0.65),
  dim: withAlpha(brand.dark["text-muted"], brand.opacity.muted),
  scrollbar: brand.dark["scrollbar-thumb"],
  shadow: brand.shadow.dark,
  ansi: {
    black: brand.color["navy-lightest"],
    red: darkFields.danger,
    green: darkFields.accent,
    yellow: darkFields.warning,
    blue: darkFields.syntax.storage,
    magenta: darkFields.syntax.control,
    cyan: darkFields.syntax.type,
    white: darkFields.text,
    brightBlack: darkFields.muted,
    brightRed: darkFields.syntax.regexp,
    brightGreen: darkFields.syntax.number,
    brightYellow: darkFields.syntax.function,
    brightBlue: darkFields.syntax.variable,
    brightMagenta: darkFields.syntax.control,
    brightCyan: darkFields.syntax.constant,
    brightWhite: darkFields.bright,
  },
};

/** Brand paper glares as a full editor, so every layer steps one brand shade darker */
const lightFields = sharedFields(
  readableOnBackground({
    ...brand.light,
    bg: brand.light.border,
    "bg-surface": brand.light["bg-elevated-hover"],
    border: brand.light["border-strong"],
    "border-strong": brand.color["slate-light"],
  }),
);

export const light: Palette = {
  ...lightFields,
  accentMuted: lightFields.accent,
  accentFill: lightFields.accent,
  accentMid: mix(lightFields.accent, lightFields.bg, 0.7),
  warningMuted: lightFields.warning,
  chartPurple: mix(lightFields.syntax.control, lightFields.bg, 0.7),
  dim: lightFields.muted,
  scrollbar: lightFields.muted,
  shadow: brand.shadow.light,
  ansi: {
    black: lightFields.text,
    red: lightFields.danger,
    green: lightFields.accent,
    yellow: lightFields.warning,
    blue: lightFields.syntax.storage,
    magenta: lightFields.syntax.control,
    cyan: lightFields.syntax.constant,
    white: lightFields.textSecondary,
    brightBlack: lightFields.muted,
    brightRed: lightFields.syntax.regexp,
    brightGreen: lightFields.syntax.number,
    brightYellow: lightFields.syntax.function,
    brightBlue: lightFields.syntax.variable,
    brightMagenta: lightFields.syntax.control,
    brightCyan: lightFields.syntax.type,
    brightWhite: lightFields.muted,
  },
};
