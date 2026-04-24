# API Testing Skill

## Shared Contract

This is the primary API testing lifecycle skill for the active editor-loaded guidance in this repository.

Claude should also use this skill as the default lifecycle controller for API verification work in this repository.

## Canonical flow

```text
specs/<slug>/  →  .github/prompts/  →  result/<slug>/
```

## Canonical structure

```text
result/<slug>/
├── 01-review/
├── 02-strategy/
├── 03-scenarios/
├── 04-traceability/
├── 05-postman/
├── 06-env/
├── 07-data/
├── 08-helpers/
├── 09-performance/
└── 10-reports/
```

## Runtime toolchain contract

- `package.json` pins `newman`
- `tooling/runtime-tools.json` declares the runtime contract for `newman`, `k6`, `zap`, and `jmeter`
- `scripts/runtime-tools.js` provides `list` and `doctor`
- `docs/RUNTIME_TOOLS.md` explains local installation and verification
- do not generate root `.github/workflows/` by default

## Working rules

- read spec from `specs/<slug>/`
- write outputs only to `result/<slug>/`
- keep evidence-backed claims only
- keep explicit status-code coverage
- do not commit real secrets or raw runtime-only artifacts

## Verification lifecycle

Use this skill to drive the full cycle:

1. inspect spec and docs first
2. derive scope, risks, blockers, and status coverage needs
3. create or refresh review and strategy outputs
4. build runnable assets only after the planning layer is coherent
5. execute the smallest safe validation first
6. verify raw evidence
7. verify curated reports against the raw evidence
8. summarize findings, gaps, and next suggestions

## Required depth on every substantial task

After the base lifecycle, run one more depth pass:

1. cross-check findings for contradictions across spec, docs, assets, and evidence
2. classify each major issue by ownership domain
3. perform a likely root-cause check before escalating
4. prioritize recommendations into immediate, next, and later actions
5. re-read the final summary to ensure it does not overclaim confidence

## Mandatory guardrails

- never overwrite or silently normalize the source spec under `specs/`
- if the spec is wrong or incomplete, record it and propose fixes separately under `result/`
- do not report product issues before checking whether the failure is caused by the testing asset
- do not claim broad coverage when only happy-path cases exist
- do not stop at symptom reporting when the likely cause and next discriminating check can be stated safely
- do not end with generic recommendations; advice must be actionable and prioritized

## Default outputs to expect

- `01-review/` for spec and evidence analysis
- `02-strategy/` for plan, priority, and risk decisions
- `04-traceability/` for operation/status/case mapping
- `05-postman/`, `06-env/`, `07-data/`, `08-helpers/`, `09-performance/` for runnable and support assets
- `10-reports/` for curated execution evidence and report verification

## Finding quality bar

Each major finding should ideally contain:

- `Observation`
- `Evidence`
- `Classification`
- `Likely cause`
- `Confidence boundary`
- `Recommendation`
