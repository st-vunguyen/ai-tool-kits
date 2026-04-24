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
├── instructions/          # Copilot instructions
├── prompts/               # Canonical prompt source
├── testing/SKILL.md       # Shared API testing skill source
└── workflows/             # CI starters

.claude/
├── agents/                # Claude personas
├── rules/                 # Claude repo rules
└── skills/                # Claude skills and references

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
- `.github/instructions/` is the only Copilot instruction source.
- `.claude/agents/`, `.claude/rules/`, and `.claude/skills/` are the Claude support source.
- `templates/api-pack/` is the only canonical runnable pack source.

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
