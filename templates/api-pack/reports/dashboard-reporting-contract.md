# Dashboard Reporting Contract

Use this contract when producing polished execution or verification reports for API testing artifacts.

## Design goal

The curated output should be readable at two speeds:

1. **Fast scan** via `dashboard.html`
2. **Deep review** via markdown handoff files and raw evidence links

## Canonical curated structure

```text
result/<slug>/10-reports/<report-family>/<run-slug>/
├── 00_index.md
├── 01_<context>.md
├── 02_<findings>.md
├── 03_<evidence-or-breakdown>.md
├── 04_<next-actions>.md
├── dashboard.html
└── optional dashboard-data.json
```

Preferred `report-family` values in this repository are:

- `performance`
- `security-baseline`
- `verification`
- `maintenance`

Do not create loose curated run folders directly under `10-reports/`.

## Dashboard content model

The dashboard should usually include:

1. report title and run metadata
2. overall status banner: `Passed`, `Failed`, `Blocked`, `Constrained`, or `Needs review`
3. KPI cards relevant to the runner or report type
4. top findings table or cards
5. blockers / limitations section
6. recommended next actions
7. links to markdown files and raw artifacts

## Common KPI ideas by runner

| Runner / Report Type | Good top-line KPIs |
|---|---|
| Newman collection run | total requests, assertions passed/failed, failed scenarios, duration, status-code spread |
| k6 | request count, error rate, p95 latency, throughput, blocked thresholds |
| ZAP baseline | alerts by risk level, scanned URLs, passive-scan warnings, auth limitations |
| JMeter | sample count, error %, p95 / p99, throughput, slowest transactions |
| Verification / maintenance | findings by class, blockers, changed assets, approval state |

## Evidence rules

- every KPI must map to a raw artifact or markdown evidence section
- every status badge must have a clear rule behind it
- if a number is incomplete or approximate, label it clearly
- dashboards should never be the only place where findings exist

## Interaction guidance

- use collapsible sections for noisy evidence
- keep the first screen readable without scrolling through raw logs
- prefer short labels and clear color semantics
- make evidence links obvious and stable