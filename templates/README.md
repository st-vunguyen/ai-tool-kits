# API Testing Templates

`templates/api-pack/` is the canonical template source used to scaffold `result/<slug>/`.

## Mapping

| Template source | Target in `result/<slug>/` |
|---|---|
| `api-pack/postman/` | `05-postman/` |
| `api-pack/env/` | `06-env/` |
| `api-pack/data/` | `07-data/` |
| `api-pack/helpers/` | `08-helpers/` |
| `api-pack/e2e-collection/` | `08-helpers/e2e-collection/` |
| `api-pack/e2e-journeys/` | `03-scenarios/e2e-journeys/` |
| `api-pack/performance/` | `09-performance/` |
| `api-pack/reports/raw/` | `10-reports/raw/` |
| `api-pack/environment-variable-contract.md` | `06-env/environment-variable-contract.md` |
| `api-pack/full-api-collection-traceability.md` | `04-traceability/full-api-collection-traceability.md` |
| `api-pack/data-driven-samples-mapping.md` | `04-traceability/data-driven-samples-mapping.md` |
| `api-pack/status-code-coverage-matrix.md` | `04-traceability/status-code-coverage-matrix.md` |
| `api-pack/performance-collection-reporting.md` | `09-performance/performance-collection-reporting.md` |

## Usage

```bash
pnpm run apply -- --slug <slug>
```
