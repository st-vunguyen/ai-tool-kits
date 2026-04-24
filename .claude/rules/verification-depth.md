# Verification Depth Rules

Use this rule when work involves reviewing, validating, explaining, or recommending anything about API testing assets, reports, or source specifications.

## Required thinking pattern

1. identify what is directly observed
2. identify what is inferred
3. test whether the inference is actually supported
4. look for contradictions across spec, docs, generated assets, and runtime evidence
5. isolate the most likely cause before giving advice
6. give the smallest useful next actions in priority order

## Required finding structure

Every important finding should answer these questions explicitly when evidence allows:

- what was observed?
- where is the evidence?
- why does it matter?
- what is the most likely cause?
- what still prevents full confidence?
- what should be done now, next, and later?

## Contradiction checks

- compare path, method, params, schemas, statuses, and auth expectations across all available sources
- compare curated reports with raw artifacts line-by-line for material claims
- compare generated collections, env contracts, test data, and traceability matrices for identifier drift
- if two sources conflict, record both and mark which one is primary vs secondary evidence

## Root-cause discipline

- prefer the narrowest plausible explanation that fits the evidence
- check setup, sample data, token scope, environment routing, request construction, and assertion logic before labeling a target-system defect
- if the cause is still uncertain, keep the statement probabilistic and name the next discriminating check

## Recommendation discipline

- recommendations must be ordered by impact and unblock value
- recommendations must name the owner context when possible: `spec`, `docs`, `test asset`, `runtime access`, or `target system`
- avoid vague endings like `needs more verification` unless followed by the exact missing evidence or next check
- if nothing safe can be done, say what minimal evidence is required to continue