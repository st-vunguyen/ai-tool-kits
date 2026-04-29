# API Pack — Canonical Runnable Pack

## What this folder is / Folder này là gì

EN:
- The canonical template source for everything that gets scaffolded into `result/<slug>/` by `scripts/apply-api-testing-kit.js`.
- It is **not** the final output — outputs land under `result/<slug>/` after running `pnpm run apply -- --slug <slug>`.
- Edit files here only when the kit's *baseline* should change for all future scaffolds. Per-project tweaks belong in `result/<slug>/`.

VN:
- Template gốc canonical, được `scripts/apply-api-testing-kit.js` copy sang `result/<slug>/`.
- Đây **không** phải output cuối — output thực sự nằm tại `result/<slug>/` sau khi chạy `pnpm run apply -- --slug <slug>`.
- Chỉ chỉnh file ở đây khi muốn thay đổi *baseline* cho mọi lần scaffold sau. Tinh chỉnh theo dự án thì ghi vào `result/<slug>/`.

## How it gets used / Cách được sử dụng

1. User puts spec in `specs/<slug>/`.
2. `pnpm run apply -- --slug <slug>` copies these template files into the canonical numbered folders under `result/<slug>/`.
3. Prompts in `.github/prompts/` then enrich the result tree (per-status requests, env contracts, traceability, dashboards).

This pack is the template source used to scaffold outputs under `result/<slug>/`.

## Target layout

```text
result/<slug>/
├── README.md
├── 01-review/
├── 02-strategy/
├── 03-scenarios/
├── 04-traceability/
├── 05-postman/
├── 06-env/
├── 07-data/
├── 08-helpers/
├── 09-performance/
└── 10-reports/
	├── raw/
	├── performance/
	├── security-baseline/
	├── verification/
	└── maintenance/
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
| `performance-collection-reporting.md` | `02-strategy/performance-collection-reporting.md` |
| `full-api-collection-traceability.md` | `04-traceability/full-api-collection-traceability.md` |
| `data-driven-samples-mapping.md` | `04-traceability/data-driven-samples-mapping.md` |
| `status-code-coverage-matrix.md` | `04-traceability/status-code-coverage-matrix.md` |
| `reports/dashboard-reporting-contract.md` | `10-reports/<report-family>/<run-slug>/` reference contract |
| `reports/dashboard-html-guidelines.md` | `10-reports/<report-family>/<run-slug>/dashboard.html` design guide |
| `reports/maintenance-report-template.md` | `10-reports/maintenance/<run-slug>/` reference template |
| `reports/verification-findings-report-template.md` | `10-reports/verification/<run-slug>/` reference template |
| `reports/raw/` | `10-reports/raw/` |

Curated reports must always live under a named report family such as `performance`, `security-baseline`, `verification`, or `maintenance`.
