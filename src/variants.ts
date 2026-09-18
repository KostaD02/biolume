import { dark, light, type Palette } from "./palettes.ts";

export interface Variant {
  id: string;
  label: string;
  uiTheme: "vs" | "vs-dark";
  palette: Palette;
}

export const variants: readonly Variant[] = [
  { id: "biolume", label: "Biolume", uiTheme: "vs-dark", palette: dark },
  { id: "biolume-light", label: "Biolume Light", uiTheme: "vs", palette: light },
];

export function themeFileName(variant: Variant): string {
  return `${variant.id}-color-theme.json`;
}
