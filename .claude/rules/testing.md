# Testing Rules

## Canonical structure

| Artifact | Canonical location |
|---|---|
| Review outputs | `result/<slug>/01-review/` |
| Strategy docs | `result/<slug>/02-strategy/` |
| Scenario docs | `result/<slug>/03-scenarios/` |
| Traceability | `result/<slug>/04-traceability/` |
| Postman assets | `result/<slug>/05-postman/` |
| Env templates | `result/<slug>/06-env/` |
| Data samples | `result/<slug>/07-data/` |
| Helper notes | `result/<slug>/08-helpers/` |
| Performance assets | `result/<slug>/09-performance/` |
| Reports | `result/<slug>/10-reports/` |

## Rules

- Spec comes from `specs/<slug>/`
- Output stays in `result/<slug>/`
- No real secrets committed
- No success-only coverage claims
