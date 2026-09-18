import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import pkg from "../package.json" with { type: "json" };
import { brand } from "../src/brand.ts";
import { buildTheme } from "../src/theme.ts";
import { themeFileName, variants } from "../src/variants.ts";

const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const ownerPatterns = [/konstantine/i, /datunishvili/i, /kostad/i, /\bKD\b/];

describe("package", () => {
  it("contributes one theme per variant", () => {
    assert.deepEqual(
      pkg.contributes.themes,
      variants.map((variant) => ({
        label: variant.label,
        uiTheme: variant.uiTheme,
        path: `./dist/${themeFileName(variant)}`,
      })),
    );
  });

  it("uses the brand navy for the gallery banner", () => {
    assert.equal(pkg.galleryBanner.color, brand.dark.bg);
  });

  it("names the extension ID in the README", () => {
    assert.ok(readme.includes(`${pkg.publisher}.${pkg.name}`));
  });

  it("keeps the owner's name out of the public name", () => {
    const title = readme.split("\n").find((line) => line.startsWith("# "));
    assert.ok(title, "README.md has no title");

    const publicNames = {
      name: pkg.name,
      displayName: pkg.displayName,
      description: pkg.description,
      "README title": title,
      ...Object.fromEntries(
        variants.flatMap((variant) => [
          [`${variant.id} label`, variant.label],
          [`${variant.id} theme name`, buildTheme(variant).name],
        ]),
      ),
    };

    for (const [field, value] of Object.entries(publicNames)) {
      for (const pattern of ownerPatterns) {
        assert.doesNotMatch(value, pattern, `${field} matches ${String(pattern)}`);
      }
    }
  });
});
