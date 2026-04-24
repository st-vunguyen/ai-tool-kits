---
globs: "**/scripts/**/*.js,**/*.ts,**/*.tsx"
---

# Script and Type Conventions

This repository primarily uses Node.js scripts and text artifacts. When you edit code, follow conventions that fit the kit's automation model.

## JavaScript / Node rules

- Target runtime is Node `>=18`.
- Prefer CommonJS when the existing file already uses `require`.
- Do not add dependencies just to solve simple copy, path, or logging problems.
- Function names must describe intent clearly: `copyDirRecursive`, `requireExistingPath`, `parseArgs`.
- Keep automation deterministic and path-explicit so generated artifacts land in canonical roots.
- Validate user input early and fail with actionable messages.

## If TypeScript Is Added Later

- Use TypeScript only when it provides a clear benefit for more complex automation.
- Do not mix TS and JS styles arbitrarily in the same scripting area without a matching build chain.
- Do not introduce app-framework typing patterns into kit automation files.

## Naming

| Element | Convention | Example |
|---|---|---|
| Script files | kebab-case | `apply-api-testing-kit.js` |
| Variables | camelCase | `targetRoot`, `canonicalPromptsDir` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_STACK` |
| JSON keys | descriptive lowerCamelCase | `runtimeContract`, `statusMatrix` |

## CLI behavior

- Help text must be copy-paste ready.
- Example commands must use `pnpm` or `node`; do not use `npm` in this repo.
- Errors must clearly identify what input was wrong and what the user should fix next.
- Runtime wrappers must preserve the repo contract declared in `tooling/runtime-tools.json`.

## Do Not Add

- Do not add conventions for React components, JSX UI, or app frontends when the repository does not use them.
- Do not turn automation scripts into speculative product code generators.
