# API Testing Skill

## Shared Contract

This file mirrors `.github/testing/SKILL.md`.
Copilot and Claude must use the same API testing contract.

## Canonical flow

```text
specs/<slug>/  →  .github/prompts/  →  result/<slug>/
```

## Canonical structure

```text
result/<slug>/
├── 01-review/
├── 02-strategy/
├── 03-scenarios/
├── 04-traceability/
├── 05-postman/
├── 06-env/
├── 07-data/
├── 08-helpers/
├── 09-performance/
└── 10-reports/
```

## Runtime toolchain contract

- `package.json` pins `newman`
- `tooling/runtime-tools.json` declares the runtime contract for `newman`, `k6`, `zap`, and `jmeter`
- `scripts/runtime-tools.js` provides `list` and `doctor`
- `docs/RUNTIME_TOOLS.md` explains local installation and verification
- do not generate root `.github/workflows/` by default

## Working rules

- read spec from `specs/<slug>/`
- write outputs only to `result/<slug>/`
- keep evidence-backed claims only
- keep explicit status-code coverage
- do not commit real secrets or raw runtime-only artifacts
