# API Testing Prompts

`.github/prompts/` is the canonical prompt source for this repository's internal flow.

Canonical usage:

```text
specs/  →  .github/prompts/  →  result/
```

- place the spec in `specs/<output-slug>/`
- choose the appropriate prompt from `.github/prompts/`
- write all outputs into `result/<output-slug>/`

## Entry point

If you want the full flow, start with:

- `00-orchestration/00-run-pipeline.prompt.md`

## Prompt groups

| Folder | Purpose |
|---|---|
| `00-orchestration/` | Entry point and full pipeline orchestration |
| `01-review-and-strategy/` | Spec review and strategy creation |
| `02-core-pack/` | Build core Postman/env/data/helpers pack |
| `03-scenario-packs/` | E2E, contract, integration, regression |
| `04-non-functional/` | Performance, security baseline, JMeter |
| `05-maintenance/` | Refresh assets after specification changes |

## Canonical output mapping

| # | File | Primary output |
|---|---|---|
| 01 | `01-review-and-strategy/01-openapi-lint-verify.prompt.md` | `result/<output-slug>/01-review/openapi-quality/` |
| 02 | `01-review-and-strategy/02-auth-limits-analysis.prompt.md` | `result/<output-slug>/01-review/auth-and-limits/` |
| 03 | `01-review-and-strategy/03-pagination-filtering-review.prompt.md` | `result/<output-slug>/01-review/pagination-filtering/` |
| 04 | `01-review-and-strategy/04-test-patterns-review.prompt.md` | `result/<output-slug>/01-review/test-patterns/` |
| 05 | `01-review-and-strategy/05-oas-snapshot.prompt.md` | `result/<output-slug>/01-review/oas-snapshot/` |
| 06 | `01-review-and-strategy/06-comprehensive-test-strategy.prompt.md` | `result/<output-slug>/02-strategy/` |
| 07 | `02-core-pack/07-full-api-collection.prompt.md` | `result/<output-slug>/05-postman/` + `04-traceability/` + `06-env/` |
| 08 | `02-core-pack/08-refresh-environment-files.prompt.md` | `result/<output-slug>/06-env/` + `08-helpers/` |
| 09 | `02-core-pack/09-data-driven-samples.prompt.md` | `result/<output-slug>/07-data/` + `04-traceability/` |
| 10 | `03-scenario-packs/10-e2e-journeys-doc.prompt.md` | `result/<output-slug>/03-scenarios/` |
| 11 | `03-scenario-packs/11-e2e-collection.prompt.md` | `result/<output-slug>/05-postman/` + `08-helpers/` |
| 12 | `03-scenario-packs/12-contract-coverage-plan.prompt.md` | `result/<output-slug>/04-traceability/` |
| 13 | `03-scenario-packs/13-contract-collection.prompt.md` | `result/<output-slug>/05-postman/contract.collection.json` |
| 14 | `03-scenario-packs/14-integration-flows-doc.prompt.md` | `result/<output-slug>/03-scenarios/` |
| 15 | `03-scenario-packs/15-integration-collection.prompt.md` | `result/<output-slug>/05-postman/` + `08-helpers/` + `04-traceability/` |
| 16 | `03-scenario-packs/16-regression-scenarios.prompt.md` | `result/<output-slug>/03-scenarios/` |
| 17 | `03-scenario-packs/17-regression-collection.prompt.md` | `result/<output-slug>/05-postman/regression.collection.json` |
| 18 | `04-non-functional/18-performance-scenarios.prompt.md` | `result/<output-slug>/03-scenarios/` |
| 19 | `04-non-functional/19-performance-collection.prompt.md` | `result/<output-slug>/09-performance/` |
| 20 | `04-non-functional/20-zap-security-scanning.prompt.md` | `result/<output-slug>/09-performance/zap/` + `result/<output-slug>/10-reports/security-baseline/` |
| 21 | `04-non-functional/21-fully-performance-testing.prompt.md` | `result/<output-slug>/10-reports/raw/performance/` + `result/<output-slug>/10-reports/performance/` |
| 22 | `05-maintenance/22-maintenance-fully-api-testing.prompt.md` | `result/<output-slug>/10-reports/<run-slug>/` + refreshed assets |
| 23 | `04-non-functional/23-jmeter-stack-setup.prompt.md` | `result/<output-slug>/09-performance/jmeter/` |
| 24 | `04-non-functional/24-jmeter-convert-collections.prompt.md` | `result/<output-slug>/09-performance/jmeter/` + `04-traceability/` |
| 25 | `04-non-functional/25-jmeter-execute-and-report.prompt.md` | `result/<output-slug>/10-reports/raw/performance/jmeter/` + `result/<output-slug>/10-reports/performance/jmeter/` |
| 26 | `04-non-functional/26-jmeter-report-analysis.prompt.md` | `result/<output-slug>/10-reports/performance/jmeter/` |

## Notes

- Do not write outputs into `documents/` or `tools/` anymore.
- If a prompt refers to an output root, always interpret it as `result/<output-slug>/`.
- If you need scaffolding first, run `pnpm run apply -- --slug <output-slug>`.
- Do not create root `.github/workflows/` entries for the tested project or API; this tool prefers locally managed or container-based runners owned by the repository.
