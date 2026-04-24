# API Testing — Copilot + Claude Support Matrix

This repository keeps all support sources in-repo and uses one shared operational contract for both Copilot and Claude.

The active editor-loaded guidance is routed through `.claude/rules/` and `.claude/skills/`, while `.github/prompts/` stays the canonical prompt library.

## Support model

| Layer | Copilot | Claude | Commit? |
|---|---|---|---|
| Prompt source | `.github/prompts/` | `.github/prompts/` + `.claude/*` support | Yes |
| Active rules | `.claude/rules/` via editor settings | `.claude/rules/` | Yes |
| Agent persona | `AGENTS.md` + `.claude/*` guidance | `.claude/agents/*.agent.md` | Yes |
| Active skills | `.claude/skills/` via editor settings | `.claude/skills/` | Yes |
| Input specs | `specs/**` | `specs/**` | Yes |
| Output artifacts | `result/**` | `result/**` | Yes, except runtime-only raw/env files |

## Shared Rules

- `AGENTS.md`, `.claude/rules/`, and `.claude/skills/` must agree on source of truth, output roots, runtime toolchain, status coverage rules, and artifact hygiene.
- `.github/prompts/` must not contradict the active `.claude/*` guidance.
- The repository should maintain a single active instruction model rather than parallel competing rule sets.

## Cleanup note

- Do not reintroduce `.github/instructions/` or `.github/testing/` mirrors unless the editor-loading model changes from `.claude/*` back to a dual-source setup.

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
