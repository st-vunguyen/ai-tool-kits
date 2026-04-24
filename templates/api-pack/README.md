# API Pack — Canonical Runnable Pack

This pack is the template source used to scaffold outputs under `result/<slug>/`.

## Target layout

```text
result/<slug>/
├── 03-scenarios/
├── 04-traceability/
├── 05-postman/
├── 06-env/
├── 07-data/
├── 08-helpers/
├── 09-performance/
└── 10-reports/raw/
```

## Mapping

| Source | Target |
|---|---|
| `postman/` | `05-postman/` |
| `env/` | `06-env/` |
| `environment-variable-contract.md` | `06-env/environment-variable-contract.md` |
| `data/` | `07-data/` |
| `helpers/` | `08-helpers/` |
| `e2e-collection/` | `08-helpers/e2e-collection/` |
| `e2e-journeys/` | `03-scenarios/e2e-journeys/` |
| `performance/` | `09-performance/` |
| `performance-collection-reporting.md` | `09-performance/performance-collection-reporting.md` |
| `full-api-collection-traceability.md` | `04-traceability/full-api-collection-traceability.md` |
| `data-driven-samples-mapping.md` | `04-traceability/data-driven-samples-mapping.md` |
| `status-code-coverage-matrix.md` | `04-traceability/status-code-coverage-matrix.md` |
| `reports/verification-findings-report-template.md` | `10-reports/verification/<run-slug>/` reference template |
| `reports/raw/` | `10-reports/raw/` |
