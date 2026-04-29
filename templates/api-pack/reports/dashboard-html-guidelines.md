# Dashboard HTML Guidelines

Use these guidelines when creating `dashboard.html` for API testing reports.

## Visual qualities

- professional, lightweight layout
- summary cards at the top
- readable tables with clear status coloring
- collapsible details for long evidence blocks
- mobile-safe but optimized for desktop review

## Information architecture

### Above the fold

- title + run slug
- environment / stack / timestamp
- overall status
- 3 to 6 high-signal KPIs
- top findings and next actions

### Below the fold

- per-endpoint, per-transaction, or per-alert breakdowns
- limitations and assumptions
- evidence drill-downs
- links to markdown handoff files and raw artifacts

## Truthfulness rules

- blocked runs should look blocked, not green
- constrained evidence should be marked as constrained, not full confidence
- assumptions should be visibly separated from measured results
- empty charts are worse than short tables with real evidence