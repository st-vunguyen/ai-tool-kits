---
globs: "**/{api-pack,templates/api-pack,examples,docs}/**/*.{md,json,example,yml,yaml}"
---

# Artifact Components & Composition

`components.md` in this repository is guidance for composing a **complete, reviewable API verification pack**.

## A Complete Pack Usually Includes

- strategy docs
- review findings
- traceability docs
- Postman collection
- environment templates
- sample data
- helper notes/scripts
- performance assets
- execution reports / raw evidence rules

## Sensible Breakdown

- `README.md` at `result/<slug>/` for the pack landing page and reading order
- `01-review/` for spec quality, auth, pagination, patterns, and snapshot outputs
- `02-strategy/` for planning, risk, priority, and gating decisions
- `03-scenarios/` for journey, integration, regression, and performance scenario docs
- `04-traceability/` for request ↔ spec ↔ status ↔ evidence mapping
- `05-postman/` for runnable collections and environment JSON files
- `06-env/` for CLI-friendly `.env.example` files or contracts
- `07-data/` for sample, generator, and status-case payloads
- `08-helpers/` for runbooks and execution helper notes
- `09-performance/` for k6, Newman performance, ZAP, and JMeter seed assets
- `10-reports/raw/` for machine outputs only
- `10-reports/performance/`, `10-reports/security-baseline/`, `10-reports/verification/`, and `10-reports/maintenance/` for curated report families

Curated execution or verification report folders should usually include both markdown handoff files and an executive-style `dashboard.html` when the stack supports it.

## Composition Rules

- Each file should have one primary purpose; avoid creating giant documents that mix everything together.
- The same scenario or case ID should stay consistent across strategy, traceability, collection, data, and reports.
- When a request depends on auth capture or a previous step, the documentation must state that relationship clearly.
- Examples should illustrate the pattern and must not contradict the canonical templates.
- Compatibility mirrors may exist, but they must clearly identify the preferred source.
- Do not claim a pack is “complete” if status coverage, setup assumptions, or evidence links are still missing.
- Do not publish a dashboard-only report; every dashboard must have markdown handoff files or clear linked evidence behind it.
- Do not create loose run folders directly under `10-reports/`; always place runs under a named report family.

## Naming

- Use names that reflect the artifact type and intent: `status-code-coverage-matrix.md`, `environment-variable-contract.md`, `newman-performance.collection.json`.
- Avoid vague names such as `notes.md`, `temp.json`, or `misc.md`.

## Do Not Add

- Do not add guidance for React component trees, hooks, provider nesting, or UI styling to this API testing kit repository.
- Do not create product runtime code, backend service code, or database schema guidance under the guise of artifact composition.
