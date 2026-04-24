---
globs: "**/{api-pack,templates/api-pack,examples,docs}/**/*.{md,json,example,yml,yaml}"
---

# Artifact Components & Composition

`components.md` in this repository should be understood as guidance for composing the parts of an API testing pack.

## A Complete Pack Usually Includes

- strategy docs
- traceability docs
- Postman collection
- environment templates
- sample data
- helper notes/scripts
- performance assets
- execution reports / raw evidence rules

## Sensible Breakdown

- `strategy/` for planning and scope decisions
- `traceability/` for request ↔ spec ↔ status ↔ evidence mapping
- `postman/` for runnable collections and environment JSON files
- `env/` for CLI-friendly `.env.example` files or contracts
- `data/` for sample, generator, and status-case payloads
- `performance/` for k6, Newman performance, and JMeter seed assets

## Composition Rules

- Each file should have one primary purpose; avoid creating giant documents that mix everything together.
- When a request depends on auth capture or a previous step, the documentation must state that relationship clearly.
- Examples should illustrate the pattern and must not contradict the canonical templates.
- Compatibility mirrors may exist, but they must clearly identify the preferred source.

## Naming

- Use names that reflect the artifact type and intent: `status-code-coverage-matrix.md`, `environment-variable-contract.md`, `newman-performance.collection.json`.
- Avoid vague names such as `notes.md`, `temp.json`, or `misc.md`.

## Do Not Add

- Do not add guidance for React component trees, hooks, provider nesting, or UI styling to this API testing kit repository.
