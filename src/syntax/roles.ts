export const syntaxRoles = [
  "text",
  "comment",
  "storage",
  "control",
  "function",
  "type",
  "variable",
  "constant",
  "string",
  "number",
  "regexp",
  "escape",
  "punctuation",
  "invalid",
] as const;

export type SyntaxRole = (typeof syntaxRoles)[number];
