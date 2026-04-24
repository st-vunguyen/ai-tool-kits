---
applyTo: "**/result/**"
description: "Execution evidence, report structure, local/container execution rules, and artifact hygiene for result/ based API testing packs."
---

# API Testing Reporting & Execution — Mandatory Rules

## 1) Two report layers

| Layer | Purpose | Canonical location |
|---|---|---|
| Raw runner output | Machine-readable evidence | `result/<slug>/10-reports/raw/` |
| Curated human report | Findings, blockers, recommendations | `result/<slug>/10-reports/<run-slug>/` |

## 2) Recommended report structure

```text
result/<slug>/10-reports/<run-slug>/
├── 00_index.md
├── 01_execution-summary.md
├── 02_confirmed-issues.md
├── 03_asset-fixes-and-adjustments.md
├── 04_gaps-and-blockers.md
└── 05_next-actions.md
```

## 3) Execution automation rules

1. Prefer local or containerized runners owned by this tool repo
2. Separate smoke/read-only runs from destructive runs
3. Keep raw artifacts under `result/<slug>/10-reports/raw/`
4. Record the exact wrapper script or command used for each run

## 4) Artifact hygiene

Commit:

- curated markdown reports
- template env files
- collections, traceability docs, helper notes

Do not commit by default:

- real env files
- bulky one-off generated artifacts
- secrets / current-value exports

## 5) Completion checklist

- [ ] Curated report exists under `result/<slug>/10-reports/<run-slug>/`
- [ ] Raw artifacts are referenced or selectively retained, not blindly committed
- [ ] Report separates asset issues, system issues, and evidence gaps
- [ ] Report makes it obvious whether coverage is success-only or multi-status
