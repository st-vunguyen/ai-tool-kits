# Postman / Newman Starter Pack

This folder contains the canonical runnable starter for Postman/Newman-based API testing.

## Files

| File | Purpose |
|---|---|
| `collection.json` | Starter Postman v2.1 collection |
| `environments/local.postman_environment.json.example` | Local placeholder environment |
| `environments/staging.postman_environment.json.example` | Staging placeholder environment |
| `environments/prod.postman_environment.json.example` | Production read-only placeholder environment |
| `environments/e2e.local.postman_environment.json.example` | Multi-step API journey placeholder environment |

## Naming Guidance

- Folder names should represent domains or business flows.
- Request names should use method + path or clear business intent.
- Prefix smoke or readonly packs clearly when helpful.

## Newman Examples

```bash
newman run result/<output-slug>/05-postman/collection.json   --environment result/<output-slug>/05-postman/environments/local.postman_environment.json.example

newman run result/<output-slug>/05-postman/collection.json   --environment result/<output-slug>/05-postman/environments/staging.postman_environment.json.example   --folder "Health & Smoke"
```

## Validation Guidance

- Keep assertions evidence-backed.
- Capture variables deliberately and document them in the variable contract.
- Avoid asserting undocumented error messages.
- Use read-only defaults for prod environments.
