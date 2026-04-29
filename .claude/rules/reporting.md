# Reporting Rules

Reports in this repository must be evidence-backed, reviewable, and separated from raw artifacts.

## Reporting layers

- Raw runner outputs belong under `result/<slug>/10-reports/raw/`
- Curated findings belong under `result/<slug>/10-reports/<report-family>/<run-slug>/`

Preferred report families are:

- `performance/`
- `security-baseline/`
- `verification/`
- `maintenance/`

Do not create loose curated run folders directly under `10-reports/`.

## Dashboard reporting model

For substantial execution or verification work, reporting should have two curated layers:

1. human-readable markdown handoff files for review and traceability
2. an executive-style HTML dashboard for fast scanning and stakeholder communication

When a dashboard is supported, the curated report folder should normally contain:

- `00_index.md`
- focused markdown handoff files for context, findings, evidence, and next actions
- `dashboard.html`
- optional `dashboard-data.json` when a renderer needs a structured summary input

The dashboard should be inspired by the quality bar of `dashboard-reporter.ts`:

- scan-friendly summary cards
- clear pass/fail/blocker state
- top findings and next actions near the top
- collapsible details for noisy evidence
- evidence links back to raw artifacts and markdown sections
- visible distinction between measured facts, assumptions, and blockers

## Every curated report should make clear

- what scope was executed or reviewed
- which source inputs were used
- which commands or wrappers were used
- what evidence exists
- what remains blocked or unverified
- what was a testing-asset issue vs a confirmed target-system issue
- what next action is recommended

## Dashboard quality rules

- A dashboard must never look more certain than the underlying evidence.
- Do not optimize only for aesthetics; navigation, evidence traceability, and truthful labeling come first.
- Prefer a small number of meaningful KPIs over a crowded wall of weak numbers.
- If screenshots, request logs, or raw runner snippets are available, surface them as optional drill-downs rather than forcing them into the summary layer.
- If the report is constrained, blocked, or assumption-heavy, the dashboard header must say so plainly.

## Analysis requirements

- Each major finding should include: observed evidence, interpretation, confidence level, likely cause, and recommended next action.
- If multiple explanations are plausible, list the leading hypotheses in priority order instead of flattening them into one statement.
- Recommendations should be specific enough for an operator to act on them without reverse-engineering intent.
- Do not end with generic advice such as “review further” when a narrower next check can be named.

## Verification rules

- Re-read the report against spec/docs/raw outputs before considering it final.
- Do not let summary claims exceed the evidence.
- If the report is based on assumptions, label them explicitly.
- If raw artifacts were not produced, say so directly.
- Verify that the recommendation section is consistent with the findings section; do not suggest actions that the evidence does not support.
- Verify that the dashboard summary matches the markdown handoff and raw evidence; no metric, severity, or readiness label should drift between layers.
- Verify that the curated report landed under the correct report family and not as a loose folder under `10-reports/`.