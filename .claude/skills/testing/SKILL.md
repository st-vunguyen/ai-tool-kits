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
├── README.md
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
	├── raw/
	├── performance/
	├── security-baseline/
	├── verification/
	└── maintenance/
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
- keep `result/<slug>/README.md` as the landing page for the pack
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

## Required Output Files enforcement (MANDATORY)

This skill enforces output file completeness as a first-class quality gate.

### After every generation step

1. **List every file** declared in the step's `Required Output Files` section.
2. **Verify existence and content**: each file must exist on disk with non-trivial, spec-aligned content — not placeholder text, not empty arrays, not stub outlines.
3. **Emit a checklist** with ✅ (present + populated) or ❌ (missing or empty) for every file.
4. **Block the next step** if any file is ❌; resolve the gap first.
5. **Never summarize a phase as "complete"** unless every required file is confirmed ✅.

### Per-status collection verification

Before declaring any Postman collection output done, verify all of the following:

| Check | Pass criterion |
|---|---|
| Operation inventory | Every spec operation has a row; no operations omitted |
| Per-status requests | Each operation has exactly N requests where N = documented status codes |
| Request naming | All follow `"{Verb Noun} — {CODE} {Label}"` pattern |
| response[] populated | No request has `"response": []` |
| Test scripts — status | Every request asserts `pm.response.to.have.status(N)` |
| Test scripts — time | Every request asserts response time |
| Test scripts — Content-Type | Every request asserts Content-Type header |
| Test scripts — 2xx schema | 2xx requests assert key response fields |
| Test scripts — 4xx message | 4xx requests assert error message field |
| Auth env vars | No hard-coded tokens; all use `{{env_var}}` references |
| Error triggers | 400 = invalid payload; 401 = bad/missing token; 403 = wrong scope; 404 = non-existent ID |
| Collection-level scripts | Pre-request and Tests tabs at collection root present |

### Pipeline phase gates

- Phases execute in strict sequence: Phase 1 → 2 → 3 → 4.
- Phase N+1 may not begin until Phase N's Required Output Files checklist is 100% ✅.
- If a phase is partial, emit: `Phase N: PARTIAL — blocked on: <list of ❌ files>` and stop.
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

## Reporting expectations

For meaningful execution, maintenance, performance, security-baseline, or verification outputs:

- keep raw machine outputs under `10-reports/raw/`
- keep curated markdown handoff files under `10-reports/<report-family>/<run-slug>/`
- include `dashboard.html` when the stack or renderer supports a polished executive view
- ensure the dashboard links back to the markdown handoff and raw evidence
- keep the top section optimized for quick triage: overall status, major findings, blockers, and next actions
- do not place curated runs directly under `10-reports/`; use `performance`, `security-baseline`, `verification`, or `maintenance`

## Finding quality bar

Each major finding should ideally contain:

- `Observation`
- `Evidence`
- `Classification`
- `Likely cause`
- `Confidence boundary`
- `Recommendation`
