# Performance Collection Reporting Guide

Use this guide as the canonical reporting contract for performance workloads generated from the API Testing kit.

## Minimum Reporting Sections

1. **Execution context**
   - target environment
   - approved safety scope
   - selected stack (`k6`, `postman-newman`, or another approved runner)
   - exact workload parameters used

2. **Measured outputs**
   - latency summaries
   - error rate / failure count
   - throughput or constrained equivalent
   - status distribution

3. **Limitations**
   - stack limitations
   - observability gaps
   - environment differences
   - assumptions still awaiting confirmation

4. **Findings**
   - evidence-backed performance risks only
   - note whether each finding is measured, assumed, or blocked by missing telemetry

5. **Artifact links**
   - raw outputs under `result/<output-slug>/10-reports/raw/performance/<run-slug>/`
   - curated report under `result/<output-slug>/10-reports/performance/<run-slug>/`

## Representation Rules

- If the stack is `postman-newman`, label the result as **constrained performance evidence** unless true load tooling is also used.
- Do not state latency goals, SLAs, or error budgets as facts unless they are evidenced from requirements or production agreements.
- If infrastructure telemetry is unavailable, avoid claiming bottleneck root cause.

## Suggested Curated Report Files

- `00_index.md`
- `01_execution-plan.md`
- `02_setup-and-tooling.md`
- `03_run-results.md`
- `04_findings-and-bottlenecks.md`
- `05_limitations-and-next-actions.md`
- `dashboard.html`
- optional `dashboard-data.json`

## Dashboard expectations

- Include an executive-style dashboard when the selected stack can support it responsibly.
- Show status, environment, stack, key metrics, top bottlenecks, limitations, and next actions near the top.
- Link the dashboard back to markdown handoff files and raw performance evidence.
- If the run is constrained or blocked, say so prominently in the dashboard header.