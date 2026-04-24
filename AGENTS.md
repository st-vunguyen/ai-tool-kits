# API Testing Kit

Spec-first repo for building **API testing / QC assets** only.

## Purpose

This repository is not an application codebase. It is a reusable kit for:

- reviewing OpenAPI / Swagger specs
- writing API test strategy and traceability docs
- generating Postman / Newman runnable packs
- maintaining env templates and synthetic datasets
- preparing k6 / JMeter / ZAP starter assets
- publishing execution evidence and maintenance reports

## Canonical POM

### Source support files in this repo

```text
.github/
└── prompts/               # Canonical prompt source

.claude/
├── agents/                # Specialized API testing personas
├── rules/                 # Active editor-loaded repo rules
└── skills/                # Active editor-loaded repo skills

templates/
└── api-pack/             # Canonical runnable pack template
```

### Generated output model in this repo

```text
specs/<slug>/
└── openapi.yaml

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

## What is canonical

- `.github/prompts/` is the only canonical prompt source.
- `.claude/rules/` and `.claude/skills/` are the active editor-loaded guidance source via `.vscode/settings.json`.
- `.claude/agents/` contains specialized Claude personas for orchestration, spec review, and report verification.
- `templates/api-pack/` is the only canonical runnable pack source.

## Active guidance model

- Both Copilot and Claude should follow `AGENTS.md` for the repo mission and boundaries.
- Editor-routed rules and skills are loaded from `.claude/rules/` and `.claude/skills/`.
- `.github/prompts/` remains the canonical prompt and workflow library.

## What is not product code

Do not treat this repo like a frontend/backend app:

- no React/UI/component guidance
- no service/controller/database implementation work
- no product runtime code generation under `src/`
- no direct editing of application source outside the API testing scope unless explicitly requested

## Preferred commands

```bash
pnpm run validate:bootstrap

node scripts/apply-api-testing-kit.js --help
```

## Working rules

- Keep every claim evidence-backed by spec, docs, or runtime output.
- Never stop at `200`-only coverage when more statuses are evidenced.
- Keep specs under `specs/` and generated artifacts under `result/`.
- Keep only example env files committed; never commit real credentials.
- Always push verification past summary-level output: check contradictions, isolate likely root cause, and end with prioritized recommendations.
