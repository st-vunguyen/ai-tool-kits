MODE=technical

# Illustrative API — Comprehensive Test Strategy Index

**Purpose:** Illustrative strategy output for a shared API testing workflow.
**Example spec path:** `openapi.yaml`
**Example docs path:** `docs/reference/`
**Example servers:** `https://<base-url>`, `http://localhost:3000`

---

## Executive Summary

This illustrative strategy models a generic API surface with these capability groups:

```text
Auth → Core Resources → Relationships → Reporting → Access Keys → Audit Records
```

Use this folder as a reference for how a complete strategy pack can be organized. Replace every example domain, endpoint, and evidence reference with project-specific facts from the real OpenAPI and supporting docs.

## Files in This Pack

| File | Purpose |
|---|---|
| `00_index.md` | Summary, file map, anti-hallucination notes |
| `01_test-strategy.md` | Goals, risk profile, test layers, exit criteria |
| `02_test-scope-matrix.md` | Domain-by-domain scope and priority |
| `03_test-cases-priority.md` | Priority scenario lines and rationale |
| `04_non-functional.md` | Auth, limits, idempotency, concurrency, observability, performance |
| `05_schedule-and-resourcing.md` | Suggested rollout phases and ownership |
| `06_traceability.md` | Requirements → risk → scenario mapping model |
| `07_risks-gaps-open-questions.md` | Gaps, blockers, and unresolved questions |

## Anti-Hallucination Notes

- This folder is an **example structure**, not a source of truth.
- Example endpoint groups are illustrative only.
- Replace all placeholder evidence such as `openapi.yaml` and `docs/reference/` with the current source-of-truth references.
- Any item marked `Example only` should be rewritten from the actual API evidence before reuse.
