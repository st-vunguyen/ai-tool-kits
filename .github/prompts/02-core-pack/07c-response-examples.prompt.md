---
agent: agent
description: "Phase 2c — EXAMPLES: Populate the response[] saved-example arrays for every request in an existing Postman collection. Generates realistic, schema-aligned response bodies for each status code. Use after 07-full-api-collection or 07b-per-status-expansion when response[] entries are missing."
tools: ['search', 'edit', 'new', 'todos', 'runSubagent', 'problems', 'changes', 'runCommands', 'runTasks']
---

# Role
You are a **Senior QA Automation Engineer**.
Your task is to populate the `response[]` array for every request in an existing Postman collection with realistic, schema-aligned saved response examples.

# When to use this prompt
Use this prompt when:
- The collection has per-status-code requests but `response[]` arrays are empty (`[]`)
- Saved examples need to be added or updated with realistic data
- You want to add Postman "example responses" that appear in the response visualization panel

# Required Input Files

| File | Purpose | Required |
|------|---------|----------|
| `result/<slug>/05-postman/collection.json` | Collection to enrich | Yes |
| `specs/<slug>/openapi.yaml` | Response schemas for each operation | Yes |
| `result/<slug>/05-postman/environments/*.postman_environment.json.example` | Existing variable names and sample values to mirror | Optional |

> **Domain-neutral usage**: The reference response payloads later in this prompt use a sample monetization-style domain (project, app, paywall, ...) for illustration. When you apply this prompt to a different spec, replace those payloads with realistic examples derived from the slug's own OpenAPI schemas — keep the structural rules (status codes, header shape, response time, ID format), drop the domain content.

# Step 1 — Audit Empty response[] Arrays

For each request in the collection, identify which have empty `response[]`:

```
| Folder | Request Name | Status Code | response[] Status |
|--------|-------------|-------------|-------------------|
| 01 — Authentication | Login — 200 Success | 200 | EMPTY — needs example |
| 01 — Authentication | Login — 401 Invalid Credentials | 401 | EMPTY — needs example |
| 03 — Projects | Create Project — 201 Created | 201 | EMPTY — needs example |
| ... | ... | ... | ... |
```

# Step 2 — Response Example Format (mandatory structure)

Every saved example MUST follow this exact structure:

```json
{
  "name": "{CODE} {Status Label} — example",
  "originalRequest": {
    "method": "<<same HTTP method as parent request>>",
    "header": [{ "key": "Content-Type", "value": "application/json" }],
    "body": { "mode": "raw", "raw": "<<same body as parent request>>" },
    "url": { "raw": "<<same URL as parent request>>" }
  },
  "status": "<<HTTP status text>>",
  "code": <<status code integer>>,
  "_postman_previewlanguage": "json",
  "header": [
    { "key": "Content-Type", "value": "application/json; charset=utf-8" }
  ],
  "body": "<<stringified realistic JSON response>>"
}
```

# Step 3 — Response Body Templates Per Operation

## Authentication

### POST /api/v1/auth/register — 201 Created
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYxLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc3NDAwMDAwMCwiZXhwIjoxNzc0MDg2NDAwfQ.example_sig",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": { "id": 61, "email": "testuser@example.com", "name": "Test User", "avatar_url": "https://example.com/avatar.jpg" }
}
```

### POST /api/v1/auth/register — 400 Bad Request
```json
{ "statusCode": 400, "message": ["email must be an email", "password must be longer than or equal to 8 characters"], "error": "Bad Request" }
```

### POST /api/v1/auth/register — 409 Conflict
```json
{ "statusCode": 409, "message": "Email already registered", "error": "Conflict" }
```

### POST /api/v1/auth/login — 200 OK
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYxLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc3NDAwMDAwMCwiZXhwIjoxNzc0MDg2NDAwfQ.example_sig",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": { "id": 61, "email": "testuser@example.com", "name": "Test User" }
}
```

### POST /api/v1/auth/login — 401 Unauthorized
```json
{ "statusCode": 401, "message": "Invalid credentials", "error": "Unauthorized" }
```

### GET /api/v1/auth/profile — 200 OK
```json
{ "id": 61, "email": "testuser@example.com", "name": "Test User", "avatar_url": "https://example.com/avatar.jpg", "created_at": "2026-04-29T10:00:00.000Z" }
```

### GET /api/v1/auth/profile — 401 Unauthorized
```json
{ "statusCode": 401, "message": "Unauthorized", "error": "Unauthorized" }
```

## Projects

### POST /api/v1/projects — 201 Created
```json
{ "project_id": "prj_AbCd1234", "name": "My Mobile App", "icon_url": "https://example.com/icon.png", "icon_url_large": "https://example.com/icon-large.png", "created_at": "2026-04-29T10:00:00.000Z", "updated_at": "2026-04-29T10:00:00.000Z" }
```

### POST /api/v1/projects — 400 Bad Request
```json
{ "statusCode": 400, "message": ["name must be a string", "name should not be empty"], "error": "Bad Request" }
```

### POST /api/v1/projects — 401 Unauthorized
```json
{ "statusCode": 401, "message": "Unauthorized", "error": "Unauthorized" }
```

### POST /api/v1/projects — 409 Conflict
```json
{ "statusCode": 409, "message": "Project name already exists", "error": "Conflict" }
```

### GET /api/v1/projects — 200 OK
```json
[{ "project_id": "prj_AbCd1234", "name": "My Mobile App", "created_at": "2026-04-29T10:00:00.000Z" }, { "project_id": "prj_EfGh5678", "name": "Second App", "created_at": "2026-04-28T08:00:00.000Z" }]
```

### GET /api/v1/projects/:id — 200 OK
```json
{ "project_id": "prj_AbCd1234", "name": "My Mobile App", "icon_url": "https://example.com/icon.png", "icon_url_large": "https://example.com/icon-large.png", "created_at": "2026-04-29T10:00:00.000Z", "updated_at": "2026-04-29T10:00:00.000Z" }
```

### GET /api/v1/projects/:id — 404 Not Found
```json
{ "statusCode": 404, "message": "Project not found", "error": "Not Found" }
```

## Apps

### POST /api/v1/projects/:id/apps — 201 Created
```json
{ "app_id": "app_XyZ5678", "name": "iOS App", "platform": "ios", "bundle_id": "com.example.app", "project_id": "prj_AbCd1234", "created_at": "2026-04-29T10:00:00.000Z" }
```

### POST /api/v1/projects/:id/apps — 400 Bad Request
```json
{ "statusCode": 400, "message": ["platform must be one of the following values: ios, android, web", "bundle_id must be a string"], "error": "Bad Request" }
```

### POST /api/v1/projects/:id/apps — 401 Unauthorized
```json
{ "statusCode": 401, "message": "Unauthorized", "error": "Unauthorized" }
```

### POST /api/v1/projects/:id/apps — 409 Conflict
```json
{ "statusCode": 409, "message": "Bundle ID already registered for this project", "error": "Conflict" }
```

## Products

### POST /api/v1/projects/:id/apps/:appId/products — 201 Created
```json
{ "id": 1, "store_id": "monthly_premium", "display_name": "Premium Monthly", "description": "Monthly premium subscription", "app_id": "app_XyZ5678", "created_at": "2026-04-29T10:00:00.000Z" }
```

### GET /api/v1/projects/:id/apps/:appId/products — 200 OK
```json
[{ "id": 1, "store_id": "monthly_premium", "display_name": "Premium Monthly", "app_id": "app_XyZ5678" }, { "id": 2, "store_id": "yearly_premium", "display_name": "Premium Yearly", "app_id": "app_XyZ5678" }]
```

## Virtual Currencies

### POST /api/v1/projects/:id/virtual-currencies — 201 Created
```json
{ "code": "coin_1774157168", "name": "Coins", "description": "In-game currency", "project_id": "prj_AbCd1234", "created_at": "2026-04-29T10:00:00.000Z" }
```

## Entitlements

### POST /api/v1/projects/:id/entitlements — 201 Created
```json
{ "id": 1, "key": "ent_premium", "name": "Premium Access", "description": "Full access to premium features", "project_id": "prj_AbCd1234", "created_at": "2026-04-29T10:00:00.000Z" }
```

## Offerings

### POST /api/v1/projects/:id/offerings — 201 Created
```json
{ "id": 1, "offering_id_key": "offer_1774157168", "name": "Default Offering", "description": "Default monetization offering", "project_id": "prj_AbCd1234", "created_at": "2026-04-29T10:00:00.000Z" }
```

## Customers

### POST /api/v1/projects/:id/customers — 201 Created
```json
{ "id": 1, "app_user_id": "user_1774157168", "display_name": "Test Customer", "project_id": "prj_AbCd1234", "created_at": "2026-04-29T10:00:00.000Z" }
```

## Roles

### POST /api/v1/projects/:id/roles — 201 Created
```json
{ "id": 1, "name": "Analyst", "description": "Read-only analytics access", "permissions": ["analytics:read", "customers:read"], "project_id": "prj_AbCd1234", "created_at": "2026-04-29T10:00:00.000Z" }
```

## Paywalls

### POST /api/v1/projects/:id/paywalls — 201 Created
```json
{ "id": 1, "name": "Summer Sale Paywall", "offering_id": 1, "default_locale": "en_US", "project_id": "prj_AbCd1234", "created_at": "2026-04-29T10:00:00.000Z" }
```

## API Keys

### POST /api/v1/projects/:id/public-api-keys — 201 Created
```json
{ "id": 1, "name": "Production Key", "key": "pk_live_AbCd1234XyZ", "project_id": "prj_AbCd1234", "created_at": "2026-04-29T10:00:00.000Z" }
```

## Generic Error Templates (use for all operations)

### 403 Forbidden
```json
{ "statusCode": 403, "message": "Forbidden resource", "error": "Forbidden" }
```

### 404 Not Found (generic — customize message per resource)
```json
{ "statusCode": 404, "message": "<<Resource>> not found", "error": "Not Found" }
```

### 409 Conflict (generic)
```json
{ "statusCode": 409, "message": "<<Unique field>> already exists", "error": "Conflict" }
```

### 429 Too Many Requests
```json
{ "statusCode": 429, "message": "Too Many Requests", "error": "Too Many Requests" }
```

### 500 Internal Server Error
```json
{ "statusCode": 500, "message": "Internal server error", "error": "Internal Server Error" }
```

# Step 4 — Body Value Rules

When crafting `body` strings for saved examples:

| Field type | Example |
|------------|---------|
| String ID (project) | `"prj_AbCd1234"` |
| String ID (app) | `"app_XyZ5678"` |
| Numeric ID | `1` (integer, not string) |
| Timestamp | `"2026-04-29T10:00:00.000Z"` (ISO 8601) |
| Email | `"testuser@example.com"` |
| JWT token | `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example_payload.example_sig"` |
| Platform enum | `"ios"` or `"android"` or `"web"` |
| Boolean | `true` or `false` (not `"true"`) |
| Empty optional | omit the field, don't use `null` for required fields |
| Array | `[{...}, {...}]` with 2 realistic items |
| Paginated list | `{"data": [{...}], "total": 1, "page": 1, "limit": 20}` (if spec defines pagination) |

**NEVER use:** `"string"`, `"<string>"`, `"value"`, `"example"`, or generic placeholder text.

# Output

Update the collection in place:
`result/<slug>/05-postman/collection.json`

Every request's `response[]` must have at least 1 entry after this prompt runs.

# Self-Check Before Finalizing

- [ ] All requests with empty `response[]` have been identified
- [ ] Every request now has at least 1 saved example in `response[]`
- [ ] Example body values are realistic and schema-consistent (not generic placeholders)
- [ ] ID formats match spec patterns: `prj_*`, `app_*`, numeric integers
- [ ] Timestamps are ISO 8601 format
- [ ] Error examples have `statusCode`, `message`, `error` fields
- [ ] `originalRequest` in each example mirrors the parent request accurately

## Guardrail
- Do not overwrite files under `.github/prompts/`
- Never include real secrets in example bodies
- Body values must be consistent with spec schema — no invention of fields
