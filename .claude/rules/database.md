# Database Rules

In this repository, “database” work means **test data modeling and state setup discipline**, not product schema implementation.

## Allowed database-related work

If sample datasets are needed for API testing, keep them under:

- `result/<slug>/07-data/`

## Required rules

- Build data shapes from the API contract, supporting docs, and runtime evidence.
- Use synthetic data only.
- Preserve parent-child dependency order and document teardown order clearly.
- If a negative case requires pre-existing state, document the precondition instead of inventing hidden database assumptions.
- When API behavior implies persistence semantics, mark them as inferred unless the docs/spec make them explicit.

## Forbidden default work

- Do not generate product database schema, migrations, ORM models, or seed scripts in this repo unless explicitly requested.
- Do not assume direct database access exists.
- Do not “correct” the API contract based on a guessed storage model.
