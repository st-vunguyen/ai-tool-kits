# API Testing — Copilot + Claude Support Matrix

This repository keeps all support sources in-repo and uses one shared operational contract for both Copilot and Claude.

## Support model

| Layer | Copilot | Claude | Commit? |
|---|---|---|---|
| Prompt source | `.github/prompts/` | `.github/prompts/` + `.claude/*` support | Yes |
| Instructions / rules | `.github/instructions/` | `.claude/rules/` | Yes |
| Agent persona | N/A | `.claude/agents/api-testing-qc.agent.md` | Yes |
| Shared skill contract | `.github/testing/SKILL.md` | `.claude/skills/testing/SKILL.md` | Yes |
| Input specs | `specs/**` | `specs/**` | Yes |
| Output artifacts | `result/**` | `result/**` | Yes, except runtime-only raw/env files |

## Shared Rules

- `.github/testing/SKILL.md` and `.claude/skills/testing/SKILL.md` must mirror the same business and operating contract.
- They must not diverge on source of truth, output roots, runtime toolchain, status coverage rules, or artifact hygiene.
- If one side is expanded for runtime or process behavior, the other side must be updated to match.

## Shared Runtime Contract

- `package.json` is the canonical command surface for users.
- `tooling/runtime-tools.json` is the canonical manifest for runtime wrappers.
- `scripts/runtime-tools.js` implements `pnpm run runtime:*` and `pnpm run tool:*`.
- `docs/RUNTIME_TOOLS.md` is the canonical operator guide.

## Operating model

- This repository is a standalone API testing tool, not the application repository under test.
- The canonical flow is `specs/` → `.github/prompts/` → `result/`.
- All usage instructions must go through `pnpm` or `pnpx`.
- The repository does not carry root CI workflows by default.
