---
agent: agent
description: "Phase 2b — EXPANSION: Take an existing Postman collection (one request per endpoint) and expand every request into N separate per-status-code requests, each with its own distinct test script, trigger data, and saved response example. Designed to upgrade a happy-path-only collection to full status coverage."
tools: ['search', 'edit', 'new', 'todos', 'runSubagent', 'problems', 'changes', 'runCommands', 'runTasks']
---

# Role
You are a **Senior QA Automation Engineer**.
Your task is to upgrade an existing Postman collection from **one-request-per-endpoint** to **one-request-per-status-code**, fully covering all documented status codes.

# When to use this prompt
Use this prompt when:
- An existing collection was generated with happy-path-only requests
- The `response[]` arrays are empty or missing in most requests
- Test scripts only check `200` or `201` without error scenario coverage
- You need to **add** error cases to an existing collection without rebuilding from scratch

Do NOT use this prompt to create a new collection from scratch — use `07-full-api-collection.prompt.md` instead.

# Required Input Files

| File | Purpose | Required |
|------|---------|----------|
| `result/<slug>/05-postman/collection.json` | The existing collection to expand | Yes |
| `specs/<slug>/openapi.yaml` | Source of truth for documented status codes per operation | Yes |
| `result/<slug>/05-postman/environments/*.postman_environment.json.example` | Existing env variable names — mirror exactly when present | Optional |
| `result/<slug>/06-env/.env.example` | CLI env names | Optional |

> **Domain-neutral usage**: examples below use generic resource names (`Resource A`, `prj_nonexistent_99999` style ids). When applying this prompt, replace example identifiers with the actual operations and id formats evidenced in the slug's spec. Never invent resources that the spec does not document.

# Step 1 — Audit the Existing Collection

For each request in the existing collection, produce an audit table:

```
| Folder | Request Name | OperationId | Method | Path | Current Status Covered | Missing Statuses |
|--------|-------------|-------------|--------|------|------------------------|-----------------|
| 01 — Authentication | Register User | AuthController_register | POST | /api/v1/auth/register | 201 | 400, 409, 429 |
| 01 — Authentication | Login User | AuthController_login | POST | /api/v1/auth/login | 200 | 401, 429 |
| 01 — Authentication | Get Profile | AuthController_getProfile | GET | /api/v1/auth/profile | 200 | 401 |
| 03 — Projects | Create Project | ProjectsController_create | POST | /api/v1/projects | 201 | 400, 401, 409 |
| ... | ... | ... | ... | ... | ... | ... |
```

This audit drives the expansion. Every "Missing Status" becomes a new request to create.

# Step 2 — Rename Existing Requests

Rename each existing request from its plain name to the per-status convention:

```
BEFORE: "Register User"
AFTER:  "Register User — 201 Created"

BEFORE: "Login User"  
AFTER:  "Login — 200 Success"

BEFORE: "Create Project"
AFTER:  "Create Project — 201 Created"
```

Also enrich the existing test script to be schema-specific (if it was only checking status code).

# Step 3 — Create Missing Per-Status Requests

For every missing status code identified in Step 1, create a new request following these patterns:

## Pattern: 400 Validation Error
```json
{
  "name": "{Action} — 400 Validation Error",
  "event": [
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "pm.test('Status 400 Bad Request', function () {",
          "  pm.response.to.have.status(400);",
          "});",
          "pm.test('Content-Type is application/json', function () {",
          "  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');",
          "});",
          "pm.test('Error body has message (string, non-empty)', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json).to.have.property('message');",
          "  pm.expect(json.message).to.be.a('string').and.not.be.empty;",
          "});",
          "pm.test('Error statusCode is 400', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json.statusCode).to.equal(400);",
          "});",
          "pm.test('Response time under 2000ms', function () {",
          "  pm.expect(pm.response.responseTime).to.be.below(2000);",
          "});"
        ]
      }
    }
  ],
  "request": {
    "<<same auth, method, url as parent operation>>": "",
    "body": { "mode": "raw", "raw": "{ <<body with MISSING required field — e.g., omit email>> }" },
    "description": "Scenario: Missing required field → validation error\nOperationId: <<operationId>>\nStatus Under Test: 400 — required field omitted from body\nPrecondition: None\nVariable chaining: N/A — do NOT call pm.environment.set()"
  },
  "response": [
    {
      "name": "400 Bad Request — example",
      "status": "Bad Request", "code": 400,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"statusCode\": 400, \"message\": [\"email must be an email\"], \"error\": \"Bad Request\"}"
    }
  ]
}
```

## Pattern: 401 Unauthorized (missing/invalid token)
```json
{
  "name": "{Action} — 401 Unauthorized",
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
          "pm.test('Error body has message', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json).to.have.property('message').that.is.a('string').and.not.be.empty;",
          "});",
          "pm.test('Error statusCode is 401', function () {",
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
    "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "invalid_token_xyz", "type": "string" }] },
    "<<same method, url as parent operation>>": "",
    "description": "Scenario: Invalid/missing Bearer token → request rejected\nOperationId: <<operationId>>\nStatus Under Test: 401 — intentionally invalid token\nPrecondition: None\nVariable chaining: N/A"
  },
  "response": [
    {
      "name": "401 Unauthorized — example",
      "status": "Unauthorized", "code": 401,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"statusCode\": 401, \"message\": \"Unauthorized\", \"error\": \"Unauthorized\"}"
    }
  ]
}
```

## Pattern: 403 Forbidden
```json
{
  "name": "{Action} — 403 Forbidden",
  "event": [
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "pm.test('Status 403 Forbidden', function () {",
          "  pm.response.to.have.status(403);",
          "});",
          "pm.test('Error body has message', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json).to.have.property('message').that.is.a('string').and.not.be.empty;",
          "});",
          "pm.test('Error statusCode is 403', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json.statusCode).to.equal(403);",
          "});",
          "pm.test('Response time under 2000ms', function () {",
          "  pm.expect(pm.response.responseTime).to.be.below(2000);",
          "});"
        ]
      }
    }
  ],
  "request": {
    "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{ACCESS_TOKEN}}", "type": "string" }] },
    "<<same method, url as parent — use token from user without required permission>>": "",
    "description": "Scenario: Valid token but insufficient permission → access denied\nOperationId: <<operationId>>\nStatus Under Test: 403 — token from user without required role/permission\nPrecondition: Authenticated user exists but lacks required permission\nVariable chaining: N/A"
  },
  "response": [
    {
      "name": "403 Forbidden — example",
      "status": "Forbidden", "code": 403,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"statusCode\": 403, \"message\": \"Forbidden resource\", \"error\": \"Forbidden\"}"
    }
  ]
}
```

## Pattern: 404 Not Found
```json
{
  "name": "{Action} — 404 Not Found",
  "event": [
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "pm.test('Status 404 Not Found', function () {",
          "  pm.response.to.have.status(404);",
          "});",
          "pm.test('Error body has message', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json).to.have.property('message').that.is.a('string').and.not.be.empty;",
          "});",
          "pm.test('Error statusCode is 404', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json.statusCode).to.equal(404);",
          "});",
          "pm.test('Response time under 2000ms', function () {",
          "  pm.expect(pm.response.responseTime).to.be.below(2000);",
          "});"
        ]
      }
    }
  ],
  "request": {
    "auth": { "type": "bearer", "bearer": [{ "key": "token", "value": "{{ACCESS_TOKEN}}", "type": "string" }] },
    "<<same method as parent — use non-existent ID in path, e.g., prj_nonexistent_99999>>": "",
    "description": "Scenario: Non-existent resource ID → not found\nOperationId: <<operationId>>\nStatus Under Test: 404 — path param contains non-existent ID\nPrecondition: Valid auth token\nVariable chaining: N/A"
  },
  "response": [
    {
      "name": "404 Not Found — example",
      "status": "Not Found", "code": 404,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"statusCode\": 404, \"message\": \"Project not found\", \"error\": \"Not Found\"}"
    }
  ]
}
```

## Pattern: 409 Conflict
```json
{
  "name": "{Action} — 409 Conflict",
  "event": [
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "pm.test('Status 409 Conflict', function () {",
          "  pm.response.to.have.status(409);",
          "});",
          "pm.test('Error body has message', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json).to.have.property('message').that.is.a('string').and.not.be.empty;",
          "});",
          "pm.test('Error statusCode is 409', function () {",
          "  const json = pm.response.json();",
          "  pm.expect(json.statusCode).to.equal(409);",
          "});",
          "pm.test('Response time under 2000ms', function () {",
          "  pm.expect(pm.response.responseTime).to.be.below(2000);",
          "});"
        ]
      }
    }
  ],
  "request": {
    "<<same auth, method, url as parent — body uses DUPLICATE unique key>>": "",
    "description": "Scenario: Duplicate unique key → conflict\nOperationId: <<operationId>>\nStatus Under Test: 409 — re-use same email/name/code/bundle_id that already exists\nPrecondition: Resource with this unique key already exists\nVariable chaining: N/A"
  },
  "response": [
    {
      "name": "409 Conflict — example",
      "status": "Conflict", "code": 409,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"statusCode\": 409, \"message\": \"Email already exists\", \"error\": \"Conflict\"}"
    }
  ]
}
```

## Pattern: 429 Rate Limit [Blocked]
```json
{
  "name": "{Action} — 429 Rate Limit [Blocked]",
  "event": [
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "// BLOCKED: Requires burst-load trigger or rate-limiter mock.",
          "pm.test('[BLOCKED] 429 Too Many Requests — requires rate-limit setup', function () {",
          "  console.warn('[BLOCKED] Skipped in normal runs. Trigger: send 100+ requests/min.');",
          "  pm.expect(true).to.be.true;",
          "});"
        ]
      }
    }
  ],
  "request": {
    "<<same as success request>>": "",
    "description": "Scenario: Burst traffic exceeds rate limit\nStatus Under Test: 429 — BLOCKED, requires rapid-fire requests\nPrecondition: Rate limiter configured\nVariable chaining: N/A"
  },
  "response": [
    {
      "name": "429 Too Many Requests — example",
      "status": "Too Many Requests", "code": 429,
      "_postman_previewlanguage": "json",
      "header": [{ "key": "Content-Type", "value": "application/json; charset=utf-8" }],
      "body": "{\"statusCode\": 429, \"message\": \"Too Many Requests\", \"error\": \"Too Many Requests\"}"
    }
  ]
}
```

# Step 4 — Enrich Existing 2xx Request Test Scripts

For each existing success request, if the test script is minimal (only status check), replace it with schema-specific assertions. Example for `Register User — 201 Created`:

```js
// BEFORE (minimal):
pm.test('Status 201 Created', function () { pm.response.to.have.status(201); });

// AFTER (schema-specific):
pm.test('Status 201 Created', function () { pm.response.to.have.status(201); });
pm.test('Content-Type is application/json', function () {
  pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});
pm.test('Has access_token (string, non-empty)', function () {
  const json = pm.response.json();
  pm.expect(json).to.have.property('access_token').that.is.a('string').and.not.be.empty;
  pm.environment.set('ACCESS_TOKEN', json.access_token);
});
pm.test('Has token_type Bearer', function () {
  pm.expect(pm.response.json().token_type).to.eql('Bearer');
});
pm.test('Has user object with id, email, name', function () {
  const json = pm.response.json();
  pm.expect(json.user).to.have.property('id').that.is.a('number');
  pm.expect(json.user).to.have.property('email').that.is.a('string');
  pm.expect(json.user).to.have.property('name').that.is.a('string');
});
pm.test('Response time under 2000ms', function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

# Step 5 — Populate response[] for All Requests

Any request where `response[]` is empty (`[]`) must have at least 1 saved example added.
Follow the format in `07-full-api-collection.prompt.md` Step 6.

Key rules:
- Use realistic field values matching spec schema (not `"string"`, `"value"`, `null`)
- Match the exact body structure of the API (use any existing environment file values as reference when present)
- Mirror the spec's id format exactly: prefixed strings (e.g., `prj_*`, `app_*`) keep the prefix; numeric ids stay integers > 0; UUIDs stay UUID v4 — derive the pattern from the spec's example values, not from a fixed convention.

# Output

Produce the expanded `collection.json` at:
`result/<slug>/05-postman/collection.json`

Also update:
- `result/<slug>/04-traceability/status-code-coverage-matrix.md` — add all new requests
- `result/<slug>/04-traceability/full-api-collection-traceability.md` — update mapping

# Self-Check Before Finalizing

- [ ] Audit table completed — every missing status identified
- [ ] Every existing request renamed to `{Action} — {CODE} {Label}` convention
- [ ] Every missing status code has a new request added in the same folder
- [ ] Blocked statuses (429, 500) have `[Blocked]` suffix and placeholder test
- [ ] Every request has `response[]` with at least 1 non-empty saved example
- [ ] 2xx test scripts have schema-specific assertions (not just status check)
- [ ] 4xx/5xx test scripts assert error body shape (message, statusCode)
- [ ] No `pm.environment.set()` in any error scenario script
- [ ] Coverage matrix updated to reflect all new requests

## Guardrail
- Do not overwrite files under `.github/prompts/`
- Write outputs into `result/<OUTPUT_SLUG>/05-postman/` only
- Preserve all existing valid requests — only rename and add, do not delete unless specified
