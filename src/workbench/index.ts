import type { Hex } from "../color.ts";
import type { Palette } from "../palettes.ts";
import { chrome } from "./chrome.ts";
import { controls } from "./controls.ts";
import { diagnostics } from "./diagnostics.ts";
import { editor } from "./editor.ts";
import { scm } from "./scm.ts";
import { terminal } from "./terminal.ts";

export type WorkbenchColors = Record<string, Hex>;

/** Keyed by file name, so a duplicate key can name both files. */
const areas: Record<string, (palette: Palette) => WorkbenchColors> = {
  editor,
  diagnostics,
  chrome,
  controls,
  scm,
  terminal,
};

export function workbenchColors(palette: Palette): WorkbenchColors {
  const owners = new Map<string, string>();
  const colors = new Map<string, Hex>();

  for (const [file, area] of Object.entries(areas)) {
    for (const [key, color] of Object.entries(area(palette))) {
      const owner = owners.get(key);
      if (owner) {
        throw new Error(`"${key}" is set in both ${owner}.ts and ${file}.ts`);
      }

      owners.set(key, file);
      colors.set(key, color);
    }
  }

  const keys = [...colors.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return Object.fromEntries(keys.map((key) => [key, colors.get(key)])) as WorkbenchColors;
}
