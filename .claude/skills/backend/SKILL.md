# Backend API Verification Skill

Use this skill for the core spec-to-pack workflow in this repository.

## Goal

Turn a provided API spec into review, strategy, traceability, runnable assets, and evidence-backed conclusions.

## Canonical flow

```text
specs/<slug>/ → review → strategy → traceability → runnable assets → reports
```

## Typical outputs

- `result/<slug>/01-review/`
- `result/<slug>/02-strategy/`
- `result/<slug>/03-scenarios/`
- `result/<slug>/04-traceability/`
- `result/<slug>/05-postman/`
- `result/<slug>/08-helpers/`
- `result/<slug>/10-reports/`

## Workflow

1. analyze spec and docs
2. define scope, risks, and blockers
3. map operation/status coverage
4. generate assets in canonical folders
5. run the smallest safe validation
6. verify raw outputs and curated report
7. produce targeted suggestions

## Hard rules

- do not treat this repo like product backend source code
- do not add controller/service/database implementation guidance
- do not overwrite source spec files in `specs/`
