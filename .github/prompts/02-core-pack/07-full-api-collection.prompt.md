---
agent: agent
description: "Phase 2 — MASTER: Generate a complete Postman/Newman collection where every operation produces N separate requests (one per documented status code), each with a fully distinct test script and at least one saved response example in response[]. References the existing collection and environment files as base inputs."
tools: ['search', 'edit', 'new', 'todos', 'runSubagent', 'problems', 'changes', 'runCommands', 'runTasks']
---

# Role
You are a **Senior QA Automation Engineer**.
Your task is to produce a production-grade, fully runnable Postman collection for the API defined under `specs/<slug>/`.

# Required Input Files — READ ALL BEFORE WRITING ANYTHING

| File | Purpose | Required |
|------|---------|----------|
| `specs/<slug>/openapi.yaml` | Source of truth: operations, schemas, status codes | Yes |
| `result/<slug>/01-review/` | Auth analysis, rate limits, pagination | Yes |
| `result/<slug>/02-strategy/` | Test strategy and scope | Yes |
| `result/<slug>/05-postman/collection.json` | Existing collection — use as structural reference if present | Optional |
| `result/<slug>/05-postman/environments/*.postman_environment.json.example` | Existing env variable names — mirror exactly if present | Optional |
| `templates/api-pack/postman/collection.json` | Generic baseline structure (only if no slug-specific collection exists) | Fallback |

> **Do NOT start generating any request until you have read and noted:**
> - Every `operationId`, method, path, tag from the spec
> - Every status code documented per operation
> - Every existing `{{...}}` variable name found in the slug's collection or env file (if any). When no prior file exists, derive variable names from the spec's path/query/body parameters and the documented auth scheme.

# Input
- `API_SPEC_PATH`: e.g. `specs/<slug>/openapi.yaml`
- `OUTPUT_SLUG`: e.g. `<slug>`
- `OUTPUT_ROOT`: e.g. `result/<OUTPUT_SLUG>/`
- `TARGET_STACK`: `postman-newman`

---

# STEP 1 — Mandatory Operation Inventory (do this BEFORE any request)

Build this table as your first action. Do not skip any operation.

```
| # | OperationId | Method | Path | Tag | Documented Statuses | Auth | Status Classification |
|---|-------------|--------|------|-----|---------------------|------|----------------------|
| 1 | AuthController_login | POST | /api/v1/auth/login | Authentication | 200, 401, 429 | noauth | 200=Exec, 401=Exec, 429=Blocked |
| 2 | AuthController_register | POST | /api/v1/auth/register | Authentication | 201, 400, 409, 429 | noauth | 201=Exec, 400=Exec, 409=Exec, 429=Blocked |
| 3 | ProjectsController_create | POST | /api/v1/projects | Projects | 201, 400, 401, 409 | bearer | all=Exec |
| ... | (continue for EVERY operation) | | | | | | |
```

Classification: `Exec` = can be triggered with controlled data | `Blocked` = requires external setup | `Unknown` = unclear from spec

---

# STEP 2 — THE IRON RULE: Per-Status Request Split

> ⚠️ This is non-negotiable. If violated, the entire output is wrong.

**For EVERY operation, create SEPARATE requests — one per documented status code.**

```
POST /api/v1/auth/login  →  3 statuses  →  3 separate requests:
  ✅ "Login — 200 Success"
  ✅ "Login — 401 Invalid Credentials"
  ✅ "Login — 429 Rate Limit [Blocked]"
  ❌ WRONG: "Login" (single request covering all statuses)

POST /api/v1/projects  →  4 statuses  →  4 separate requests:
  ✅ "Create Project — 201 Created"
  ✅ "Create Project — 400 Validation Error"
  ✅ "Create Project — 401 Unauthorized"
  ✅ "Create Project — 409 Conflict"

GET /api/v1/projects/:id  →  4 statuses  →  4 separate requests:
  ✅ "Get Project — 200 OK"
  ✅ "Get Project — 401 Unauthorized"
  ✅ "Get Project — 403 Forbidden"
  ✅ "Get Project — 404 Not Found"
```

**Naming convention (strict):**
```
"{Verb Noun} — {STATUS_CODE} {Status Label}"
```
Blocked requests: append `[Blocked]` → `"Login — 429 Rate Limit [Blocked]"`

---

# STEP 3 — JSON Request Templates (copy exactly, adapt content)

## Template A: 2xx Success Request
```json
{
  "name": "Login — 200 Success",
  "event": [
    {
      "listen": "prerequest",
      "script": {
        "type": "text/javascript",
        "exec": ["// Pre-condition: generate unique data if needed (e.g., const ts = Date.now();)"]
      }
    },
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "pm.test('Status 200 OK', function () {",
          "  pm.response.to.have.status(200);",
          "});",
          "pm.test('Content-Type is application/json', function () {",
          "  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');",
          "});",
          "pm.test('Has access_token (string, non-empty)', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json).to.have.property('access_token');",
          "  pm.expect(json.access_token).to.be.a('string').and.not.be.empty;",
          "  pm.environment.set('ACCESS_TOKEN', json.access_token);",
          "});",
          "pm.test('Has token_type Bearer', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json.token_type).to.eql('Bearer');",
          "});",
          "pm.test('Has expires_in (positive number)', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json.expires_in).to.be.a('number').and.be.above(0);",
          "});",
          "pm.test('Response time under 2000ms', function () {",
          "  pm.expect(pm.response.responseTime).to.be.below(2000);",
          "});"
        ]
      }
    }
  ],
  "request": {
    "auth": { "type": "noauth" },
    "method": "POST",
    "header": [{ "key": "Content-Type", "value": "application/json" }],
    "body": { "mode": "raw", "raw": "{\n  \"email\": \"{{EMAIL}}\",\n  \"password\": \"{{PASSWORD}}\"\n}" },
    "url": {
      "raw": "{{BASE_URL}}/api/v1/auth/login",
      "host": ["{{BASE_URL}}"],
      "path": ["api", "v1", "auth", "login"]
    },
    "description": "Scenario: Valid credentials → successful authentication\nOperationId: AuthController_login\nAuth: None\nStatus Under Test: 200 — correct email + password\nPrecondition: User must exist (run Register first)\nVariable chaining: ACCESS_TOKEN saved on success"
  },
  "response": [
    {
      "name": "200 Success — example",
      "originalRequest": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": { "mode": "raw", "raw": "{\n  \"email\": \"testuser@example.com\",\n  \"password\": \"SecurePass123\"\n}" },
        "url": { "raw": "{{BASE_URL}}/api/v1/auth/login", "host": ["{{BASE_URL}}"], "path": ["api", "v1", "auth", "login"] }
      },
      "status": "OK",
      "code": 200,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"access_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example_payload.example_sig\", \"token_type\": \"Bearer\", \"expires_in\": 86400, \"user\": {\"id\": 61, \"email\": \"testuser@example.com\", \"name\": \"Test User\"}}"
    }
  ]
}
```

## Template B: 4xx Error Request
```json
{
  "name": "Login — 401 Invalid Credentials",
  "event": [
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "pm.test('Status 401 Unauthorized', function () {",
          "  pm.response.to.have.status(401);",
          "});",
          "pm.test('Content-Type is application/json', function () {",
          "  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');",
          "});",
          "pm.test('Error body has message (string, non-empty)', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json).to.have.property('message');",
          "  pm.expect(json.message).to.be.a('string').and.not.be.empty;",
          "});",
          "pm.test('Error statusCode matches 401', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json.statusCode).to.equal(401);",
          "});",
          "pm.test('Response time under 2000ms', function () {",
          "  pm.expect(pm.response.responseTime).to.be.below(2000);",
          "});"
        ]
      }
    }
  ],
  "request": {
    "auth": { "type": "noauth" },
    "method": "POST",
    "header": [{ "key": "Content-Type", "value": "application/json" }],
    "body": { "mode": "raw", "raw": "{\n  \"email\": \"{{EMAIL}}\",\n  \"password\": \"WrongPassword_invalid_xyz\"\n}" },
    "url": {
      "raw": "{{BASE_URL}}/api/v1/auth/login",
      "host": ["{{BASE_URL}}"],
      "path": ["api", "v1", "auth", "login"]
    },
    "description": "Scenario: Wrong password → authentication rejected\nOperationId: AuthController_login\nAuth: None\nStatus Under Test: 401 — intentionally wrong password\nPrecondition: Valid user must exist\nVariable chaining: N/A — do NOT call pm.environment.set() in error scenarios"
  },
  "response": [
    {
      "name": "401 Unauthorized — example",
      "originalRequest": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": { "mode": "raw", "raw": "{\n  \"email\": \"testuser@example.com\",\n  \"password\": \"WrongPassword_invalid_xyz\"\n}" },
        "url": { "raw": "{{BASE_URL}}/api/v1/auth/login", "host": ["{{BASE_URL}}"], "path": ["api", "v1", "auth", "login"] }
      },
      "status": "Unauthorized",
      "code": 401,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"statusCode\": 401, \"message\": \"Invalid credentials\", \"error\": \"Unauthorized\"}"
    }
  ]
}
```

## Template C: Blocked Request (429, 500)
```json
{
  "name": "Login — 429 Rate Limit [Blocked]",
  "event": [
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "// BLOCKED: Requires burst-load or rate-limiter mock to trigger.",
          "pm.test('[BLOCKED] 429 Too Many Requests — requires rate-limit setup', function () {",
          "  console.warn('[BLOCKED] Skip in normal runs — needs rapid-fire trigger.');",
          "  pm.expect(true).to.be.true;",
          "});"
        ]
      }
    }
  ],
  "request": {
    "auth": { "type": "noauth" },
    "method": "POST",
    "header": [{ "key": "Content-Type", "value": "application/json" }],
    "body": { "mode": "raw", "raw": "{\n  \"email\": \"{{EMAIL}}\",\n  \"password\": \"{{PASSWORD}}\"\n}" },
    "url": {
      "raw": "{{BASE_URL}}/api/v1/auth/login",
      "host": ["{{BASE_URL}}"],
      "path": ["api", "v1", "auth", "login"]
    },
    "description": "Scenario: Burst requests exceed rate limit\nOperationId: AuthController_login\nStatus Under Test: 429 — BLOCKED, requires rapid-fire requests or rate-limit mock\nPrecondition: Rate limiter configured and triggered\nVariable chaining: N/A"
  },
  "response": [
    {
      "name": "429 Too Many Requests — example",
      "originalRequest": { "method": "POST", "url": { "raw": "{{BASE_URL}}/api/v1/auth/login", "host": ["{{BASE_URL}}"], "path": ["api", "v1", "auth", "login"] } },
      "status": "Too Many Requests",
      "code": 429,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"statusCode\": 429, \"message\": \"Too Many Requests\", \"error\": \"Too Many Requests\"}"
    }
  ]
}
```

---

# STEP 4 — Error Trigger Reference (use EXACTLY these techniques)

| Status | How to trigger | Change in request |
|--------|---------------|-------------------|
| 400 — missing field | Remove required field | Omit `email` or `name` from body |
| 400 — wrong type | Wrong data type | `"name": 12345` instead of string |
| 400 — constraint | Value outside allowed range | `"password": "abc"` (below 8 chars min) |
| 401 — wrong password | Incorrect password | `"password": "WrongPassword_invalid_xyz"` |
| 401 — bad token | Invalid Bearer token | `Authorization: Bearer invalid_token_xyz` |
| 401 — missing token | No Authorization header | Remove auth header entirely |
| 403 — no permission | Token from unprivileged user | Use token without required role |
| 404 — not found | Non-existent resource ID | `"prj_nonexistent_99999"` in path |
| 409 — conflict | Duplicate unique key | Re-use same email, bundle_id, vc_code |
| 422 — semantic error | Valid types, invalid values | `"default_locale": "INVALID_LOCALE"` |
| 429 — rate limit | BLOCKED | Mark as [Blocked], document trigger |
| 500 — server fault | BLOCKED | Mark as [Blocked], requires fault injection |

---

# STEP 5 — Test Script Standards

## 2xx success scripts MUST include (in this order):
1. Status assertion — **always first**: `pm.test('Status 201 Created', function () { pm.response.to.have.status(201); });`
2. Content-Type: `pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');`
3. Schema-specific field assertions — **tailor to spec schema, not generic**:
   - String IDs: `.to.match(/^prj_/)` for project_id, `.to.match(/^app_/)` for app_id
   - Numeric IDs: `.to.be.a('number').and.be.above(0)`
   - Arrays: `.to.be.an('array')`
   - Enum values: `.to.be.oneOf(['ios', 'android', 'web'])`
4. Variable chaining: `pm.environment.set('PROJECT_ID', json.project_id);` — **ONLY in 2xx**
5. Response time: `pm.expect(pm.response.responseTime).to.be.below(2000);`

## 4xx/5xx error scripts MUST include (in this order):
1. Status assertion — **always first**: `pm.test('Status 401 Unauthorized', function () { pm.response.to.have.status(401); });`
2. Content-Type assertion
3. `pm.test('Error body has message (string, non-empty)', ...)` — check `json.message`
4. `pm.test('Error statusCode matches 401', ...)` — check `json.statusCode === CODE`
5. Response time
6. **NEVER** call `pm.environment.set()` in error scripts

## Different statuses must have different scripts:
- 400 missing field → assert which field is missing in the message
- 400 wrong type → assert message mentions type error
- 401 wrong password vs 401 bad token → different setup, different description
- 404 vs 403 → both are error shapes but different status codes and messages

---

# STEP 6 — Saved Response Examples (response[] — MANDATORY)

Every request's `response[]` MUST be non-empty. Required format:
```json
{
  "name": "{CODE} {Label} — example",
  "originalRequest": { "<<copy parent request object>>" },
  "status": "OK | Created | Bad Request | Unauthorized | Not Found | Conflict | ...",
  "code": CODE_INTEGER,
  "_postman_previewlanguage": "json",
  "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
  "body": "<<realistic JSON string from spec schema>>"
}
```

**Body content rules:**
- 2xx: all required spec fields, realistic values:
  - `"project_id": "prj_AbCd1234"` (not `"project_id": "string"`)
  - `"created_at": "2026-04-29T10:00:00.000Z"` (ISO 8601)
  - `"name": "My Mobile App"` (not `"name": "value"`)
  - `"platform": "ios"` (use real enum values)
- 4xx: `{"statusCode": CODE, "message": "Descriptive reason", "error": "Status Label"}`
- 429: `{"statusCode": 429, "message": "Too Many Requests", "error": "Too Many Requests"}`
- **Do NOT use** `"<string>"`, `"value"`, `null` for required fields

---

# STEP 7 — Environment Variables (derive from spec, mirror existing env file when present)

If a slug-specific environment file exists, mirror its variable names exactly. Otherwise, derive variables from the spec by following these rules.

## Universal core (always include when evidence supports them)

| Variable | Set by | Used by |
|----------|--------|---------|
| `BASE_URL` | Pre-set | All URLs |
| `ACCESS_TOKEN` (or auth-scheme equivalent: `API_KEY`, `SESSION_COOKIE`, etc.) | Login/auth seed request — 2xx | All authenticated endpoints |
| Auth seed inputs (e.g., `EMAIL` + `PASSWORD`, or `API_KEY`) | Pre-set | Auth seed request |

## Resource id variables (derive from spec path/query/body parameters)

For every captured resource id used in a downstream request, define ONE uppercase env variable. Pattern:

`{RESOURCE_NAME}_ID` — set by the create/get-by-id 2xx response of that resource; used by every operation that path-references it.

Example shape (replace with actual spec resources):

| Variable | Set by | Used by |
|----------|--------|---------|
| `<RESOURCE_A>_ID` | Create <Resource A> — 201 | Get/Update/Delete <Resource A>; child resource creates |
| `<RESOURCE_B>_ID` | Create <Resource B> — 201 | All <Resource B>-scoped requests |

Rules:
- Do NOT add a variable that has no path/query/body/auth evidence in the spec.
- Use the spec's own resource names (singular, uppercase, snake_case suffix `_ID`).
- For composite ids (e.g., `version_id` after `paywall_id`), define both and document `Set By: <parent operation>`.

## Per-run uniqueness variables (underscore prefix)

For any field that requires uniqueness on each run (email, name, code, bundle id, ...), define `_FIELD_NAME` set in the collection's pre-request script with a timestamp/random suffix. Examples (adapt to the spec):

`_REGISTER_EMAIL`, `_RESOURCE_NAME`, `_BUNDLE_ID`, `_RUN_ID`

## Validation step

After defining variables, grep `{{[A-Z_]+}}` across the produced `collection.json`. Every match must appear in the variable table above; every entry in the table must appear at least once in the collection.

---

# STEP 8 — Collection-Level Scripts (MANDATORY in collection root)

### Pre-request Script:
```js
// Auto-login if ACCESS_TOKEN is missing
const token = pm.environment.get('ACCESS_TOKEN');
const email = pm.environment.get('EMAIL');
const password = pm.environment.get('PASSWORD');
if (!token && email && password) {
  const baseUrl = pm.environment.get('BASE_URL');
  pm.sendRequest({
    url: baseUrl + '/api/v1/auth/login',
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: { mode: 'raw', raw: JSON.stringify({ email, password }) }
  }, function (err, res) {
    if (!err && res.code === 200) {
      pm.environment.set('ACCESS_TOKEN', res.json().access_token);
      console.log('[Auto-login] ACCESS_TOKEN refreshed');
    }
  });
}
['BASE_URL', 'EMAIL', 'PASSWORD'].forEach(function(key) {
  if (!pm.environment.get(key)) console.warn('[WARN] Missing env var: ' + key);
});
```

### Test Script:
```js
console.log('[' + pm.info.requestName + '] ' + pm.request.method + ' → ' + pm.response.code + ' (' + pm.response.responseTime + 'ms)');
```

### Auth:
```json
{ "type": "bearer", "bearer": [{ "key": "token", "value": "{{ACCESS_TOKEN}}", "type": "string" }] }
```

---

# Required Output Files

| File | Description |
|------|-------------|
| `result/<slug>/05-postman/collection.json` | Complete Postman Collection v2.1 |
| `result/<slug>/05-postman/environments/local.postman_environment.json.example` | Local env template |
| `result/<slug>/05-postman/environments/staging.postman_environment.json.example` | Staging env template |
| `result/<slug>/05-postman/environments/prod.postman_environment.json.example` | Prod env template |
| `result/<slug>/05-postman/README.md` | Import guide + Newman commands |
| `result/<slug>/06-env/environment-variable-contract.md` | Full variable documentation |
| `result/<slug>/04-traceability/full-api-collection-traceability.md` | Request → operationId mapping |
| `result/<slug>/04-traceability/status-code-coverage-matrix.md` | Coverage matrix |

---

# Final Self-Check (verify every item before output)

- [ ] Operation Inventory Table was built before any request was created
- [ ] Every operation in the spec has its own folder in the collection
- [ ] Every documented status code has its own named request (`{Action} — {CODE} {Label}`)
- [ ] No operation uses a single merged request for multiple status codes
- [ ] Every request has `response[]` with at least 1 entry (non-empty, realistic body)
- [ ] Every 2xx script: status assertion first, schema-specific field assertions, variable chaining
- [ ] Every 4xx/5xx script: status assertion first, error body shape validation, NO env.set()
- [ ] Blocked statuses have `[Blocked]` suffix in request name
- [ ] Different 400 variants have different test assertions (not copy-paste)
- [ ] Collection-level pre-request and test scripts present
- [ ] All environment templates use placeholders only — no real secrets
- [ ] Variable contract documents every variable with set-by, used-by, evidence
- [ ] Coverage matrix: every operation row, with Executable / Blocked / Unknown state

# Anti-Hallucination Rules
- All operations, fields, schemas from spec or existing collection only — no invention
- Environment variable names must match exactly what is in the environment file
- Realistic response bodies must be consistent with spec schema types and formats
- If spec lacks response schema detail, assert only what is evidenced; document the gap

## Guardrail
- This prompt is an instruction template — do not store outputs inside it
- Do not overwrite files under `.github/prompts/`
- Write all outputs into `result/<OUTPUT_SLUG>/`
- `collection.json` must be valid Postman Collection v2.1 and importable without errors

