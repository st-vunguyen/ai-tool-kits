# Performance Pack

## What this folder is for / Folder này để làm gì

EN:
- Baseline runner assets for performance workloads (k6, Newman performance, JMeter starter).
- Plus the local env example used by the runners.

VN:
- Asset baseline cho workload hiệu năng (k6, Newman performance, JMeter starter).
- Kèm file env mẫu dùng cho runner.

## Who reads this / Ai đọc folder này

| Audience | Why |
|---|---|
| Performance engineer | Edit scripts, set thresholds, run workloads |
| QA lead | Review scenarios + thresholds before executing on a real environment |
| Stakeholder (non-tech) | Read curated dashboard at `10-reports/performance/<run-slug>/dashboard.html` instead — this folder is technical |

## When it gets created / Khi nào folder này được sinh

- Phase 4 step 19 — `.github/prompts/04-non-functional/19-performance-collection.prompt.md`
- Phase 4 step 21 — `.github/prompts/04-non-functional/21-fully-performance-testing.prompt.md`
- Optional JMeter steps 23–26 — `.github/prompts/04-non-functional/23..26-jmeter-*.prompt.md`

This directory contains the baseline runner assets for `result/<slug>/09-performance/`.

## Expected report destinations

1. Runner assets and configuration live in `result/<slug>/09-performance/`
2. Raw outputs live in `result/<slug>/10-reports/raw/performance/<run-slug>/`
3. Curated findings live in `result/<slug>/10-reports/performance/<run-slug>/`
4. When supported, executive dashboards live beside the curated markdown handoff as `dashboard.html`

## Runtime prerequisites

- Newman is pinned in the root `package.json`
- k6 / ZAP / JMeter are declared in `tooling/runtime-tools.json`
- Run `pnpm run runtime:doctor` before executing real workloads
- Use `pnpm run report:dashboard -- help` to inspect the shared dashboard renderer CLI

## Shared dashboard commands

Examples:

```bash
pnpm run report:dashboard -- build --mode newman --input result/<slug>/10-reports/raw/performance/<run-slug>/newman-summary.json --output-dir result/<slug>/10-reports/performance/<run-slug>
pnpm run report:dashboard -- build --mode k6 --input result/<slug>/10-reports/raw/performance/<run-slug>/k6-summary.json --output-dir result/<slug>/10-reports/performance/<run-slug>
pnpm run report:dashboard -- build --mode jmeter --input result/<slug>/10-reports/raw/performance/jmeter/<run-slug>/report-output/statistics.json --output-dir result/<slug>/10-reports/performance/jmeter/<run-slug>
pnpm run report:dashboard -- build --mode zap --input result/<slug>/10-reports/security-baseline/<run-slug>/zap-report.json --output-dir result/<slug>/10-reports/security-baseline/<run-slug>
```
