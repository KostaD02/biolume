import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isHex } from "../src/color.ts";
import { syntaxRoles } from "../src/syntax/roles.ts";
import { buildTheme } from "../src/theme.ts";
import { variants } from "../src/variants.ts";

const requiredKeys = [
  "editor.background",
  "editor.foreground",
  "editorCursor.foreground",
  "editor.selectionBackground",
  "editorLineNumber.foreground",
  "sideBar.background",
  "activityBar.background",
  "statusBar.background",
  "titleBar.activeBackground",
  "tab.activeBackground",
  "tab.inactiveBackground",
  "panel.background",
  "editorWidget.background",
  "input.background",
  "button.background",
  "list.activeSelectionBackground",
  "focusBorder",
  "diffEditor.insertedTextBackground",
  "diffEditor.removedTextBackground",
  "gitDecoration.modifiedResourceForeground",
  "terminal.background",
  "terminal.ansiBlack",
  "terminal.ansiBrightWhite",
];

for (const variant of variants) {
  describe(`${variant.label} theme`, () => {
    const theme = buildTheme(variant);

    it("uses the variant label and ui theme", () => {
      assert.equal(theme.name, variant.label);
      assert.equal(theme.type, variant.uiTheme === "vs" ? "light" : "dark");
    });

    it("contains only hex colors", () => {
      for (const [key, value] of Object.entries(theme.colors)) {
        assert.ok(isHex(value), `colors["${key}"] is ${value}`);
      }

      for (const rule of theme.tokenColors) {
        const { foreground } = rule.settings;
        if (foreground !== undefined) {
          assert.ok(isHex(foreground), `"${rule.name}" foreground is ${foreground}`);
        }
      }

      for (const [token, value] of Object.entries(theme.semanticTokenColors)) {
        assert.ok(isHex(value), `semanticTokenColors["${token}"] is ${value}`);
      }
    });

    it("sets the essential workbench colors", () => {
      const missing = requiredKeys.filter((key) => !(key in theme.colors));
      assert.deepEqual(missing, []);
    });

    it("lists each TextMate scope in only one rule", () => {
      const seen = new Map<string, string>();
      for (const rule of theme.tokenColors) {
        for (const scope of rule.scope) {
          const previous = seen.get(scope);
          assert.equal(
            previous,
            undefined,
            `"${scope}" is in "${previous}" and "${rule.name}"`,
          );
          seen.set(scope, rule.name);
        }
      }
    });

    it("uses every syntax role in a token rule", () => {
      const foregrounds = new Set(
        theme.tokenColors.map((rule) => rule.settings.foreground),
      );
      const unused = syntaxRoles.filter(
        (role) => !foregrounds.has(variant.palette.syntax[role]),
      );
      assert.deepEqual(unused, []);
    });
  });
}
