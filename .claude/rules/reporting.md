# Reporting Rules

Reports in this repository must be evidence-backed, reviewable, and separated from raw artifacts.

## Reporting layers

- Raw runner outputs belong under `result/<slug>/10-reports/raw/`
- Curated findings belong under `result/<slug>/10-reports/<run-slug>/` or the canonical specialized report folder

## Every curated report should make clear

- what scope was executed or reviewed
- which source inputs were used
- which commands or wrappers were used
- what evidence exists
- what remains blocked or unverified
- what was a testing-asset issue vs a confirmed target-system issue
- what next action is recommended

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