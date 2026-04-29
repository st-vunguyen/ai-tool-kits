---
agent: agent
description: "Phase 2 of 4 — Core Pack: Run prompts 07 through 09. Generates the full Postman/Newman collection with per-status-code requests, environment templates, variable contract, and data-driven samples. This is the most critical phase — produces the primary runnable testing artifacts."
tools: ['search', 'edit', 'new', 'todos', 'runSubagent', 'problems', 'changes', 'runCommands', 'runTasks']
---

# Phase 2 — Core Pack Generation

You are a **QA Program Orchestrator**.
Execute the 3 core-pack prompts below in exact order. **Do not proceed to the next step until the current step's required files are fully written to disk.**

## Inputs

```
API_SPEC_PATH  = specs/<slug>/openapi.yaml
OUTPUT_SLUG    = <slug>
OUTPUT_ROOT    = result/<slug>/
TARGET_STACK   = postman-newman
```

## Reference Files to Read Before Starting

Read ALL of these before Step 7:
- `specs/<slug>/openapi.yaml` — complete spec (authoritative source)
- `result/<slug>/02-strategy/test-strategy.md` — Phase 1 output
- `result/<slug>/01-review/oas-snapshot/oas-snapshot.md` — operation inventory
- `result/<slug>/01-review/auth-and-limits/auth-and-limits.md` — auth details

If a previous collection or environment exists for this slug, read it as well to preserve naming continuity:
- `result/<slug>/05-postman/collection.json` (if present)
- `result/<slug>/05-postman/environments/*.postman_environment.json.example` (if present)
- `result/<slug>/06-env/.env.example` (if present)

Otherwise, read `templates/api-pack/postman/collection.json` as the structural baseline. Do not assume any project-specific collection or env file is on disk; treat them as optional inputs.

---

## Step 7 — Full API Collection (Per-Status Coverage)

**Prompt:** `.github/prompts/02-core-pack/07-full-api-collection.prompt.md`
> **READ THIS FILE FULLY before executing.** It contains mandatory JSON templates, error trigger reference, and test script standards that must be followed exactly.

### Pre-work (mandatory before writing any JSON):

**7.1 — Build Operation Inventory Table**

List EVERY operation from the spec in this format before generating any collection item:

```
| # | OperationId | Method | Path | Tag | Documented Status Codes | Auth | Status Classification |
|---|-------------|--------|------|-----|------------------------|------|----------------------|
(fill every row — do not skip any operation)
```

Classification: `Exec` = triggerable | `Blocked` = needs setup | `Unknown` = unclear

**7.2 — Per-Status Request Split (IRON RULE)**

For EVERY operation: create N separate requests where N = number of documented status codes.
- `POST /api/v1/auth/login` has 200, 401, 429 → must produce 3 requests:
  - `Login — 200 Success`
  - `Login — 401 Invalid Credentials`
  - `Login — 429 Rate Limit [Blocked]`
- **NEVER** create a single request covering multiple statuses.

### Required Output Files (create ALL before proceeding to Step 8):

- [ ] `result/<slug>/05-postman/collection.json`

  Verify the collection meets ALL of these:
  - Valid Postman Collection v2.1 JSON (has `info.schema` field)
  - Every operation has its own folder (one folder per OpenAPI tag)
  - Every folder contains N requests where N = documented status codes
  - Every request named `"{Verb Noun} — {CODE} {Label}"` (strict convention)
  - Every request has `response[]` with at least 1 saved example (non-empty `body`)
  - Every 2xx test script: status first, Content-Type, schema fields, variable chaining
  - Every 4xx/5xx test script: status first, error body shape, NO `pm.environment.set()`
  - Blocked statuses (429, 500): have `[Blocked]` suffix, placeholder test
  - Collection-level pre-request script (auto-login)
  - Collection-level test script (request logging)
  - Collection-level auth: `bearer` with `{{ACCESS_TOKEN}}`

- [ ] `result/<slug>/05-postman/environments/local.postman_environment.json.example`
- [ ] `result/<slug>/05-postman/environments/staging.postman_environment.json.example`
- [ ] `result/<slug>/05-postman/environments/prod.postman_environment.json.example`
- [ ] `result/<slug>/05-postman/README.md`

  README must include:
  - Import steps for Postman
  - Environment setup instructions
  - Newman command: full run
  - Newman command: happy-path only (tag filter or folder filter)
  - Newman command: single folder run

- [ ] `result/<slug>/04-traceability/full-api-collection-traceability.md`

  Must be a table: `Request Name | OperationId | Method | Path | Status Code | Test Case Label | State`

- [ ] `result/<slug>/04-traceability/status-code-coverage-matrix.md`

  Must be a table: `Operation | Method | Path | Status | Label | State (Exec/Blocked/Unknown) | Precondition`

**Gate check:** All 8 files exist and collection.json has per-status requests for every operation → proceed to Step 8.

---

## Step 8 — Refresh Environment Files & Variable Contract

**Prompt:** `.github/prompts/02-core-pack/08-refresh-environment-files.prompt.md`
> Read this file fully before executing.

**Required Output Files:**
- [ ] `result/<slug>/06-env/environment-variable-contract.md`

  Must document EVERY `{{...}}` variable referenced anywhere in `result/<slug>/05-postman/collection.json`:
  ```
  | Variable | Purpose | Set By | Used By | Required/Optional | Evidence |
  ```
  How to build the variable list:
  1. Grep `{{[A-Z_]+}}` across the collection JSON to enumerate every variable used.
  2. For each path/query/body parameter that captures a resource id, define a paired uppercase env variable (e.g., `/projects/{projectId}` → `PROJECT_ID`). Use the spec's resource names — do not invent variable names that have no evidence in the spec.
  3. Always include the universal core: `BASE_URL`, `ACCESS_TOKEN` (or the equivalent for the documented auth scheme), and any auth seed credentials (e.g., `EMAIL`/`PASSWORD`, `API_KEY`).
  4. For any variable seeded by a 2xx response (`pm.environment.set(...)`), record `Set By` with the request name; otherwise mark `Set By: manual`.
  5. Mark optional variables with `Required/Optional: Optional`.

  Do not hardcode variables that have no path/query/body/auth evidence in the current collection.

- [ ] `result/<slug>/06-env/.env.example`
- [ ] `result/<slug>/06-env/.env.staging.example`
- [ ] `result/<slug>/06-env/.env.prod.example`

**Gate check:** Variable contract covers all collection variables → proceed to Step 9.

---

## Step 9 — Data-Driven Samples

**Prompt:** `.github/prompts/02-core-pack/09-data-driven-samples.prompt.md`
> Read this file fully before executing.

**Required Output Files:**
- [ ] `result/<slug>/07-data/samples/` — at least one sample file per resource type:
  - `result/<slug>/07-data/samples/auth-samples.json`
  - `result/<slug>/07-data/samples/project-samples.json`
  - `result/<slug>/07-data/samples/app-samples.json`
  - (continue for each resource that has a CREATE operation)
- [ ] `result/<slug>/07-data/generators/` — at least one generator script:
  - `result/<slug>/07-data/generators/generate-test-data.js`
- [ ] `result/<slug>/04-traceability/data-driven-samples-mapping.md`

  Must map each sample to its target operation and status code scenario.

**Gate check:** Sample files exist for major resources, mapping doc exists → Phase 2 complete.

---

## Phase 2 Completion Checklist

Verify ALL files before marking Phase 2 done:

```
result/<slug>/05-postman/collection.json                              ✅/❌
result/<slug>/05-postman/environments/local.postman_environment.json.example  ✅/❌
result/<slug>/05-postman/environments/staging.postman_environment.json.example ✅/❌
result/<slug>/05-postman/environments/prod.postman_environment.json.example    ✅/❌
result/<slug>/05-postman/README.md                                    ✅/❌
result/<slug>/04-traceability/full-api-collection-traceability.md     ✅/❌
result/<slug>/04-traceability/status-code-coverage-matrix.md          ✅/❌
result/<slug>/06-env/environment-variable-contract.md                 ✅/❌
result/<slug>/06-env/.env.example                                     ✅/❌
result/<slug>/06-env/.env.staging.example                             ✅/❌
result/<slug>/06-env/.env.prod.example                                ✅/❌
result/<slug>/07-data/samples/<resource>-samples.json (multiple)      ✅/❌
result/<slug>/07-data/generators/generate-test-data.js                ✅/❌
result/<slug>/04-traceability/data-driven-samples-mapping.md          ✅/❌
```

**Update `result/<slug>/_phase-progress.md`** — set Phase 2 row to `✅ complete` (or `🟡 partial` / `❌ blocked` with note), today's ISO date, and the file count produced by this phase.

**After Phase 2 is complete, run:**
`.github/prompts/00-orchestration/00-run-phase-3.prompt.md`

## Guardrail
- Do not overwrite files under `.github/prompts/`
- Do not proceed to next step without completing current step's required files
- collection.json must be valid Postman Collection v2.1 JSON — verify schema field exists
- All environment templates must use `{{PLACEHOLDER}}` only — no real secrets
