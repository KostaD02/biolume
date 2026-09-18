# Contributing to Biolume

Thanks for helping out! A few things to know before you start:

- Every color comes from the [`@kostad/brand`](https://github.com/KostaD02/brand) design tokens.
- The theme files in `dist/` are generated from TypeScript. Edit the files in `src/`, never `dist/`: the next build overwrites them, and git ignores that folder.

## Setup

You need [Node.js](https://nodejs.org/) 22 and pnpm. Corepack, which ships with Node.js, installs the pnpm version pinned in `package.json`:

```sh
corepack enable
pnpm install
```

`pnpm install` also sets up the git hooks.

## How it works

`pnpm build` takes each variant from `src/variants.ts`, turns it into a color theme with `buildTheme()` and writes it to `dist/`.

| Path                                                                 | Does                                                                                |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `src/color.ts`                                                       | Hex parsing and formatting, alpha, blending, WCAG contrast, OKLab distance          |
| `src/brand.ts`                                                       | The only module that reads `@kostad/brand/tokens.json`; converts every color to hex |
| `src/palettes.ts`                                                    | The `Palette` type and the `dark` and `light` palettes (brand roles → editor roles) |
| `src/variants.ts`                                                    | The themes to build: id, label, `uiTheme`, palette                                  |
| `src/theme.ts`                                                       | Builds one color theme object from a variant                                        |
| `src/syntax/roles.ts`                                                | The 14 syntax roles                                                                 |
| `src/syntax/token-colors.ts`                                         | TextMate rules, grouped like Dark+                                                  |
| `src/syntax/semantic-tokens.ts`                                      | Semantic token colors                                                               |
| `src/workbench/index.ts`                                             | Merges the area files into one sorted `colors` object                               |
| `src/workbench/{editor,diagnostics,chrome,controls,scm,terminal}.ts` | UI colors, one file per area                                                        |
| `scripts/build.ts`                                                   | Writes `dist/<id>-color-theme.json` for each variant                                |
| `test/*.test.ts`                                                     | `node:test` suites, run with `tsx --test`                                           |
| `samples/`                                                           | Files in many languages for previewing                                              |
| `dist/`                                                              | Generated output, ignored by git                                                    |
| `assets/`                                                            | `icon.svg`, `icon.png`, `screenshots/`                                              |

## Commands

Run each one with `pnpm <command>`, for example `pnpm build`.

| Command             | What it does                                                                                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prepare`           | Installs the git hooks with husky. Runs on its own after `pnpm install`.                                                                                                                            |
| `build`             | Writes `dist/<id>-color-theme.json` for each variant.                                                                                                                                               |
| `build:silent`      | Same as `build`, without logs.                                                                                                                                                                      |
| `watch`             | Runs `build` again whenever a file changes.                                                                                                                                                         |
| `vscode:prepublish` | Runs `build:silent`. vsce runs it before packaging.                                                                                                                                                 |
| `test`              | Runs the `node:test` suites in `test/` with `tsx --test`.                                                                                                                                           |
| `lint`              | Checks the code with ESLint.                                                                                                                                                                        |
| `lint:fix`          | Runs ESLint and fixes what it can.                                                                                                                                                                  |
| `format`            | Formats every file with Prettier.                                                                                                                                                                   |
| `format:check`      | Checks that every file is formatted, without changing anything.                                                                                                                                     |
| `typecheck`         | Type-checks the project with `tsc --noEmit`.                                                                                                                                                        |
| `package`           | Builds `dist/biolume-<version>.vsix` with `vsce package --no-dependencies --out dist/`.                                                                                                             |
| `release`           | Starts a release with release-it. The version comes from the commits since the last tag (breaking change: major, `feat`: minor, `fix`, `docs` or `refactor`: patch). See [Publishing](#publishing). |
| `release:patch`     | Releases the next patch version.                                                                                                                                                                    |
| `release:minor`     | Releases the next minor version.                                                                                                                                                                    |
| `release:major`     | Releases the next major version.                                                                                                                                                                    |

The release commands only run on `main`. They run `lint`, `typecheck` and `test` first, bump the version, run `build`, update `CHANGELOG.md`, commit `chore: release v<version>`, tag `v<version>`, and push the commit and tag to `origin` (release-it asks before each step). They need a clean working tree with an upstream branch. They don't publish to the Marketplace, Open VSX or npm.

### Git hooks

- **pre-commit** runs `format:check`, `lint`, `typecheck` and `test`.
- **commit-msg** runs commitlint, so commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), for example `feat: add diff colors` or `fix: raise comment contrast`.

## Preview

1. Press `F5`. The **Preview Biolume** launch configuration builds the themes and opens `samples/` in an Extension Development Host window that uses Biolume.
2. Run `pnpm watch` in a terminal to rebuild on every save.
3. After a rebuild, run **Developer: Reload Window** in the preview window to see the change.

To switch to Biolume Light in the preview window, run **Preferences: Color Theme**. To find out which scope and color a token gets, put the cursor on it and run **Developer: Inspect Editor Tokens and Scopes**.

## Changing colors

Start in the brand. Biolume maps brand colors to editor roles, and the colors themselves live in `@kostad/brand`.

1. Change the colors in the [brand repo](https://github.com/KostaD02/brand) and release a new version.
2. Bump the exact version here:

   ```sh
   pnpm add -D --save-exact @kostad/brand@<version>
   ```

To try brand changes before they're released, run `pnpm build` in a brand repo cloned next to this one, then link it here:

```sh
pnpm add -D @kostad/brand@file:../brand
```

Switch back to a released version before you open a pull request.

A few rules keep the themes consistent:

- Workbench and syntax files only use palette fields and `withAlpha()`, never hex values.
- The tests check text contrast and flag colors that look too alike. If a check fails because of how a brand color is mapped, change the mapping. If the brand color itself can't pass, fix it in the brand.

## Publishing

Publishing is manual and done by the maintainer:

1. On `main`, run `pnpm release`.
2. Run `pnpm package` and check the VSIX.
3. Publish to the Visual Studio Marketplace and Open VSX:

   ```sh
   pnpm exec vsce publish --packagePath dist/biolume-<version>.vsix
   pnpm exec ovsx publish dist/biolume-<version>.vsix -p <token>
   ```
