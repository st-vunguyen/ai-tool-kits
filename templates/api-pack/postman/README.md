# Postman / Newman Starter Pack

## What this folder is for / Folder này để làm gì

EN:
- Holds runnable API collections engineers can execute (Postman GUI or Newman CLI).
- Each request maps to one operation × one documented status code.
- Each request carries at least one saved response example in `response[]`.

VN:
- Chứa collection API chạy được (Postman GUI hoặc Newman CLI).
- Mỗi request tương ứng 1 operation × 1 status code.
- Mỗi request có ít nhất 1 response example đã lưu trong `response[]`.

## Who reads this / Ai đọc folder này

| Audience | Why |
|---|---|
| QA / dev engineer | Import into Postman, run via Newman |
| QA lead | Open `collection.json` to review test count and naming |
| Stakeholder (non-tech) | Read the curated reports under `10-reports/` instead — Postman files are technical |

## When it gets created / Khi nào folder này được sinh

Phase 2 — `.github/prompts/02-core-pack/07-full-api-collection.prompt.md` (and refresh helpers `07b`, `07c`, `07d`).

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
