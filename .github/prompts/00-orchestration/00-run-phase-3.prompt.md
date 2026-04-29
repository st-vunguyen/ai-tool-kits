---
agent: agent
description: "Phase 3 of 4 — Scenario Packs: Run prompts 10 through 17. Generates E2E journeys, contract, integration, and regression collections. Dependency: Phase 2 must be complete first."
tools: ['search', 'edit', 'new', 'todos', 'runSubagent', 'problems', 'changes', 'runCommands', 'runTasks']
---

# Phase 3 — Scenario Packs

You are a **QA Program Orchestrator**.
Execute prompts 10 through 17 in order. **Complete each step's required files before proceeding.**

## Inputs

```
API_SPEC_PATH = specs/<slug>/openapi.yaml
OUTPUT_SLUG   = <slug>
OUTPUT_ROOT   = result/<slug>/
```

## Pre-flight: Verify Phase 2 Outputs Exist

Before starting, confirm these Phase 2 files exist:
- `result/<slug>/05-postman/collection.json`
- `result/<slug>/02-strategy/test-strategy.md`
- `result/<slug>/04-traceability/status-code-coverage-matrix.md`

If any are missing, **stop and complete Phase 2 first.**

---

## Step 10 — E2E Journeys Documentation

**Prompt:** `.github/prompts/03-scenario-packs/10-e2e-journeys-doc.prompt.md`
> Read this file fully before executing.

Identify multi-step user journeys from the spec. A journey requires at least 2 chained operations.
Generic example shape: Auth (login/register) → Create root resource → Create dependent child resource → Verify state. Use the actual operations evidenced in `specs/<slug>/openapi.yaml` and `result/<slug>/02-strategy/test-strategy.md`; do not invent steps that have no spec evidence.

**Required Output Files:**
- [ ] `result/<slug>/03-scenarios/e2e-journeys/e2e-journeys.md`
- [ ] `result/<slug>/03-scenarios/e2e-journeys/e2e-journeys-traceability.md`

If no evidence for journeys: write `Skipped: insufficient evidence for multi-step journeys` to `result/<slug>/03-scenarios/e2e-journeys/SKIPPED.md`

**Gate check:** Journeys documented OR skip reason recorded → proceed to Step 11.

---

## Step 11 — E2E Collection

**Prompt:** `.github/prompts/03-scenario-packs/11-e2e-collection.prompt.md`
> Read this file fully before executing. Dependency: uses Step 10 output.

**Required Output Files:**
- [ ] `result/<slug>/05-postman/e2e.collection.json`
- [ ] `result/<slug>/08-helpers/e2e-runbook.md`
- [ ] `result/<slug>/04-traceability/e2e-collection-traceability.md`

If Step 10 was skipped: skip this step too and record in `result/<slug>/05-postman/e2e-SKIPPED.md`

**Gate check:** E2E collection exists OR skip recorded → proceed to Step 12.

---

## Step 12 — Contract Coverage Plan

**Prompt:** `.github/prompts/03-scenario-packs/12-contract-coverage-plan.prompt.md`
> Read this file fully before executing.

Contract tests verify schema compliance per operation. Cover:
- Response schema validation per status code
- Required field presence and types
- Breaking change detection candidates

**Required Output Files:**
- [ ] `result/<slug>/04-traceability/contract-coverage-plan.md`
- [ ] `result/<slug>/04-traceability/contract-traceability-matrix.md`

**Gate check:** Both files exist → proceed to Step 13.

---

## Step 13 — Contract Collection

**Prompt:** `.github/prompts/03-scenario-packs/13-contract-collection.prompt.md`
> Read this file fully before executing. Dependency: uses Step 12 output.

**Required Output Files:**
- [ ] `result/<slug>/05-postman/contract.collection.json`
- [ ] `result/<slug>/04-traceability/contract-collection-coverage.md`

**Gate check:** Contract collection exists → proceed to Step 14.

---

## Step 14 — Integration Flows Documentation

**Prompt:** `.github/prompts/03-scenario-packs/14-integration-flows-doc.prompt.md`
> Read this file fully before executing.

Integration flows = operations that depend on outputs from other services or modules.
Generic example shape: create resource A → reference A's id when creating B → verify B reflects A's state. Use the actual cross-resource dependencies evidenced in the spec; do not invent integrations.

**Required Output Files:**
- [ ] `result/<slug>/03-scenarios/integration-flows.md`
- [ ] `result/<slug>/03-scenarios/integration-flows-traceability.md`

If no evidence: write skip reason to `result/<slug>/03-scenarios/integration-SKIPPED.md`

**Gate check:** Flows documented OR skip recorded → proceed to Step 15.

---

## Step 15 — Integration Collection

**Prompt:** `.github/prompts/03-scenario-packs/15-integration-collection.prompt.md`
> Read this file fully before executing. Dependency: uses Step 14 output.

**Required Output Files:**
- [ ] `result/<slug>/05-postman/integration.collection.json`
- [ ] `result/<slug>/08-helpers/integration-fixtures.md`
- [ ] `result/<slug>/08-helpers/integration-runbook.md`
- [ ] `result/<slug>/04-traceability/integration-collection-traceability.md`

**Gate check:** Integration collection exists OR skip recorded → proceed to Step 16.

---

## Step 16 — Regression Scenarios

**Prompt:** `.github/prompts/03-scenario-packs/16-regression-scenarios.prompt.md`
> Read this file fully before executing.

Regression scenarios = operations most likely to break during future changes (high-risk, high-frequency).

**Required Output Files:**
- [ ] `result/<slug>/03-scenarios/regression-scenarios.md`
- [ ] `result/<slug>/03-scenarios/regression-priority-matrix.md`

**Gate check:** Both files exist → proceed to Step 17.

---

## Step 17 — Regression Collection

**Prompt:** `.github/prompts/03-scenario-packs/17-regression-collection.prompt.md`
> Read this file fully before executing. Dependency: uses Step 16 output.

**Required Output Files:**
- [ ] `result/<slug>/05-postman/regression.collection.json`
- [ ] `result/<slug>/08-helpers/regression-runbook.md`
- [ ] `result/<slug>/04-traceability/regression-collection-traceability.md`

**Gate check:** Regression collection exists → Phase 3 complete.

---

## Phase 3 Completion Checklist

```
result/<slug>/03-scenarios/e2e-journeys/e2e-journeys.md                  ✅/❌/⏭️
result/<slug>/03-scenarios/e2e-journeys/e2e-journeys-traceability.md      ✅/❌/⏭️
result/<slug>/05-postman/e2e.collection.json                              ✅/❌/⏭️
result/<slug>/08-helpers/e2e-runbook.md                                   ✅/❌/⏭️
result/<slug>/04-traceability/e2e-collection-traceability.md              ✅/❌/⏭️
result/<slug>/04-traceability/contract-coverage-plan.md                   ✅/❌
result/<slug>/04-traceability/contract-traceability-matrix.md             ✅/❌
result/<slug>/05-postman/contract.collection.json                         ✅/❌
result/<slug>/04-traceability/contract-collection-coverage.md             ✅/❌
result/<slug>/03-scenarios/integration-flows.md                           ✅/❌/⏭️
result/<slug>/03-scenarios/integration-flows-traceability.md              ✅/❌/⏭️
result/<slug>/05-postman/integration.collection.json                      ✅/❌/⏭️
result/<slug>/08-helpers/integration-fixtures.md                          ✅/❌/⏭️
result/<slug>/08-helpers/integration-runbook.md                           ✅/❌/⏭️
result/<slug>/04-traceability/integration-collection-traceability.md      ✅/❌/⏭️
result/<slug>/03-scenarios/regression-scenarios.md                        ✅/❌
result/<slug>/03-scenarios/regression-priority-matrix.md                  ✅/❌
result/<slug>/05-postman/regression.collection.json                       ✅/❌
result/<slug>/08-helpers/regression-runbook.md                            ✅/❌
result/<slug>/04-traceability/regression-collection-traceability.md       ✅/❌
```
Legend: ✅ = created | ❌ = failed | ⏭️ = skipped with reason

**Update `result/<slug>/_phase-progress.md`** — set Phase 3 row to `✅ complete` (or `🟡 partial` / `❌ blocked` with note), today's ISO date, and the file count produced by this phase.

**After Phase 3 is complete, run:**
`.github/prompts/00-orchestration/00-run-phase-4.prompt.md`

## Guardrail
- Do not overwrite files under `.github/prompts/`
- Skipped steps must still produce a SKIPPED.md file explaining why
- All Postman collections must be valid v2.1 JSON
