# API Testing — Prepare Result Workspace

This document only describes how to prepare `result/<slug>/` inside this repository.

The canonical flow is always:

```text
specs/  →  .github/prompts/  →  result/
```

## When to Use This

Use this when you already have a spec under `specs/<slug>/` and want to scaffold the full output workspace before running prompts or wrappers.

## Minimum Inputs

- A clear output slug, for example `<slug>`
- A spec at `specs/<slug>/openapi.yaml` or an equivalent OpenAPI file under `specs/<slug>/`

## Standard Commands

```bash
pnpm install
pnpm run runtime:doctor
pnpm run apply:dry-run -- --slug <slug>
pnpm run apply -- --slug <slug>
pnpm run apply -- --slug <slug> --spec specs/<slug>/openapi.yaml
```

## Scaffold Result

```text
result/<slug>/
├── README.md
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

## Recommended Workflow

1. Run `pnpm run apply:dry-run -- --slug <slug>` to preview which files and folders will be created.
2. When the preview looks correct, run `pnpm run apply -- --slug <slug>` to scaffold for real.
3. Open `.github/prompts/README.md` and choose the correct prompt set.
4. Write outputs only into the matching phase inside `result/<slug>/`.
5. If execution is needed, continue with `docs/RUNTIME_TOOLS.md`.

## Quick Checks

- Confirm that `result/<slug>/README.md` has been created.
- Confirm that `result/<slug>/05-postman/`, `09-performance/`, and `10-reports/` all exist.
- Confirm that no new outputs were written outside `result/<slug>/`.
