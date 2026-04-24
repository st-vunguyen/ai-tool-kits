# Status-Code Coverage Matrix

Use this file as the canonical operation-by-status planning view for a generated API testing pack.

| Operation | Status | Case ID | Sample / Precondition | Assertion focus | Evidence | State |
|---|---:|---|---|---|---|---|
| `GET /health` | `200` | `HEALTH-GET-200-01` | N/A | Health response contract | OpenAPI or runtime evidence | Planned |
| `POST /resource` | `201` | `RESOURCE-POST-201-01` | `status-cases/resource.post.201.valid.json` | Create contract and ID capture | OpenAPI response schema | Planned |
| `POST /resource` | `400` | `RESOURCE-POST-400-01` | `status-cases/resource.post.400.missing-required.json` | Validation payload semantics | OpenAPI response schema | Unknown / needs confirmation |
| `POST /resource` | `409` | `RESOURCE-POST-409-01` | Duplicate-key setup | Conflict semantics | Product docs or runtime evidence | Blocked |

## State meanings

- `Covered`: runnable case exists and is wired into the pack
- `Planned`: intended for implementation with enough evidence already present
- `Blocked`: not currently safe or possible to execute
- `Out of scope with reason`: intentionally excluded and justified
- `Unknown / needs confirmation`: evidence is not strong enough yet