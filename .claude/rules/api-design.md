# API Design Rules

This repository is **spec-first and verification-first**.

## Source-of-truth rules

- Treat files under `specs/<slug>/` as the original source input.
- Do **not** silently rewrite, normalize, or “improve” the provided spec in place.
- If the spec has issues, contradictions, or missing detail, record them in review artifacts under `result/<slug>/01-review/`.
- If a normalized or fixed spec is explicitly needed, create it as a **proposal copy** under `result/<slug>/01-review/openapi-quality/` or another result-scoped folder, never as a replacement for the input spec.

## Evidence rules

- Every design claim must point back to `specs/`, supporting docs, or runtime evidence.
- Distinguish clearly between `Observed`, `Assumption`, `Needs validation`, and `Open question`.
- If a contract detail is absent, do not invent it to make downstream assets look complete.

## Output rules

When creating API testing artifacts, read from `specs/<slug>/` and write only to:

1. `result/<slug>/01-review/`
2. `result/<slug>/02-strategy/`
3. `result/<slug>/03-scenarios/`
4. `result/<slug>/04-traceability/`
5. `result/<slug>/05-postman/`, `06-env/`, `07-data/`, `08-helpers/`, `09-performance/`, `10-reports/`

## Design intent

- Prioritize traceability, coverage clarity, and execution safety over speculative completeness.
- Prefer a documented gap over a fabricated endpoint, status code, schema field, workflow, or permission rule.
