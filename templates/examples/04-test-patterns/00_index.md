# Test Patterns — Generic Example Index

**Purpose:** show a reusable documentation shape for naming conventions, test layers, and assertion strategy.

## Files

| File | Purpose |
|---|---|
| `01_testing-patterns.md` | Naming, layering, assertions, data strategy |
| `02_example-snippets.md` | Example snippets for collections and reports |

## Example Principles

- Use stable method/path or business-intent request names.
- Keep strategy, traceability, and report docs under `result/<slug>/`, and keep runnable assets in their canonical `result/<slug>/05-postman/`, `06-env/`, `07-data/`, `08-helpers/`, and `09-performance/` folders.
- Trace variables from source request to consuming requests.
- Keep assertions evidence-backed and minimal.
