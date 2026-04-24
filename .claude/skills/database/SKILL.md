# Test Data & State Skill

Use this skill when API verification needs synthetic datasets, entity dependency mapping, setup state, or teardown guidance.

## Goal

Create data assets that help execute and verify API behavior while staying faithful to the spec.

## Primary outputs

- `result/<slug>/07-data/`
- `result/<slug>/04-traceability/data-driven-samples-mapping.md`
- `result/<slug>/08-helpers/` setup/cleanup notes when needed

## Responsibilities

- derive payload shapes from spec and docs
- create synthetic samples only
- document dependency ordering and cleanup order
- map samples to operation/status intent
- explain when a negative case requires setup instead of payload mutation

## Hard rules

- no product schema, migrations, ORM models, or seed implementations by default
- no real PII or credentials
- no hidden database assumptions presented as fact
