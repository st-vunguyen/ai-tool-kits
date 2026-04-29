---
agent: agent
description: "Phase 4 of 4 — Non-functional, Security & Reporting: Run prompts 18 through 22 and optional 23–27. Covers performance scenarios, k6/Newman performance collections, ZAP security baseline, performance execution, and maintenance/verification reports."
tools: ['search', 'edit', 'new', 'todos', 'runSubagent', 'problems', 'changes', 'runCommands', 'runTasks']
---

# Run the Full API Testing Pipeline

Use this prompt as the primary entry point when you want to run the complete API testing pipeline.

## ⚠️ IMPORTANT: Context Window Limitation

Running all 22+ prompts in a single AI session will produce **incomplete, degraded output** because:
- The AI context window fills up → later prompts get less attention
- AI "summarizes" instead of fully executing each step
- Required output files get skipped silently

**The correct approach is to run the 4 phases separately:**

```
Phase 1: .github/prompts/00-orchestration/00-run-phase-1.prompt.md  (prompts 01–06)
Phase 2: .github/prompts/00-orchestration/00-run-phase-2.prompt.md  (prompts 07–09) ← MOST CRITICAL
Phase 3: .github/prompts/00-orchestration/00-run-phase-3.prompt.md  (prompts 10–17)
Phase 4: .github/prompts/00-orchestration/00-run-phase-4.prompt.md  (prompts 18–27)
```

Each phase is self-contained, verifies its own output files, and hands off to the next.

**Run order: Phase 1 → Phase 2 → Phase 3 → Phase 4**

---

## Role

You are a **QA Program Orchestrator, API Test Architect, and Test Tooling Coordinator**.

If the user explicitly requests a single-session pipeline run (accepting degraded output), proceed below.
Otherwise, **redirect to the phase-based approach**.

## Goal

Produce a complete API testing deliverable set covering OpenAPI review, strategy, traceability, operation-by-status coverage, runnable Postman/Newman assets, environment and data helpers, status-driven negative samples, contract/integration/regression/performance packs, security baseline setup, JMeter-grade performance tooling when needed, and fully executed performance evidence where safe and supported.

The pipeline must cover these capability groups:

1. Specification review and normalization
2. Risk and strategy synthesis
3. Runnable API pack generation with full status-code intent
4. Environment, data, and helper assets
5. Status-driven sample and negative-case assets
6. Advanced scenario packs
7. Contract, integration, regression, and performance assets
8. Security baseline add-on
9. Performance execution and reporting
10. Standard JMeter setup, conversion, execution, and executive analysis when requested
11. Final verification of findings, contradictions, and prioritized recommendations when handoff trust must be explicit

## Inputs

- `API_SPEC_PATH`: path to the OpenAPI YAML or JSON file
- `DOCS_PATHS`: one or more supporting documentation folders
- `OUTPUT_SLUG`: shared output slug such as `<slug>`
- `TARGET_STACK`: default `postman-newman`
- `INCLUDE_MERMAID`: `yes` or `no` (default to `yes` only when the evidence is strong enough)
- `BASE_URL`: optional; used for security and performance execution when a permitted target exists
- `AUTH_MODE`: `none | bearer | api-key` (descriptive only; no secrets)
- `RUN_FULL_OPTIONALS`: `yes | no`
- `ADVANCED_PERFORMANCE_STACK`: `none | jmeter` (default `none`)
- `RUN_ADVANCED_PERFORMANCE`: `yes | no`

## Canonical Output Roots

- Human-readable artifacts: `result/<OUTPUT_SLUG>/...`
- Runnable assets: `result/<OUTPUT_SLUG>/...`
- Runtime tooling contract: `tooling/runtime-tools.json`, `scripts/runtime-tools.js`, and runner wrappers under `result/<OUTPUT_SLUG>/09-performance/`
- Dashboard reporting contract: `templates/api-pack/reports/dashboard-reporting-contract.md` and `templates/api-pack/reports/dashboard-html-guidelines.md`

## Bootstrap Support Files First

Before evaluating prompt `01`, inspect this repo for the required support files and confirm the target output root under `result/<OUTPUT_SLUG>/`.

For best cross-tool compatibility, reuse both support layouts:

- `AGENTS.md`
- `.claude/agents/api-testing-qc.agent.md`
- `.claude/agents/api-spec-reviewer.agent.md`
- `.claude/agents/api-report-verifier.agent.md`
- `.claude/skills/reporting/SKILL.md`
- `.claude/skills/testing/SKILL.md`
- `.claude/skills/testing/references/test-helpers-api.md`
- `.claude/rules/planning.md`
- `.claude/rules/testing.md`
- `.claude/rules/reporting.md`
- `.claude/rules/verification-depth.md`
- `.claude/rules/security.md`
- `.claude/skills/analysis/SKILL.md`
- `.github/prompts/**/*.prompt.md`
- `.vscode/settings.json`
- `docs/RUNTIME_TOOLS.md`
- `tooling/runtime-tools.json`
- `scripts/runtime-tools.js`

If the repo deliberately uses only one active instruction model, prefer the editor-loaded `.claude/*` guidance and keep the prompt library under `.github/prompts/` consistent with it.

If an equivalent file already exists, do not overwrite blindly; compare intent and refresh only when the existing file is clearly outdated or incomplete.

Record which support files were reused, copied, refreshed, or skipped with reason.

## Full-Coverage Rule

When running this full pipeline:

- You **must evaluate every prompt from `01` through `21`**.
- If `ADVANCED_PERFORMANCE_STACK=jmeter` or `RUN_ADVANCED_PERFORMANCE=yes`, you **must also evaluate prompts `23` through `26`**.
- You **must not silently omit any prompt**.
- If a prompt does not apply to the target API, you must still:
  - mark it as `Skipped with reason`
  - explain the non-applicability condition
  - state which artifacts were not created
  - describe the impact on coverage or readiness

Examples of controlled skips:

- `10-e2e-journeys-doc` when there is not enough evidence for multi-step journeys
- `11-e2e-collection` when `10` cannot establish runnable journeys
- `14-integration-flows-doc` or `15-integration-collection` when no supported integration flows exist in the spec or docs
- `18-performance-scenarios` or `19-performance-collection` when there is not enough evidence to define workload candidates responsibly
- `20-zap-security-scanning` when there is no permitted HTTP surface or no `BASE_URL`
- `21-fully-performance-testing` when the target environment is unsafe for performance execution, no workload artifact exists yet, or the selected stack only supports planning but not responsible execution
- `23-jmeter-stack-setup` through `26-jmeter-report-analysis` when advanced JMeter coverage is out of scope, no standard JMeter workflow is needed, or the environment/tooling cannot support a trustworthy JMeter path yet

Even when skipped, the prompt must still appear in the final orchestration summary.

Prompt `27` is a recommended final assurance gate when the deliverable must include an explicit trust decision, contradiction review, root-cause framing, and prioritized recommendations.

## Full-Status Coverage Rule

The full pipeline must not describe an API as fully covered when only the success path is implemented.

- For each in-scope operation, identify all evidenced response codes from spec/docs/runtime
- Ensure prompts `06`, `07`, `09`, `12`, `13`, and `22` explicitly account for those response codes
- If a status code is not yet executable, record it as `Blocked`, `Planned`, `Unknown / needs confirmation`, or `Out of scope with reason`
- Require a sample payload, setup note, or precondition reference for each executable status case

## Required Execution Order

### Review and Strategy

1. `../01-review-and-strategy/01-openapi-lint-verify.prompt.md`
   - Output: `result/<OUTPUT_SLUG>/01-review/openapi-quality/`
   - Purpose: review lint and normalization issues in the spec

2. `../01-review-and-strategy/02-auth-limits-analysis.prompt.md`
   - Output: `result/<OUTPUT_SLUG>/01-review/auth-and-limits/`
   - Purpose: analyze authentication, authorization, and throttling behavior

3. `../01-review-and-strategy/03-pagination-filtering-review.prompt.md`
   - Output: `result/<OUTPUT_SLUG>/01-review/pagination-filtering/`
   - Purpose: document list semantics, filtering, search, and sorting behavior

4. `../01-review-and-strategy/04-test-patterns-review.prompt.md`
   - Output: `result/<OUTPUT_SLUG>/01-review/test-patterns/`
   - Purpose: define naming, assertion, fixture, and cleanup conventions

5. `../01-review-and-strategy/05-oas-snapshot.prompt.md`
   - Output: `result/<OUTPUT_SLUG>/01-review/oas-snapshot/`
   - Purpose: create a fast-review snapshot and inventory of the OpenAPI spec

6. `../01-review-and-strategy/06-comprehensive-test-strategy.prompt.md`
   - Output: `result/<OUTPUT_SLUG>/02-strategy/`
   - Purpose: synthesize the complete API test strategy
   - Dependency: must use the findings from `01` through `05`

### Runnable Packs and Specialized Assets

7. `../02-core-pack/07-full-api-collection.prompt.md`
   - Output roots:
     - `result/<OUTPUT_SLUG>/05-postman/`
     - `result/<OUTPUT_SLUG>/06-env/`
     - `result/<OUTPUT_SLUG>/04-traceability/`
  - Purpose: generate the baseline full API collection pack with operation-by-status coverage, not just happy-path requests

8. `../02-core-pack/08-refresh-environment-files.prompt.md`
   - Output roots:
     - `result/<OUTPUT_SLUG>/06-env/`
     - `result/<OUTPUT_SLUG>/04-traceability/environment-variable-contract.md`
   - Purpose: refresh environment templates and the variable contract

9. `../02-core-pack/09-data-driven-samples.prompt.md`
   - Output roots:
     - `result/<OUTPUT_SLUG>/07-data/`
     - `result/<OUTPUT_SLUG>/04-traceability/data-driven-samples-mapping.md`
  - Purpose: generate synthetic sample datasets, including endpoint/status-driven negative and edge cases

10. `../03-scenario-packs/10-e2e-journeys-doc.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/03-scenarios/e2e-journeys.md`
      - `result/<OUTPUT_SLUG>/03-scenarios/e2e-journeys-traceability.md`
      - optional Mermaid file
    - Purpose: document evidence-backed E2E journeys

11. `../03-scenario-packs/11-e2e-collection.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/05-postman/e2e.collection.json`
      - `result/<OUTPUT_SLUG>/08-helpers/e2e-runbook.md`
      - `result/<OUTPUT_SLUG>/04-traceability/e2e-collection-traceability.md`
    - Dependency: should run after `10`

12. `../03-scenario-packs/12-contract-coverage-plan.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/04-traceability/contract-coverage-plan.md`
      - `result/<OUTPUT_SLUG>/04-traceability/contract-traceability-matrix.md`
  - Purpose: create the contract coverage model across operations, schemas, and evidenced response codes

13. `../03-scenario-packs/13-contract-collection.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/05-postman/contract.collection.json`
      - `result/<OUTPUT_SLUG>/04-traceability/contract-collection-coverage.md`
    - Dependency: should use the output of `12`

14. `../03-scenario-packs/14-integration-flows-doc.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/03-scenarios/integration-flows.md`
      - `result/<OUTPUT_SLUG>/03-scenarios/integration-flows-traceability.md`
      - optional Mermaid file

15. `../03-scenario-packs/15-integration-collection.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/05-postman/integration.collection.json`
      - `result/<OUTPUT_SLUG>/08-helpers/integration-fixtures.md`
      - `result/<OUTPUT_SLUG>/08-helpers/integration-runbook.md`
      - `result/<OUTPUT_SLUG>/04-traceability/integration-collection-traceability.md`
    - Dependency: should run after `14`

16. `../03-scenario-packs/16-regression-scenarios.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/03-scenarios/regression-scenarios.md`
      - `result/<OUTPUT_SLUG>/03-scenarios/regression-priority-matrix.md`

17. `../03-scenario-packs/17-regression-collection.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/05-postman/regression.collection.json`
      - `result/<OUTPUT_SLUG>/08-helpers/regression-runbook.md`
      - `result/<OUTPUT_SLUG>/04-traceability/regression-collection-traceability.md`
    - Dependency: should run after `16`

18. `../04-non-functional/18-performance-scenarios.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/03-scenarios/performance-scenarios.md`
      - `result/<OUTPUT_SLUG>/03-scenarios/performance-thresholds-and-assumptions.md`

19. `../04-non-functional/19-performance-collection.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/09-performance/k6-script.js`
      - `result/<OUTPUT_SLUG>/09-performance/execution-config.json`
      - `result/<OUTPUT_SLUG>/09-performance/local.env.example`
      - `result/<OUTPUT_SLUG>/09-performance/newman-performance.collection.json`
      - `result/<OUTPUT_SLUG>/09-performance/newman-performance.postman_environment.json.example`
      - `result/<OUTPUT_SLUG>/09-performance/README.md`
      - `result/<OUTPUT_SLUG>/02-strategy/performance-collection-reporting.md`
    - Dependency: should run after `18`

20. `../04-non-functional/20-zap-security-scanning.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/09-performance/zap/`
      - and/or `result/<OUTPUT_SLUG>/10-reports/security-baseline/`
    - Purpose: configure a warn-only security baseline when scanning is permitted

21. `../04-non-functional/21-fully-performance-testing.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/09-performance/`
      - `result/<OUTPUT_SLUG>/10-reports/raw/performance/<run-slug>/`
      - `result/<OUTPUT_SLUG>/10-reports/performance/<run-slug>/`
      - `result/<OUTPUT_SLUG>/10-reports/performance/<run-slug>/dashboard.html`
    - Dependency: should run after `18` and `19`
    - Purpose: bootstrap tooling, execute the generated performance workload safely, and publish curated evidence

22. `../05-maintenance/22-maintenance-fully-api-testing.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/10-reports/maintenance/<run-slug>/`
      - refreshed assets under the impacted output folders
    - Purpose: refresh the pack after source-spec or scope changes

27. `../05-maintenance/27-verification-findings-and-recommendations.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/10-reports/verification/<run-slug>/verification-report.md`
      - `result/<OUTPUT_SLUG>/10-reports/verification/<run-slug>/contradictions.md`
      - `result/<OUTPUT_SLUG>/10-reports/verification/<run-slug>/recommendations.md`
      - `result/<OUTPUT_SLUG>/10-reports/verification/<run-slug>/dashboard.html`
    - Purpose: perform a final trust pass across findings, contradictions, likely root cause, and prioritized recommendations

### Advanced JMeter Extension

Run these prompts only when advanced JMeter coverage is requested or justified.

23. `../04-non-functional/23-jmeter-stack-setup.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/09-performance/jmeter/`
      - `result/<OUTPUT_SLUG>/02-strategy/jmeter-tooling-decision.md`
    - Purpose: establish a standard JMeter stack, plugin guidance, and dashboard tooling baseline

24. `../04-non-functional/24-jmeter-convert-collections.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/09-performance/jmeter/test-plan.jmx`
      - `result/<OUTPUT_SLUG>/04-traceability/jmeter-conversion-traceability.md`
      - `result/<OUTPUT_SLUG>/03-scenarios/jmeter-workload-notes.md`
    - Dependency: should use the workload intent from `18`, `19`, and any chosen source collections

25. `../04-non-functional/25-jmeter-execute-and-report.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/10-reports/raw/performance/jmeter/<run-slug>/`
      - `result/<OUTPUT_SLUG>/10-reports/performance/jmeter/<run-slug>/`
    - Dependency: should run after `23` and `24`

26. `../04-non-functional/26-jmeter-report-analysis.prompt.md`
    - Output roots:
      - `result/<OUTPUT_SLUG>/10-reports/performance/jmeter/<run-slug>/`
      - `result/<OUTPUT_SLUG>/10-reports/performance/jmeter/<run-slug>/dashboard.html`
    - Dependency: should run after `25`

## Orchestration Rules

When coordinating the full pipeline, you must:

1. Bootstrap support files before prompt `01`.
2. Run prompts `01 → 06` in exact order.
3. Move to prompt `07` only after the strategy baseline from `06` exists.
4. Run prompts `07 → 21` in exact order.
5. If advanced JMeter coverage is in scope, run `23 → 26` in exact order after `21` or after the relevant performance baseline exists.
6. Call out each dependency explicitly when one prompt depends on another.
7. Mark unmet dependencies as `Blocked` or `Skipped with reason`.
8. If a prior output is incomplete, perform a reconciliation pass and state it explicitly.

## Quality Gates

### Gate A — After Review and Strategy

This gate passes only if:

- prompts `01` through `05` are completed or formally skipped with reason
- `06-comprehensive-test-strategy` has synthesized:
  - risk profile
  - scope matrix
  - priority lines
  - traceability
  - risks, gaps, and open questions

### Gate B — After Core Pack Generation

This gate passes only if prompts `07` through `09` have produced:

- a baseline collection pack
- environment templates and variable contract
- data-driven samples and mapping
- an operation-by-status coverage view and per-status sample intent

### Gate C — After Specialized Packs and Execution

This gate passes only if prompts `10` through `21` are all classified as one of:

- `Completed`
- `Skipped with reason`
- `Blocked with explicit dependency gap`

### Gate C.5 — Advanced JMeter Gate

If advanced JMeter coverage is in scope, this gate passes only if prompts `23` through `26` are all classified as one of:

- `Completed`
- `Skipped with reason`
- `Blocked with explicit dependency gap`

### Gate D — Final Full-Pipeline Gate

You may only finish when:

- every prompt from `01` through `21` has been evaluated
- prompts `23` through `26` have also been evaluated when advanced JMeter coverage is in scope
- no prompt is missing from the final summary
- the final summary shows completed, skipped, or blocked status for each prompt

## Required Final Summary Format

At the end of the run, produce a structured summary with these sections:

### 1. Prompt Coverage Summary

| Prompt | Status | Output paths | Notes |
|---|---|---|---|
| 01 | Completed / Skipped / Blocked | ... | ... |
| 02 | ... | ... | ... |
| ... | ... | ... | ... |
| 20 | ... | ... | ... |
| 21 | ... | ... | ... |
| 23 | ... | ... | ... |
| 24 | ... | ... | ... |
| 25 | ... | ... | ... |
| 26 | ... | ... | ... |

### 2. Generated Artifact Summary

- Strategy documents created
- Scenario documents created
- Traceability documents created
- Runnable collections created
- Environment, data, helper, performance, security, JMeter, and execution assets created

### 2.5. Support File Summary

- Exact `.github/prompts/*`, `.claude/*`, and `AGENTS.md` paths created or verified
- Any support files intentionally skipped and why

### 3. Open Questions and Gaps

- unresolved documentation or specification gaps
- prompts skipped or blocked because evidence was insufficient
- manual follow-up items

### 4. Next Recommended Action

- if the full pack is sufficiently complete, recommend execution and reporting next
- if gaps remain, recommend the next prompt or the missing input needed to continue

## Guardrails

- This prompt is an orchestration template and must not store run results inside itself.
- All outputs must be written under the canonical `result/<OUTPUT_SLUG>/...` and `result/<OUTPUT_SLUG>/...` roots.
- Do not invent endpoints, parameters, flows, auth behavior, thresholds, performance targets, or topology beyond the evidence.
- Treat `templates/api-pack/` as the canonical generic starter reference, not as the final project output.
- Treat `templates/examples/` as example or reference artifacts only.

## Final Self-Check

- [ ] Every prompt from `01` through `21` was evaluated
- [ ] Prompts `23` through `26` were evaluated when advanced JMeter coverage was in scope
- [ ] No prompt is missing from the final summary
- [ ] Review and strategy outputs were fed into `06`
- [ ] Downstream dependencies were respected before generating or refreshing later phases
- [ ] Every skipped or blocked item has a clear reason
- [ ] Artifacts were written to the canonical roots
- [ ] No unsupported claims were introduced beyond the evidence

## Execute Now

Run the full API testing pipeline in the order described above.

If `RUN_FULL_OPTIONALS=yes`, attempt every optional prompt that has enough evidence to run responsibly.
If a prompt does not apply, do not omit it silently — record it as `Skipped with reason` in the final summary.
