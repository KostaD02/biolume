import type { Hex } from "../color.ts";
import type { Palette } from "../palettes.ts";

/** Dark+ semantic colors; other semantic tokens fall back to the TextMate scopes. */
export function semanticTokenColors({ syntax }: Palette): Record<string, Hex> {
  return {
    newOperator: syntax.control,
    stringLiteral: syntax.string,
    customLiteral: syntax.function,
    numberLiteral: syntax.number,
  };
}
