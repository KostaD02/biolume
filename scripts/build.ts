import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildTheme } from "../src/theme.ts";
import { themeFileName, variants } from "../src/variants.ts";
import { log } from "./log.ts";

const isSilent = process.argv.includes("--silent");
const outputDir = path.join(import.meta.dirname, "..", "dist");

await mkdir(outputDir, { recursive: true });

for (const variant of variants) {
  const fileName = themeFileName(variant);

  try {
    const theme = buildTheme(variant);
    await writeFile(
      path.join(outputDir, fileName),
      `${JSON.stringify(theme, null, 2)}\n`,
    );
    log(`Built ${variant.label}: dist/${fileName}`, isSilent);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Failed to build ${variant.label}: ${message}`, false, true);
    process.exitCode = 1;
  }
}
