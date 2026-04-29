---
agent: agent
description: "Phase 4 of 4 — Non-functional, Security & Reporting: Run prompts 18 through 22 and optional 23–27. Covers performance scenarios, k6/Newman performance collections, ZAP security baseline, performance execution, and maintenance/verification reports."
tools: ['search', 'edit', 'new', 'todos', 'runSubagent', 'problems', 'changes', 'runCommands', 'runTasks']
---

# Phase 4 — Non-functional, Security & Reporting

You are a **QA Program Orchestrator**.
Execute prompts 18–22 in order, then optional 23–27 if in scope.
**Complete each step's required files before proceeding.**

## Inputs

```
API_SPEC_PATH              = specs/<slug>/openapi.yaml
OUTPUT_SLUG                = <slug>
BASE_URL                   = <fill if live target available>
RUN_ADVANCED_PERFORMANCE   = yes | no
ADVANCED_PERFORMANCE_STACK = none | jmeter
```

## Pre-flight: Verify Phase 3 Outputs Exist

Before starting, confirm:
- `result/<slug>/05-postman/collection.json`
- `result/<slug>/02-strategy/test-strategy.md`
- `result/<slug>/03-scenarios/regression-scenarios.md`

---

## Step 18 — Performance Scenarios

**Prompt:** `.github/prompts/04-non-functional/18-performance-scenarios.prompt.md`
> Read this file fully before executing.

Identify endpoints with performance/load testing value from the test strategy and spec.
Define workload profiles: smoke test, load test, stress test, spike test.

**Required Output Files:**
- [ ] `result/<slug>/03-scenarios/performance-scenarios.md`
- [ ] `result/<slug>/03-scenarios/performance-thresholds-and-assumptions.md`

If no safe target or insufficient evidence: write skip to `result/<slug>/03-scenarios/performance-SKIPPED.md`

**Gate check:** Both files exist OR skip recorded → proceed to Step 19.

---

## Step 19 — Performance Collection (k6 / Newman)

**Prompt:** `.github/prompts/04-non-functional/19-performance-collection.prompt.md`
> Read this file fully before executing. Dependency: uses Step 18 output.

**Required Output Files:**
- [ ] `result/<slug>/09-performance/k6-script.js`
- [ ] `result/<slug>/09-performance/execution-config.json`
- [ ] `result/<slug>/09-performance/local.env.example`
- [ ] `result/<slug>/09-performance/newman-performance.collection.json`
- [ ] `result/<slug>/09-performance/newman-performance.postman_environment.json.example`
- [ ] `result/<slug>/09-performance/README.md`
- [ ] `result/<slug>/02-strategy/performance-collection-reporting.md`

**Gate check:** k6 script and config exist → proceed to Step 20.

---

## Step 20 — ZAP Security Baseline

**Prompt:** `.github/prompts/04-non-functional/20-zap-security-scanning.prompt.md`
> Read this file fully before executing.

Skip if `BASE_URL` is not available or scanning is not permitted.

**Required Output Files (if applicable):**
- [ ] `result/<slug>/09-performance/zap/zap-baseline.conf.yaml`
- [ ] `result/<slug>/09-performance/zap/zap-api-scan.yaml`
- [ ] `result/<slug>/10-reports/security-baseline/zap-setup.md`
- [ ] `result/<slug>/10-reports/security-baseline/security-scope.md`

If skipped: write `result/<slug>/10-reports/security-baseline/SKIPPED.md` with reason.

**Gate check:** ZAP config exists OR skip recorded → proceed to Step 21.

---

## Step 21 — Performance Execution & Reporting

**Prompt:** `.github/prompts/04-non-functional/21-fully-performance-testing.prompt.md`
> Read this file fully before executing. Dependency: Steps 18 and 19 must be complete.

Skip if target environment is not safe for load testing.

**Required Output Files (if executable):**
- [ ] `result/<slug>/09-performance/README.md` (updated with execution guide)
- [ ] `result/<slug>/10-reports/raw/performance/<run-slug>/` (raw output)
- [ ] `result/<slug>/10-reports/performance/<run-slug>/performance-report.md`
- [ ] `result/<slug>/10-reports/performance/<run-slug>/dashboard.html`

If skipped: `result/<slug>/10-reports/performance/SKIPPED.md`

**Gate check:** Report exists OR skip recorded → proceed to Step 22.

---

## Step 22 — Maintenance & Refresh Report

**Prompt:** `.github/prompts/05-maintenance/22-maintenance-fully-api-testing.prompt.md`
> Read this file fully before executing.

**Required Output Files:**
- [ ] `result/<slug>/10-reports/maintenance/<run-slug>/maintenance-report.md`
- [ ] `result/<slug>/10-reports/maintenance/<run-slug>/refresh-scope.md`

---

## Optional: Step 23–26 — Advanced JMeter Extension

Run only if `ADVANCED_PERFORMANCE_STACK=jmeter` or `RUN_ADVANCED_PERFORMANCE=yes`.

### Step 23 — JMeter Stack Setup
- [ ] `result/<slug>/09-performance/jmeter/setup-guide.md`
- [ ] `result/<slug>/09-performance/jmeter/plugins.md`
- [ ] `result/<slug>/02-strategy/jmeter-tooling-decision.md`

### Step 24 — JMeter Convert Collections
- [ ] `result/<slug>/09-performance/jmeter/test-plan.jmx`
- [ ] `result/<slug>/04-traceability/jmeter-conversion-traceability.md`
- [ ] `result/<slug>/03-scenarios/jmeter-workload-notes.md`

### Step 25 — JMeter Execute & Report
- [ ] `result/<slug>/10-reports/raw/performance/jmeter/<run-slug>/`
- [ ] `result/<slug>/10-reports/performance/jmeter/<run-slug>/jmeter-report.md`

### Step 26 — JMeter Report Analysis
- [ ] `result/<slug>/10-reports/performance/jmeter/<run-slug>/analysis.md`
- [ ] `result/<slug>/10-reports/performance/jmeter/<run-slug>/dashboard.html`

---

## Optional: Step 27 — Final Verification & Recommendations

**Prompt:** `.github/prompts/05-maintenance/27-verification-findings-and-recommendations.prompt.md`
> Recommended when deliverable requires explicit trust decision.

**Required Output Files:**
- [ ] `result/<slug>/10-reports/verification/<run-slug>/verification-report.md`
- [ ] `result/<slug>/10-reports/verification/<run-slug>/contradictions.md`
- [ ] `result/<slug>/10-reports/verification/<run-slug>/recommendations.md`
- [ ] `result/<slug>/10-reports/verification/<run-slug>/dashboard.html`

---

## Phase 4 Completion Checklist

```
result/<slug>/03-scenarios/performance-scenarios.md                         ✅/❌/⏭️
result/<slug>/03-scenarios/performance-thresholds-and-assumptions.md        ✅/❌/⏭️
result/<slug>/09-performance/k6-script.js                                   ✅/❌/⏭️
result/<slug>/09-performance/execution-config.json                          ✅/❌/⏭️
result/<slug>/09-performance/local.env.example                              ✅/❌/⏭️
result/<slug>/09-performance/newman-performance.collection.json             ✅/❌/⏭️
result/<slug>/09-performance/newman-performance.postman_environment.json.example ✅/❌/⏭️
result/<slug>/09-performance/README.md                                      ✅/❌/⏭️
result/<slug>/02-strategy/performance-collection-reporting.md               ✅/❌/⏭️
result/<slug>/10-reports/security-baseline/zap-setup.md                    ✅/❌/⏭️
result/<slug>/10-reports/performance/<run-slug>/performance-report.md       ✅/❌/⏭️
result/<slug>/10-reports/maintenance/<run-slug>/maintenance-report.md       ✅/❌
```

---

## Pipeline Complete — Final Summary

After Phase 4, produce a master summary:

### Pipeline Execution Summary

| Phase | Steps | Status | Files Created |
|-------|-------|--------|---------------|
| Phase 1 — Review & Strategy | 01–06 | ✅/⏭️/❌ | N files |
| Phase 2 — Core Pack | 07–09 | ✅/⏭️/❌ | N files |
| Phase 3 — Scenario Packs | 10–17 | ✅/⏭️/❌ | N files |
| Phase 4 — Non-functional | 18–22 | ✅/⏭️/❌ | N files |
| Phase 4 Optional — JMeter | 23–26 | ✅/⏭️/❌ | N files |
| Phase 4 Optional — Verification | 27 | ✅/⏭️/❌ | N files |

### Open Items
List any steps that were skipped or blocked with reason and follow-up action.

### Next Recommended Action
- If all phases complete: run collection in Postman or via Newman
- If Phase 2 incomplete: stop here, Phase 2 is the critical blocker

### Update phase progress

**Update `result/<slug>/_phase-progress.md`** — set Phase 4 (and Phase 4 optional rows when in scope) to `✅ complete` (or `🟡 partial` / `❌ blocked` / `⏭️ skipped` with note), today's ISO date, and the file count produced by this phase.

## Guardrail
- Do not overwrite files under `.github/prompts/`
- All skipped steps must have a SKIPPED.md file
- Never commit real credentials or secrets
