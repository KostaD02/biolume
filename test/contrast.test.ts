import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { composite, contrast, type Hex } from "../src/color.ts";
import { ansiColors } from "../src/palettes.ts";
import { syntaxRoles } from "../src/syntax/roles.ts";
import { buildTheme } from "../src/theme.ts";
import { variants } from "../src/variants.ts";

const normal = 4.5;
const dimmed = 3;
const slider = 2;

/** Dimmed text, as [foreground, background]. */
const dimmedPairs: [string, string][] = [
  ["editorLineNumber.foreground", "editor.background"],
  ["editorGhostText.foreground", "editor.background"],
  ["gitDecoration.ignoredResourceForeground", "sideBar.background"],
  ["tab.inactiveForeground", "tab.inactiveBackground"],
  ["input.placeholderForeground", "input.background"],
];

/** Normal text, as [background, foregrounds]. */
const sharedBackgrounds: [string, string[]][] = [
  [
    "editor.background",
    [
      "editor.foreground",
      "editorLineNumber.activeForeground",
      "editorInlayHint.foreground",
      "editorCodeLens.foreground",
      "textLink.foreground",
      "textLink.activeForeground",
    ],
  ],
  [
    "sideBar.background",
    [
      "foreground",
      "descriptionForeground",
      "sideBar.foreground",
      "gitDecoration.addedResourceForeground",
      "gitDecoration.untrackedResourceForeground",
      "gitDecoration.modifiedResourceForeground",
      "gitDecoration.deletedResourceForeground",
      "gitDecoration.renamedResourceForeground",
    ],
  ],
  ["panel.background", ["panelTitle.activeForeground", "panelTitle.inactiveForeground"]],
  ["editorWidget.background", ["button.secondaryForeground"]],
];

/** Normal text on the matching `background` key. */
const ownBackgrounds = [
  "titleBar.activeForeground",
  "statusBar.foreground",
  "statusBar.debuggingForeground",
  "statusBarItem.remoteForeground",
  "tab.activeForeground",
  "breadcrumb.foreground",
  "button.foreground",
  "badge.foreground",
  "activityBarBadge.foreground",
  "list.activeSelectionForeground",
  "list.inactiveSelectionForeground",
  "list.hoverForeground",
  "input.foreground",
  "dropdown.foreground",
  "editorWidget.foreground",
  "editorSuggestWidget.foreground",
  "editorSuggestWidget.selectedForeground",
  "editorHoverWidget.foreground",
  "quickInput.foreground",
  "quickInputList.focusForeground",
  "menu.foreground",
  "menu.selectionForeground",
  "notifications.foreground",
  "textPreformat.foreground",
  "terminal.foreground",
];

/** Colored names and links that shouldn't outshine plain text, like Dark+'s */
const calmForegrounds = [
  "gitDecoration.addedResourceForeground",
  "gitDecoration.untrackedResourceForeground",
  "gitDecoration.modifiedResourceForeground",
  "gitDecoration.stageModifiedResourceForeground",
  "textLink.foreground",
];

/** Claude Code's effort slider: a `foreground` thumb on these fills, on an `inlineChatInput.border` track */
const sliderFills = ["inputOption.activeBorder", "charts.purple"];

function backgroundKey(foregroundKey: string): string {
  return foregroundKey
    .replace(/foreground$/, "background")
    .replace(/Foreground$/, "Background");
}

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

for (const variant of variants) {
  describe(`${variant.label} contrast`, () => {
    const theme = buildTheme(variant);

    function color(key: string): Hex {
      const value = theme.colors[key];
      assert.ok(value, `"${key}" is not set`);
      return value;
    }

    function assertContrast(
      foreground: string,
      background: string,
      minimum: number,
    ): void {
      const backdrop = composite(color(background), color("editor.background"));
      const ratio = contrast(color(foreground), backdrop);
      assert.ok(
        ratio >= minimum,
        `${foreground} on ${background} is ${ratio.toFixed(2)}, needs ${minimum}`,
      );
    }

    it("keeps syntax colors readable on the editor background", () => {
      const background = color("editor.background");
      for (const role of syntaxRoles) {
        const minimum = role === "comment" ? dimmed : normal;
        const ratio = contrast(variant.palette.syntax[role], background);
        assert.ok(
          ratio >= minimum,
          `syntax ${role} is ${ratio.toFixed(2)}, needs ${minimum}`,
        );
      }
    });

    it("keeps dimmed UI text readable", () => {
      for (const [foreground, background] of dimmedPairs) {
        assertContrast(foreground, background, dimmed);
      }
    });

    it("keeps UI text readable", () => {
      for (const [background, foregrounds] of sharedBackgrounds) {
        for (const foreground of foregrounds) {
          assertContrast(foreground, background, normal);
        }
      }

      for (const foreground of ownBackgrounds) {
        assertContrast(foreground, backgroundKey(foreground), normal);
      }
    });

    it("keeps git decorations and links calmer than text", () => {
      const background = color("sideBar.background");
      const limit = contrast(variant.palette.text, background);
      for (const key of calmForegrounds) {
        const ratio = contrast(color(key), background);
        assert.ok(
          ratio <= limit,
          `${key} is ${ratio.toFixed(2)}, brighter than text at ${limit.toFixed(2)}`,
        );
      }
    });

    it("keeps slider thumbs and fills visible", () => {
      for (const fill of sliderFills) {
        assertContrast("foreground", fill, slider);
        assertContrast(fill, "inlineChatInput.border", slider);
      }
    });

    it("keeps ANSI colors readable on the terminal background", () => {
      for (const name of ansiColors) {
        if (name === "black" && theme.type === "dark") {
          continue;
        }

        assertContrast(`terminal.ansi${capitalize(name)}`, "terminal.background", normal);
      }
    });
  });
}
