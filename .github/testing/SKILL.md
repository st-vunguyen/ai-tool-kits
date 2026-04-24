---
name: api-testing
description: 'Create strategy docs, Postman/Newman collections, env templates, datasets, runtime-tool manifests, and execution reports for API testing'
---

# API Testing Skill

## Shared Contract

This file defines the shared API testing contract for both assistant layouts.

- Copilot reads `.github/testing/SKILL.md`
- Claude mirrors the same contract in `.claude/skills/testing/SKILL.md`

The two files can differ in wrapper text, but they must agree on flow, output roots, runtime tooling, and guardrails.

## Trigger

Use this skill when asked to:
- review an OpenAPI spec for testability
- create or update an API test strategy
- generate Postman/Newman collections
- build environment templates or variable contracts
- prepare data-driven sample files
- create API execution reports or runtime runner packs

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
- do not generate root `.github/workflows/` by default; this repo is a standalone API testing tool, not the product repo under test

## Working rules

- read spec from `specs/<slug>/`
- write outputs only to `result/<slug>/`
- keep evidence-backed claims only
- keep explicit status-code coverage
- do not commit real secrets or raw runtime-only artifacts

## Variable Contract Template

```markdown
| Variable | Required | Source | Set by | Used by | Notes |
|---|---|---|---|---|---|
| `BASE_URL` | Yes | OpenAPI `servers` | Manual | All requests | Use placeholder only in `.example` files |
| `ACCESS_TOKEN` | Yes | Login response | Login request script | Protected requests | Never commit real value |
| `PROJECT_ID` | No | Create project response | Project creation script | Downstream resource flows | Clear after teardown |
```

## Status Coverage Matrix Template

```markdown
| Operation | Status | Case ID | Sample / Precondition | Assertion focus | Evidence | State |
|---|---:|---|---|---|---|---|
| `POST /projects` | `201` | `PRJ-POST-201-01` | `status-cases/projects.post.201.valid.json` | Created response + ID capture | OpenAPI response + example | Covered |
| `POST /projects` | `400` | `PRJ-POST-400-01` | `status-cases/projects.post.400.missing-name.json` | Validation error contract | OpenAPI schema | Covered |
| `POST /projects` | `409` | `PRJ-POST-409-01` | Precreate duplicate project name | Conflict semantics | Doc section + runtime evidence | Planned |
| `POST /projects` | `429` | `PRJ-POST-429-01` | Burst workload precondition | Rate-limit headers/body | Needs runtime validation | Blocked |
```

Rules:

- one row per operation/status pair when evidence allows it
- use `Blocked` or `Unknown / needs confirmation` instead of inventing a case
- keep sample IDs stable across collection, data, and reports
