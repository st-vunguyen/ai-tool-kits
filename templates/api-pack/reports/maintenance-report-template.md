# Maintenance Report Template

Use this template when refreshing an existing API testing pack after the source spec, docs, auth model, data contract, or execution assumptions changed.

## Output root

```text
result/<slug>/10-reports/maintenance/<run-slug>/
```

## Recommended file set

- `00_index.md`
- `01_spec-change-impact.md`
- `02_strategy-and-traceability-delta.md`
- `03_core-pack-maintenance.md`
- `04_specialized-pack-maintenance.md`
- `05_execution-and-reruns.md`
- `06_confirmed-system-issues.md`
- `07_asset-fixes.md`
- `08_final-summary.md`
- optional `dashboard.html`
- optional `dashboard-data.json`

## `00_index.md`

Suggested sections:

1. maintenance summary
2. changed inputs
3. final status
4. impacted artifacts
5. next actions

## `01_spec-change-impact.md`

Suggested sections:

1. source diff summary
2. changed operations and schemas
3. response-code coverage delta
4. impacted folders under `result/<slug>/`
5. skipped areas with reason

## `02_strategy-and-traceability-delta.md`

Suggested sections:

1. strategy changes
2. traceability changes
3. environment or auth contract changes
4. confidence boundaries

## `03_core-pack-maintenance.md`

Suggested sections:

1. collection changes
2. env updates
3. data and sample updates
4. helper and runbook updates

## `04_specialized-pack-maintenance.md`

Suggested sections:

1. scenarios refreshed
2. contract / integration / regression delta
3. performance delta
4. security-baseline delta
5. JMeter delta when applicable

## `05_execution-and-reruns.md`

Suggested table:

| Attempt | Scope rerun | Reason | Outcome | Evidence path |
|---|---|---|---|---|
| `1` | `contract collection` | Refresh after schema change | `Passed` | `10-reports/raw/...` |

## `06_confirmed-system-issues.md`

Suggested table:

| ID | Issue | Evidence | Why it is not a testing-asset issue | Next action |
|---|---|---|---|---|

## `07_asset-fixes.md`

Suggested table:

| ID | Asset area | Fix applied | Why needed | Validation rerun |
|---|---|---|---|---|

## `08_final-summary.md`

Suggested sections:

1. completion decision
2. remaining blockers
3. deferred work
4. prioritized recommendations

## Quality bar

- do not mark maintenance complete if changed inputs were not mapped to impacted assets
- do not mix testing-asset fixes with confirmed target-system issues
- do not claim unchanged coverage if the status-code model or auth flow changed
- do not publish a dashboard without markdown handoff files behind it