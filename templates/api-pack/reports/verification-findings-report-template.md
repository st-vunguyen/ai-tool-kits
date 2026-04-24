# Verification Findings Report Template

Use this template when validating the quality of generated API testing artifacts, traceability outputs, or curated reports.

## Output root

```text
result/<slug>/10-reports/verification/<run-slug>/
```

## Recommended file set

- `00_index.md`
- `01_verification-scope-and-evidence.md`
- `02_findings-register.md`
- `03_contradictions-and-root-cause.md`
- `04_prioritized-recommendations.md`
- `05_approval-and-confidence.md`

## Core finding schema

Every major finding should capture:

| Field | Expectation |
|---|---|
| `Finding ID` | Stable identifier such as `VF-001` |
| `Observation` | Concrete mismatch, gap, risk, or confirmed alignment |
| `Evidence` | Exact file path, section, line reference, or raw artifact origin |
| `Classification` | `Spec gap`, `Documentation gap`, `Testing-asset issue`, `Execution blocker`, `Likely target-system issue`, `Unknown / needs confirmation` |
| `Why it matters` | Coverage, correctness, safety, or handoff impact |
| `Likely cause` | Best supported explanation, phrased with appropriate confidence |
| `Confidence boundary` | What remains unknown or unverified |
| `Recommendation` | `Do now`, `Do next`, `Later` action tied to the finding |

## `00_index.md`

Suggested sections:

1. verification summary
2. source inventory
3. trust decision
4. top findings
5. top actions

## `01_verification-scope-and-evidence.md`

Suggested sections:

1. verification scope
2. reviewed artifact paths
3. raw evidence paths
4. primary evidence vs secondary evidence
5. exclusions and blockers

## `02_findings-register.md`

Suggested subsection template:

```markdown
## VF-001 — <short title>

- Observation: ...
- Evidence: ...
- Classification: ...
- Why it matters: ...
- Likely cause: ...
- Confidence boundary: ...
- Recommendation:
  - Do now: ...
  - Do next: ...
  - Later: ...
```

## `03_contradictions-and-root-cause.md`

Suggested table:

| ID | Sources in conflict | Contradiction summary | Leading explanation | Next discriminating check |
|---|---|---|---|---|

## `04_prioritized-recommendations.md`

Suggested table:

| Priority | Owner | Action | Linked findings | Why now |
|---|---|---|---|---|
| `Do now` | `test asset` | Fix response-code mapping in collection assertions | `VF-001`, `VF-003` | Removes false failure interpretation |

## `05_approval-and-confidence.md`

Suggested sections:

1. approval decision
2. approval rationale
3. confidence boundaries
4. minimal next evidence required

## Quality bar

- do not approve artifacts whose claims exceed the evidence
- do not hide contradictions; record them explicitly
- do not stop at symptoms if a likely cause can be stated safely
- do not end with generic advice when a narrower next action can be named