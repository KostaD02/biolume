import type { Hex } from "./color.ts";
import { semanticTokenColors } from "./syntax/semantic-tokens.ts";
import { type TokenColor, tokenColors } from "./syntax/token-colors.ts";
import type { Variant } from "./variants.ts";
import { workbenchColors } from "./workbench/index.ts";

export interface ColorTheme {
  $schema: "vscode://schemas/color-theme";
  name: string;
  type: "dark" | "light";
  semanticHighlighting: true;
  colors: Record<string, Hex>;
  tokenColors: TokenColor[];
  semanticTokenColors: Record<string, Hex>;
}

export function buildTheme(variant: Variant): ColorTheme {
  const { palette } = variant;

  return {
    $schema: "vscode://schemas/color-theme",
    name: variant.label,
    type: variant.uiTheme === "vs" ? "light" : "dark",
    semanticHighlighting: true,
    colors: workbenchColors(palette),
    tokenColors: tokenColors(palette),
    semanticTokenColors: semanticTokenColors(palette),
  };
}
