import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { brand, type Mode } from "../src/brand.ts";
import {
  colorDistance,
  composite,
  contrast,
  ensureContrast,
  isHex,
  mix,
  toHex,
  withAlpha,
} from "../src/color.ts";

const modes: readonly Mode[] = ["dark", "light"];

describe("toHex", () => {
  it("normalizes hex colors", () => {
    assert.equal(toHex("#fff"), "#ffffff");
    assert.equal(toHex("#64FFDA"), "#64ffda");
    assert.equal(toHex("#64ffdaff"), "#64ffda");
    assert.equal(toHex("#0a192f80"), "#0a192f80");
  });

  it("converts rgb() and rgba()", () => {
    assert.equal(toHex("rgb(10, 25, 47)"), "#0a192f");
    assert.equal(toHex("rgba(100, 255, 218, 0.08)"), "#64ffda14");
    assert.equal(toHex("rgba(100, 255, 218, 0.3)"), "#64ffda4d");
  });

  it("resolves var() references", () => {
    const tokens: Record<string, string> = {
      "kd-success": "var(--kd-accent)",
      "kd-accent": "#64ffda",
    };
    assert.equal(
      toHex("var(--kd-success)", (name) => tokens[name]),
      "#64ffda",
    );
  });

  it("throws for unsupported values and bad references", () => {
    assert.throws(() => toHex("calc(1px)"), /Unsupported color value/);
    assert.throws(() => toHex("rgb(1, 2, 3, )"), /Unsupported color value/);
    assert.throws(
      () => toHex("var(--kd-missing)", () => undefined),
      /Unknown color reference/,
    );
    assert.throws(
      () => toHex("var(--kd-loop)", () => "var(--kd-loop)"),
      /too deep or circular/,
    );
  });
});

describe("withAlpha", () => {
  it("multiplies the existing alpha", () => {
    assert.equal(withAlpha("#64ffda", 0.3), "#64ffda4d");
    assert.equal(withAlpha("#64ffda80", 0.5), "#64ffda40");
  });
});

describe("mix", () => {
  it("blends the color into the other one", () => {
    assert.equal(mix("#ffffff", "#000000", 0.5), "#808080");
    assert.equal(mix("#64ffda", "#0a192f", 1), "#64ffda");
    assert.equal(mix("#64ffda", "#0a192f", 0), "#0a192f");
  });
});

describe("contrast", () => {
  it("computes the WCAG contrast ratio", () => {
    assert.equal(contrast("#000000", "#ffffff").toFixed(2), "21.00");
    assert.equal(contrast("#777777", "#ffffff").toFixed(2), "4.48");
  });

  it("blends translucent colors over the background", () => {
    assert.equal(composite("#ffffff80", "#000000"), "#808080");
    assert.equal(contrast("#00000000", "#ffffff").toFixed(2), "1.00");
  });
});

describe("ensureContrast", () => {
  it("keeps colors that already pass", () => {
    assert.equal(ensureContrast("#0a192f", "#ffffff", 4.5, "#000000"), "#0a192f");
  });

  it("mixes in just enough ink to pass", () => {
    const color = ensureContrast("#888888", "#ffffff", 4.5, "#000000");
    assert.ok(contrast(color, "#ffffff") >= 4.5);
    assert.ok(contrast(mix("#ffffff", color, 0.02), "#ffffff") < 4.5);
  });

  it("throws when even the ink can't pass", () => {
    assert.throws(
      () => ensureContrast("#eeeeee", "#ffffff", 4.5, "#dddddd"),
      /can't reach/,
    );
  });
});

describe("colorDistance", () => {
  it("measures distance in OKLab", () => {
    assert.equal(colorDistance("#64ffda", "#64ffda"), 0);
    assert.equal(colorDistance("#000000", "#ffffff").toFixed(2), "1.00");
    assert.ok(colorDistance("#ecc48d", "#ffcb8b") < colorDistance("#ecc48d", "#ffd166"));
  });
});

describe("brand", () => {
  it("converts every theme role and palette color to hex", () => {
    for (const mode of modes) {
      for (const [role, value] of Object.entries(brand[mode])) {
        assert.ok(isHex(value), `${mode}.${role} is ${value}`);
      }
      assert.ok(isHex(brand.shadow[mode]), `shadow.${mode} is ${brand.shadow[mode]}`);
    }

    for (const [name, value] of Object.entries(brand.color)) {
      assert.ok(isHex(value), `color.${name} is ${value}`);
    }
  });

  it("resolves success to the accent", () => {
    for (const mode of modes) {
      assert.equal(brand[mode].success, brand[mode].accent);
    }
  });

  it("leaves out shadow roles and rgb duplicates", () => {
    for (const mode of modes) {
      const shadows = Object.keys(brand[mode]).filter((role) =>
        role.startsWith("shadow-"),
      );
      assert.deepEqual(shadows, []);
    }

    const rgb = Object.keys(brand.color).filter((name) => name.endsWith("-rgb"));
    assert.deepEqual(rgb, []);
  });

  it("has the known brand values", () => {
    assert.equal(brand.dark.bg, "#0a192f");
    assert.equal(brand.dark.accent, "#64ffda");
    assert.equal(brand.dark["accent-soft"], "#64ffda14");
    assert.equal(brand.light["bg-elevated"], "#ffffff");
    assert.equal(brand.dark["code-storage"], "#82aaff");
    assert.equal(brand.light["code-bg"], "#ffffff");
  });
});
