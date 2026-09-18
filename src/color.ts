export type Hex = `#${string}`;

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type ColorResolver = (name: string) => string | undefined;

const hexPattern = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const rgbPattern = /^rgba?\(\s*([^)]*)\)$/i;
const varPattern = /^var\(\s*--([\w-]+)\s*\)$/;
const decimalPattern = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
const maxReferenceDepth = 10;

export function isHex(value: string): value is Hex {
  return hexPattern.test(value);
}

export function parseHex(color: string): Rgba {
  if (!isHex(color)) {
    throw new Error(`Invalid hex color: ${color}`);
  }

  let digits = color.slice(1);
  if (digits.length <= 4) {
    digits = [...digits].map((digit) => digit + digit).join("");
  }

  const channel = (index: number): number =>
    Number.parseInt(digits.slice(index, index + 2), 16);

  return {
    r: channel(0),
    g: channel(2),
    b: channel(4),
    a: digits.length === 8 ? channel(6) / 255 : 1,
  };
}

function toByte(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function byteHex(value: number): string {
  return toByte(value).toString(16).padStart(2, "0");
}

export function formatHex({ r, g, b, a }: Rgba): Hex {
  const alpha = toByte(a * 255);
  const rgb = `#${byteHex(r)}${byteHex(g)}${byteHex(b)}` as const;
  return alpha === 255 ? rgb : `${rgb}${byteHex(alpha)}`;
}

function parseRgb(value: string): Hex | undefined {
  const match = rgbPattern.exec(value);
  if (!match?.[1]) {
    return undefined;
  }

  const parts = match[1].split(",").map((part) => part.trim());
  if (parts.length !== 3 && parts.length !== 4) {
    return undefined;
  }

  if (!parts.every((part) => decimalPattern.test(part))) {
    return undefined;
  }

  const [r = 0, g = 0, b = 0, a = 1] = parts.map(Number);
  if (r > 255 || g > 255 || b > 255 || a > 1) {
    return undefined;
  }

  return formatHex({ r, g, b, a });
}

export function toHex(value: string, resolve?: ColorResolver): Hex {
  let current = value.trim();

  for (let depth = 0; depth <= maxReferenceDepth; depth++) {
    if (isHex(current)) {
      return formatHex(parseHex(current));
    }

    const rgb = parseRgb(current);
    if (rgb) {
      return rgb;
    }

    const reference = varPattern.exec(current)?.[1];
    if (!reference) {
      const source = current === value.trim() ? "" : ` (from ${value})`;
      throw new Error(`Unsupported color value: ${current}${source}`);
    }

    const resolved = resolve?.(reference);
    if (resolved === undefined) {
      throw new Error(`Unknown color reference: --${reference}`);
    }

    current = resolved.trim();
  }

  throw new Error(`Color reference is too deep or circular: ${value}`);
}

export function withAlpha(color: Hex, alpha: number): Hex {
  const rgba = parseHex(color);
  return formatHex({ ...rgba, a: rgba.a * alpha });
}

export function mix(color: Hex, other: Hex, amount: number): Hex {
  return composite(withAlpha(color, amount), other);
}

export function composite(color: Hex, background: Hex): Hex {
  const top = parseHex(color);
  const bottom = parseHex(background);
  const blend = (front: number, back: number): number =>
    front * top.a + back * (1 - top.a);

  return formatHex({
    r: blend(top.r, bottom.r),
    g: blend(top.g, bottom.g),
    b: blend(top.b, bottom.b),
    a: 1,
  });
}

function linearize(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(color: Hex): number {
  const { r, g, b } = parseHex(color);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrast(color: Hex, background: Hex): number {
  const foreground = luminance(composite(color, background));
  const back = luminance(background);
  const lighter = Math.max(foreground, back);
  const darker = Math.min(foreground, back);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ensureContrast(
  color: Hex,
  background: Hex,
  minimum: number,
  ink: Hex,
): Hex {
  for (let step = 0; step <= 100; step++) {
    const candidate = mix(ink, color, step / 100);
    if (contrast(candidate, background) >= minimum) {
      return candidate;
    }
  }

  throw new Error(`${color} can't reach ${minimum} contrast on ${background}`);
}

export interface OkLab {
  l: number;
  a: number;
  b: number;
}

export function oklab(color: Hex): OkLab {
  const { r, g, b } = parseHex(color);
  const red = linearize(r);
  const green = linearize(g);
  const blue = linearize(b);

  const l = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const m = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const s = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);

  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

export function colorDistance(first: Hex, second: Hex): number {
  const a = oklab(first);
  const b = oklab(second);
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b);
}
