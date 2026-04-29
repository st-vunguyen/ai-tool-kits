# API Testing Kit

> Product name: **API Testing Kit**

This repository already includes the full baseline needed to run API testing through its native internal flow:

```text
specs/  →  .github/prompts/  →  result/
```

There is no longer an "apply this kit into another repository" model. Place the spec in `specs/`, choose the appropriate prompt from `.github/prompts/`, and write all outputs into `result/` using the canonical phase layout.

## Most users only touch three places

- `specs/<slug>/` — drop the source spec and supporting docs here
- `.github/prompts/` — choose the prompt matching the current phase
- `result/<slug>/` — read and store every generated output here

## Quick Start

```bash
pnpm install
pnpm run runtime:plan
pnpm run runtime:prepare
pnpm run runtime:doctor
pnpm run apply:dry-run -- --slug <slug>
pnpm run apply -- --slug <slug>
```

## Canonical Flow

1. Place the OpenAPI or Swagger spec in `specs/<project>/`
2. Use the appropriate prompt from `.github/prompts/`
3. Write all outputs into `result/<project>/`

## Repository Structure

```text
<repo-root>/
├── specs/                                      ← Input specification source
├── result/                                     ← Final generated outputs
├── .github/
│   └── prompts/                                ← Canonical prompt source for the flow
├── .claude/                                    ← Active rules, skills, and Claude agents
├── templates/api-pack/                         ← Source templates for postman, env, data, helpers, and performance assets
├── tooling/runtime-tools.json                  ← Runtime manifest for Newman, k6, ZAP, and JMeter
├── scripts/
│   ├── apply-api-testing-kit.js                ← Scaffold `result/<slug>/` from templates
│   ├── apply-api-quality-engineering-kit.js    ← Legacy compatibility wrapper
│   └── runtime-tools.js                        ← Runtime wrappers, planning, prepare, and doctor commands
└── docs/                                       ← Operational guides and conventions
```

## Canonical Output Structure

All outputs must live under `result/<project>/` with this structure:

```text
result/<project>/
├── README.md
├── 01-review/
│   ├── openapi-quality/
│   ├── auth-and-limits/
│   ├── pagination-filtering/
│   ├── test-patterns/
│   └── oas-snapshot/
├── 02-strategy/
├── 03-scenarios/
├── 04-traceability/
├── 05-postman/
├── 06-env/
├── 07-data/
├── 08-helpers/
├── 09-performance/
└── 10-reports/
    ├── raw/
    ├── performance/
    ├── security-baseline/
    ├── verification/
    └── maintenance/
```

## What Each Folder Means in `result/<project>/`

| Folder | Purpose |
|---|---|
| `01-review/` | Initial spec review: lint, auth, pagination, patterns, snapshot |
| `02-strategy/` | Consolidated test strategy and scope decisions |
| `03-scenarios/` | E2E journeys, integration flows, regression scenarios |
| `04-traceability/` | Endpoint → status → case → evidence mapping |
| `05-postman/` | Postman/Newman collections and Postman environments |
| `06-env/` | `.env.example`, variable contract, env usage notes |
| `07-data/` | Sample data, status cases, generators |
| `08-helpers/` | Runbooks, helper notes, fixture notes |
| `09-performance/` | k6, Newman performance, JMeter starter assets, performance guidance |
| `10-reports/` | Raw outputs plus curated report families: `performance/`, `security-baseline/`, `verification/`, `maintenance/` |

## How to read a finished pack

1. Open `result/<slug>/README.md`
2. Read `02-strategy/` for scope and risk decisions
3. Read `04-traceability/` for operation/status coverage
4. Read the latest `10-reports/<report-family>/<run-slug>/00_index.md`

Do not create loose run folders directly under `10-reports/`.

## Runtime Toolchain

This repository is a standalone tool, so the runtime contract for `Newman`, `k6`, `ZAP`, and `JMeter` is declared directly in source instead of being left implicit:

- `package.json` pins `newman` in `devDependencies`
- `tooling/runtime-tools.json` stores the wrapper, package, binary, and container manifest for all four tools
- `scripts/runtime-tools.js` implements `runtime:list`, `runtime:plan`, `runtime:prepare`, `runtime:doctor`, and `tool:*`
- `docs/RUNTIME_TOOLS.md` explains the `pnpm`-based runtime operating model

Quick commands:

```bash
pnpm install
pnpm run runtime:plan
pnpm run runtime:prepare
pnpm run runtime:doctor
```

### Wrapper Commands

```bash
pnpm run tool:newman -- --version
pnpm run tool:k6 -- version
pnpm run tool:zap -- -version
pnpm run tool:jmeter -- --version
```

- `Newman` always runs through the pinned package in this repository.
- `k6`, `ZAP`, and `JMeter` prefer a local binary when available and otherwise fall back to the container images declared in `tooling/runtime-tools.json`.

## Fastest Way to Use It

### Step 1 — Put the spec into `specs/`

Example:

```text
specs/
└── <slug>/
    └── openapi.yaml
```

### Step 2 — Scaffold the output once

```bash
pnpm run apply -- --slug <slug>
```

Or preview only:

```bash
pnpm run apply:dry-run -- --slug <slug>
```

The script creates `result/<slug>/` with the full baseline folder structure and starter assets.

### Step 3 — Run prompts based on your goal

| Need | Recommended starting prompt |
|---|---|
| Run the full pipeline | `.github/prompts/00-orchestration/00-run-pipeline.prompt.md` |
| Review the spec first | `.github/prompts/01-review-and-strategy/01-openapi-lint-verify.prompt.md` |
| Build a full strategy | `.github/prompts/01-review-and-strategy/06-comprehensive-test-strategy.prompt.md` |
| Generate a full Postman/Newman collection | `.github/prompts/02-core-pack/07-full-api-collection.prompt.md` |
| Refresh env, data, and helpers | `.github/prompts/02-core-pack/08-refresh-environment-files.prompt.md` |
| Produce status-driven samples | `.github/prompts/02-core-pack/09-data-driven-samples.prompt.md` |
| Create E2E / integration / regression assets | `.github/prompts/03-scenario-packs/` |
| Build k6 / Newman perf / JMeter assets | `.github/prompts/04-non-functional/` |
| Run maintenance after a spec change | `.github/prompts/05-maintenance/22-maintenance-fully-api-testing.prompt.md` |
| Run a final deep verification pass | `.github/prompts/05-maintenance/27-verification-findings-and-recommendations.prompt.md` |

## Key Conventions

- Input specs live in `specs/<project>/`
- The canonical prompt source is `.github/prompts/`
- Active editor-loaded rules and skills live in `.claude/rules/` and `.claude/skills/`
- All generated outputs live in `result/<project>/`
- Polished execution and verification reports should follow the dashboard contract in `templates/api-pack/reports/`
- All usage instructions must go through `pnpm` or `pnpx`
- Do not split content back into `documents/` and `tools/`
- Do not spread outputs outside `result/`
- Do not add root CI workflows for this tool unless explicitly requested
- Do not commit raw runtime outputs or real environment files

## Files to Open First

- `specs/README.md`
- `result/README.md`
- `.github/prompts/README.md`
- `docs/GUIDELINE.md`
- `docs/GUIDELINE.vn.md`
- `docs/RUNTIME_TOOLS.md`

## Useful Commands

```bash
pnpm run validate:bootstrap
pnpm run runtime:list
pnpm run runtime:plan
pnpm run runtime:doctor
pnpm run apply:dry-run -- --slug <slug>
pnpm run apply -- --slug <slug>
```
