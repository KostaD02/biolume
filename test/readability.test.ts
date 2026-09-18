import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { colorDistance, type Hex } from "../src/color.ts";
import { buildTheme } from "../src/theme.ts";
import { variants } from "../src/variants.ts";

const minimumDistance = 0.06;

/** Scope pairs that must not look alike. */
const pairs: [string, string][] = [
  // Tags and keys
  ["entity.name.tag", "entity.other.attribute-name"],
  ["entity.other.attribute-name", "string"],
  ["meta.object-literal.key", "string"],
  ["punctuation.definition.tag", "entity.name.tag"],
  ["entity.other.attribute-name.class.css", "support.type.property-name"],

  // Keywords and constants
  ["storage.type", "variable"],
  ["storage.type", "entity.name.type"],
  ["storage.type", "keyword.control"],
  ["storage.type", "variable.other.constant"],
  ["constant.language", "constant.numeric"],

  // Variables, functions and types
  ["variable", "keyword.operator"],
  ["variable", "variable.other.constant"],
  ["variable", "entity.name.function"],
  ["variable", "entity.name.type"],
  ["entity.name.function", "entity.name.type"],
  ["entity.name.type", "variable.other.constant"],

  // Strings
  ["string", "constant.character.escape"],
  ["string", "constant.numeric"],
  ["string", "string.regexp"],
];

for (const variant of variants) {
  describe(`${variant.label} readability`, () => {
    const { tokenColors } = buildTheme(variant);

    function scopeColor(scope: string): Hex {
      const rule = tokenColors.find((candidate) => candidate.scope.includes(scope));
      const foreground = rule?.settings.foreground;
      assert.ok(foreground, `no token rule colors "${scope}"`);
      return foreground;
    }

    for (const [first, second] of pairs) {
      it(`tells ${first} from ${second}`, () => {
        const distance = colorDistance(scopeColor(first), scopeColor(second));
        assert.ok(
          distance >= minimumDistance,
          `${first} and ${second} are ${distance.toFixed(3)} apart, need ${minimumDistance}`,
        );
      });
    }
  });
}
