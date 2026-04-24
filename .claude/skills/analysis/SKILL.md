# Verification Analysis Skill

Use this skill when the task requires triệt để verification, discrepancy analysis, root-cause framing, or actionable recommendations.

## Purpose

This skill prevents shallow summaries by forcing a structured loop:

```text
Observe → Cross-check → Classify → Explain → Recommend
```

## When to use

- verifying whether a review, strategy, matrix, collection, or report is truly trustworthy
- analyzing mismatches between spec, docs, generated assets, and runtime evidence
- deciding whether a problem belongs to the spec, docs, testing asset, environment, or target system
- producing final recommendations after a verification pass

## Required output shape

For each major finding, capture:

1. `Observation`: the concrete mismatch, risk, or confirmed alignment
2. `Evidence`: exact source location or artifact origin
3. `Classification`: `Spec gap`, `Documentation gap`, `Testing-asset issue`, `Execution blocker`, `Likely target-system issue`, or `Unknown / needs confirmation`
4. `Why it matters`: scope, risk, or traceability impact
5. `Likely cause`: best current explanation with confidence wording
6. `Recommendation`: `Do now`, `Do next`, `Later`

## Deep-check checklist

- check whether claims are evidence-backed or just implied
- check whether success-only coverage is presented as broad coverage
- check whether identifiers drift across strategy, matrix, collection, data, env, and report
- check whether blockers are named clearly instead of being hidden as incomplete conclusions
- check whether recommendations are concrete, prioritized, and tied to the evidence

## Recommendation patterns

- `Do now`: the smallest action that removes ambiguity or fixes a clear asset defect
- `Do next`: the follow-up action that expands confidence or coverage after the immediate blocker is handled
- `Later`: optional hardening or scale-up work that is not required for current correctness

## Guardrails

- never invent certainty where only partial evidence exists
- never collapse multiple possible causes into one definitive claim without support
- never end analysis at the symptom layer if a likely causal layer can be stated safely
- never recommend changing the source spec in place; create proposal artifacts under `result/` instead