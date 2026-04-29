# Dashboard Reporting Skill

Use this skill when generating or validating curated reports for Newman, ZAP, k6, JMeter, maintenance, or verification outputs.

## Purpose

This skill turns raw execution evidence into a polished, reviewable deliverable with two synchronized layers:

```text
Raw evidence → Markdown handoff → Executive dashboard
```

## Reporting pattern

Each substantial report should aim to produce:

1. a markdown handoff with traceable sections and explicit findings
2. an executive-style `dashboard.html` for rapid scanning
3. optional `dashboard-data.json` if a renderer needs a structured intermediate layer

## Dashboard quality bar

Borrow the quality goals from `dashboard-reporter.ts` without copying Playwright-specific assumptions:

- summary-first layout
- visually obvious pass / fail / blocked / constrained states
- compact KPI cards
- collapsible detail sections for evidence-heavy content
- attachments or raw-log previews as optional drill-downs
- professional styling suitable for engineering and stakeholder review

## Minimum report sections

- run context
- stack and environment
- overall status and confidence
- key metrics or evidence summary
- major findings
- blockers or limitations
- recommended next actions
- evidence links

## Guardrails

- do not let the dashboard introduce new conclusions that are absent from the markdown report
- do not hide blockers below the fold
- do not show unsupported benchmark targets as official thresholds
- do not treat decorative charts as evidence if the underlying data is weak or incomplete