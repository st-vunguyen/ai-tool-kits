# Spec Review & Proposal Skill

Use this skill when reviewing, snapshotting, linting, or proposing improvements to a provided OpenAPI/Swagger spec.

## Goal

Analyze the source spec deeply while preserving it unchanged as the original source input.

## Primary outputs

- `result/<slug>/01-review/openapi-quality/`
- `result/<slug>/01-review/oas-snapshot/`
- `result/<slug>/02-strategy/` sections affected by spec quality

## Responsibilities

- identify lint and consistency issues
- detect schema, response, auth, pagination, and naming problems
- record fix proposals separately from source input
- create normalized or fixed copies only as explicit proposal artifacts under `result/`

## Hard rules

- never overwrite the provided spec under `specs/`
- never “correct” ambiguous behavior without recording it as a proposal or open question
- every proposed fix must explain why it is safe, risky, or needs validation
