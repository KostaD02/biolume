import tokens from "@kostad/brand/tokens.json" with { type: "json" };

import { type Hex, toHex } from "./color.ts";

export type Mode = keyof typeof tokens.theme;

type RoleName = keyof (typeof tokens.theme)[Mode];
export type ThemeRole = Exclude<RoleName, `shadow-${string}`>;

type ColorName<Token> = Token extends `color-${infer Name}`
  ? Name extends `${string}-rgb`
    ? never
    : Name
  : never;
export type PaletteColor = ColorName<keyof typeof tokens.token>;

const colorPrefix = "color-";

function isShadowRole(name: string): boolean {
  return name.startsWith("shadow-");
}

function lookup(map: object, name: string): string | undefined {
  const value: unknown = Object.getOwnPropertyDescriptor(map, name)?.value;
  return typeof value === "string" ? value : undefined;
}

function resolver(mode: Mode): (name: string) => string | undefined {
  const roles = tokens.theme[mode];
  return (reference) => {
    if (!reference.startsWith(tokens.prefix)) {
      return undefined;
    }

    const name = reference.slice(tokens.prefix.length);
    return lookup(roles, name) ?? lookup(tokens.token, name);
  };
}

function themeRoles(mode: Mode): Record<ThemeRole, Hex> {
  const resolve = resolver(mode);
  const roles: Partial<Record<ThemeRole, Hex>> = {};

  for (const [name, value] of Object.entries(tokens.theme[mode])) {
    if (isShadowRole(name)) {
      continue;
    }

    try {
      roles[name as ThemeRole] = toHex(value, resolve);
    } catch (error) {
      throw new Error(`Brand role "${mode}.${name}" is not a color`, { cause: error });
    }
  }

  return roles as Record<ThemeRole, Hex>;
}

function paletteColors(): Record<PaletteColor, Hex> {
  const colors: Partial<Record<PaletteColor, Hex>> = {};

  for (const [name, value] of Object.entries(tokens.token)) {
    if (!name.startsWith(colorPrefix) || name.endsWith("-rgb")) {
      continue;
    }

    colors[name.slice(colorPrefix.length) as PaletteColor] = toHex(value);
  }

  return colors as Record<PaletteColor, Hex>;
}

function shadowColor(mode: Mode): Hex {
  const shadow = tokens.theme[mode]["shadow-md"];
  const color = /rgba?\([^)]*\)|#[0-9a-f]+\b|var\([^)]*\)/i.exec(shadow)?.[0];
  if (!color) {
    throw new Error(`Brand role "${mode}.shadow-md" has no color`);
  }

  return toHex(color, resolver(mode));
}

function opacity(name: string): number {
  const value = Number(lookup(tokens.token, `opacity-${name}`));
  if (Number.isNaN(value) || value < 0 || value > 1) {
    throw new Error(`Brand token "opacity-${name}" is not an opacity`);
  }

  return value;
}

export const brand = {
  version: tokens.version,
  dark: themeRoles("dark"),
  light: themeRoles("light"),
  color: paletteColors(),
  shadow: {
    dark: shadowColor("dark"),
    light: shadowColor("light"),
  },
  opacity: {
    disabled: opacity("disabled"),
    muted: opacity("muted"),
  },
} as const;
