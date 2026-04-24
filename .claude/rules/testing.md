# Testing Rules

## Canonical structure

| Artifact | Canonical location |
|---|---|
| Review outputs | `result/<slug>/01-review/` |
| Strategy docs | `result/<slug>/02-strategy/` |
| Scenario docs | `result/<slug>/03-scenarios/` |
| Traceability | `result/<slug>/04-traceability/` |
| Postman assets | `result/<slug>/05-postman/` |
| Env templates | `result/<slug>/06-env/` |
| Data samples | `result/<slug>/07-data/` |
| Helper notes | `result/<slug>/08-helpers/` |
| Performance assets | `result/<slug>/09-performance/` |
| Reports | `result/<slug>/10-reports/` |

## Rules

- Spec comes from `specs/<slug>/`
- Output stays in `result/<slug>/`
- No real secrets committed
- No success-only coverage claims

## Verification cycle

Testing in this repository must follow a repeatable cycle:

1. analyze the spec and docs
2. plan scope, risks, and blockers
3. generate review/strategy/traceability assets
4. generate runnable assets
5. run the smallest safe validation first
6. verify raw evidence
7. verify the curated report against the raw evidence
8. summarize gaps, fixes, and next suggestions

## Depth requirements

- Do not stop at “file exists” or “collection runs”; verify whether the artifact is internally consistent and aligned with the spec and supporting docs.
- For every important finding, classify it as one of: `Spec gap`, `Documentation gap`, `Testing-asset issue`, `Likely target-system issue`, `Execution blocker`, or `Unknown / needs confirmation`.
- When multiple sources disagree, record the contradiction explicitly instead of choosing one silently.
- Before escalating an issue outward, perform a root-cause pass to check whether the mismatch comes from assumptions, variable setup, sample data, environment, or the generated asset itself.
- Recommendations must be actionable and prioritized as `Do now`, `Do next`, or `Later`, with a short reason tied to risk or unblock value.

## Coverage rules

- Every in-scope operation should have an explicit status state when evidence allows it.
- Allowed states include `Covered`, `Planned`, `Blocked`, `Out of scope with reason`, and `Unknown / needs confirmation`.
- Do not imply “full coverage” if only `200` or happy-path cases exist.
- Where auth, validation, conflict, pagination, idempotency, or throttling statuses are evidenced, represent them explicitly.

## Report verification rules

- A report is not finished until its claims match the spec, docs, and/or runtime outputs.
- Separate:
	- testing-asset issues
	- confirmed target-system issues
	- evidence gaps / blockers
- If raw evidence is missing, say so explicitly in the report.
- If confidence is partial, label the confidence boundary instead of compressing it into a definitive conclusion.

## Consistency rules

- Keep identifiers, variable names, request names, and status matrix rows consistent across generated artifacts.
- Use the same output slug and canonical folder layout everywhere.
