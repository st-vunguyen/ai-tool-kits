# API Testing Kit — Practical Guideline (English)

> Canonical support sources: `.github/prompts/`, `.claude/agents/`, `.claude/rules/`, `.claude/skills/`, `templates/api-pack/`, `scripts/`, `specs/`, and `result/`.

> Vietnamese version: `docs/GUIDELINE.vn.md`

## 1. Practical Goal

This kit exists to turn an OpenAPI or Swagger specification into reusable API testing assets with traceability and evidence.

The canonical flow is:

```text
Spec → Review → Strategy → Runnable Assets → Execution → Evidence
```

The goal is not just to produce a collection that passes. The goal is to produce a pack that is clear enough to:

- review the specification and find gaps early
- prioritize the right testing scope
- scaffold functional, scenario, performance, and security assets quickly
- run through consistent runtime wrappers
- store evidence and reports in the correct locations

## 2. Required Operating Model

### Source of truth

- The spec lives in `specs/<slug>/`.
- The canonical prompt source lives in `.github/prompts/`.
- Outputs are written only into `result/<slug>/`.

### Output model

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

### Command policy

- All usage instructions must go through `pnpm` or `pnpx`.
- Do not require users to type raw `node`, `bash`, `brew`, or `docker` commands.
- Repository wrappers choose the local binary or container automatically when executing.

## 3. Recommended Process

### Step 1 — Prepare the runtime

```bash
pnpm install
pnpm run runtime:plan
pnpm run runtime:prepare
pnpm run runtime:doctor
```

### Step 2 — Scaffold the workspace for one API

```bash
pnpm run apply:dry-run -- --slug <slug>
pnpm run apply -- --slug <slug>
```

If the spec is not in the default file location, pass the path explicitly:

```bash
pnpm run apply -- --slug <slug> --spec specs/<slug>/openapi.yaml
```

### Step 3 — Run the correct prompt for the correct phase

- Start with `.github/prompts/00-orchestration/00-run-pipeline.prompt.md` if you want the full flow.
- Or select individual prompts based on the current scope.
- Every output must land in the matching phase under `result/<slug>/`.

### Step 4 — Produce runnable assets

- `01-review/`: lint, spec review, auth, pagination, patterns, snapshot
- `02-strategy/`: strategy, scope, risk, priority
- `03-scenarios/`: journeys, integration, regression
- `04-traceability/`: status matrix, mapping, coverage model
- `05-postman/`, `06-env/`, `07-data/`, `08-helpers/`, `09-performance/`: runnable packs and runbooks

### Step 5 — Run through standard wrappers

```bash
pnpm run tool:newman -- run result/<slug>/05-postman/collection.json
pnpm run tool:k6 -- run result/<slug>/09-performance/k6-script.js
pnpm run tool:zap -- -cmd -version
pnpm run tool:jmeter -- -n -t result/<slug>/09-performance/jmeter/test-plan.jmx
```

### Step 6 — Store evidence and reports

- Raw outputs go into `result/<slug>/10-reports/raw/`.
- Curated reports go into `result/<slug>/10-reports/<run-slug>/`.
- Keep asset issues, system issues, and evidence gaps separate.

### Step 7 — Run a final trust pass when needed

- Use `.github/prompts/05-maintenance/27-verification-findings-and-recommendations.prompt.md` when you need a triage-quality verification pack.
- This pass should check contradictions, likely root cause, confidence boundaries, and prioritized recommendations.
- Write the output to `result/<slug>/10-reports/verification/<run-slug>/`.

## 4. Choose the Right Flow

### Full pipeline

Use this when you need a complete QA baseline for a new API.

- Start with the orchestration prompt.
- Move from review → strategy → functional → performance/security.
- When the spec changes, run maintenance and refresh only the impacted areas.

### Functional-first

Use this when the near-term goal is smoke, regression, or contract coverage.

- Prioritize `01` → `09`.
- Add `10` → `17` if business journeys are more complex.
- Defer performance and security if prerequisites are not ready.

### Performance-first

Use this when a basic functional pack already exists and you need a clear workload model.

- Prioritize `18`, `19`, `21`, and `23` → `26`.
- Always record assumptions, thresholds, and evidence sources.

### Security baseline

Use this when you need an early ZAP baseline scan.

- Prioritize `01`, `02`, `06`, and `20`.
- Do not claim the system is secure when only baseline evidence exists.

## 5. Mandatory Guardrails

- Do not stop at success-only coverage when the spec contains evidenced status codes beyond the happy path.
- Do not commit real secrets or current-value environments.
- Do not write outputs outside `result/<slug>/`.
- Do not treat this repo like an application repo; do not generate product runtime code or CI by default.
- When evidence is missing, write `Unknown / needs confirmation` instead of inventing behavior.

## 6. Handoff Checklist

- `pnpm run runtime:doctor` confirms the runtime needed for the current flow.
- `result/<slug>/` uses the correct phase layout.
- `04-traceability/` clearly reflects multi-status coverage.
- `10-reports/` separates raw artifacts and curated findings.
- Runbooks, env templates, and sample data match the intended runner behavior.

## 7. Common Mistakes to Avoid

### Treating the collection as the final goal

A collection is only a tool. Without strategy, coverage is often shallow or misplaced.

### Asserting behavior that the spec does not prove

Examples include:

- assuming a default sort order
- assuming all error schemas are identical
- assuming rate-limit headers always exist
- assuming eventual consistency is a bug

If the spec does not prove it, record it as a gap.

### Creating environment files without a contract

Future users need to know:

- which variables are set manually
- which variables are captured dynamically
- which variables are derived
- which variables are required for each flow

### Running performance tests in a non-approved environment

This is the riskiest mistake. Performance prompts should default to safe execution assumptions until the environment is explicitly approved.

### Keeping raw output without curated evidence

Raw logs, CSV files, and HTML reports are not enough for decision-making. You still need a report that explains:

- what was executed
- where it ran
- what limits were enabled
- which numbers are reliable
- which conclusions remain assumptions
